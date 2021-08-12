import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Auth} from "../models/auth.model";
import {Subject} from "rxjs";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";

const BACKEND_URL = `${environment.API_URL}/user`;

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isAuthenticated: boolean = false;
    private token: any = ''
    private authStatusListener = new Subject<boolean>();
    private tokenTimer: number = 0;
    private userId: any = '';

    constructor(private http: HttpClient, private router: Router) {
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    getIsAuthenticated() {
        return this.isAuthenticated;
    }

    getUserId() {
        return this.userId;
    }

    createUser(email: string, password: string) {
        const authData: Auth = {email: email, password: password};
        return this.http
            .post(`${BACKEND_URL}/signup`, authData);
    }

    login(email: string, password: string) {
        const authData: Auth = {email: email, password: password};
        this.http
            .post<{ token: string, expires: number, userId: string }>(`${BACKEND_URL}/login`, authData)
            .subscribe(response => {
                const token = response.token
                this.token = token;
                if (token) {
                    const expires = response.expires;
                    this.setAuthTimer(expires);

                    this.userId = response.userId;

                    this.isAuthenticated = true;
                    this.authStatusListener.next(true);

                    const now = new Date();
                    const expiresDate = new Date(now.getTime() + expires * 1000);
                    this.saveAuthData(token, expiresDate, this.userId);

                    this.router.navigate(['/posts/list']);
                }
            });
    }

    getToken() {
        return this.token;
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.userId = null;

        this.router.navigate(['/login']);
    }

    private saveAuthData(token: string, expireDate: Date, userId: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('expireDate', expireDate.toISOString());
        localStorage.setItem('userId', userId);
    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expireDate');
        localStorage.removeItem('userId');
    }

    private getAuthData() {
        const token = localStorage.getItem('token');
        const expireDate = localStorage.getItem('expireDate');
        const userId = localStorage.getItem('userId');
        if (!token || !expireDate) {
            return;
        }
        return {
            token,
            expireDate: new Date(expireDate),
            userId
        };
    }

    private setAuthTimer(expires: number) {
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, expires * 1000);
    }

    autoAuthUser() {
        const authInformation = this.getAuthData();
        const now = new Date();
        if (authInformation) {
            const expires = authInformation.expireDate.getTime() - now.getTime(); // returns millisecond
            if (expires > 0) {
                this.token = authInformation.token;
                this.isAuthenticated = true;
                this.userId = authInformation.userId;
                this.setAuthTimer(expires / 1000);// convert millisecond to second by dividing by 1000
                this.authStatusListener.next(true);
            }
        }
    }
}
