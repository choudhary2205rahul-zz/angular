import {Injectable} from '@angular/core';
import {Post} from "../models/post.model";
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";

const BACKEND_URL = `${environment.API_URL}/posts`;

@Injectable({
    providedIn: 'root'
})
export class PostService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<{posts:Post[], postsCount: number}>();

    constructor(private http: HttpClient, private router: Router) {
    }

    // GET
    getPost(id: string) {
        return this.http.get<{
            message: string, post: {
                _id: string,
                title: string,
                description: string
                image: File,
                creator: string
            }
        }>(`http://localhost:3000/api/posts/${id}`);
    }

    // GET ALL
    getPosts(postsPerPage: number, currentPage: number) {
        const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
        this.http.get<{ message: string, posts: Post[], postsCount: number}>(BACKEND_URL + queryParams)
            .pipe(map((postData) => {
                return {
                    posts: postData.posts.map((post: any) => {
                        return {
                            title: post.title,
                            description: post.description,
                            id: post._id,
                            image: post.image,
                            creator: post.creator
                        }
                    }),
                    postsCount: postData.postsCount
                }
            }))
            .subscribe(transformedPosts => {
                this.posts = transformedPosts.posts;
                this.postsUpdated.next({posts: [...this.posts], postsCount: transformedPosts.postsCount});
            });
        // return [...this.posts];
    }

    getPostsUpdateListener() {
        return this.postsUpdated.asObservable();
    }

    // UPDATE
    updatePost(id: string, post: Post) {
        /*const updatedPost: Post = {id: post.id, description: post.description, title: post.title, image: post.image};*/

        let formData: Post | FormData;
        if (typeof (post.image) === 'object') {
            formData = new FormData();
            formData.append('id', post.id);
            formData.append('title', post.title);
            formData.append('description', post.description);
            formData.append('image', post.image, post.title);
            formData.append('creator', post.creator);
        } else {
            formData = {
                id: post.id,
                title: post.title,
                description: post.description,
                image: post.image,
                creator: post.creator
            }
        }

        this.http.put<{ message: string, post: Post, postsCount: number }>(`${BACKEND_URL}/${id}`, formData).subscribe((data) => {
            /*const updatedPosts = [...this.posts];
            const oldPostIndex = updatedPosts.findIndex(p => p.id === id);

            const post: Post = {
                id: data.post.id,
                title: data.post.title,
                description: data.post.description,
                image: data.post.image
            }

            updatedPosts[oldPostIndex] = post;
            this.posts = updatedPosts;
            this.postsUpdated.next({posts: [...this.posts], postsCount: data.postsCount});*/
            this.router.navigate(['/posts/list']);
        });
    }

    // CREATE
    addPost(post: Post) {
        let formData = new FormData();
        formData.append('id', post.id);
        formData.append('title', post.title);
        formData.append('description', post.description);
        formData.append('image', post.image, post.title);
        /*const newPost: Post = {id: post.id, description: post.description, title: post.title, image: post.image};*/
        this.http.post<{ message: string, post: Post }>(BACKEND_URL, formData).subscribe((data) => {
           /* const postRes: Post = {
                id: data.post.id,
                title: data.post.title,
                description: data.post.description,
                image: data.post.image
            }
            this.posts.push(postRes);
            this.postsUpdated.next([...this.posts]);*/
            this.router.navigate(['/posts/list']);
        });
    }

    // DELETE
    deletePost(id: string) {
        /*this.http.delete<{ message: string }>(`http://localhost:3000/api/posts/${id}`).subscribe((data) => {
            const updatedPosts = this.posts.filter(post => post.id !== id);
            this.posts = updatedPosts;
            this.postsUpdated.next([...this.posts]);
        });*/

        return this.http.delete<{ message: string }>(`${BACKEND_URL}/${id}`);
    }
}
