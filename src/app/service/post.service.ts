import {Injectable} from '@angular/core';
import {Post} from "../models/post.model";
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class PostService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient, private router: Router) {
    }

    getPost(id: string) {
        return this.http.get<{ message: string, post: {_id: string, title: string, description: string} }>(`http://localhost:3000/api/posts/${id}`);
    }

    getPosts() {
        this.http.get<{ message: string, posts: Post[] }>('http://localhost:3000/api/posts')
            .pipe(map((postData) => {
                return postData.posts.map((post:any) => {
                    return {
                        title: post.title,
                        description: post.description,
                        id: post._id
                    }
                })
            }))
            .subscribe(transformedPosts => {
                this.posts = transformedPosts;
                this.postsUpdated.next([...this.posts]);
            });
        // return [...this.posts];
    }

    getPostsUpdateListener() {
        return this.postsUpdated.asObservable();
    }

    updatePost(postId: string, post: Post) {
        const updatedPost: Post = {id: post.id, description: post.description, title: post.title};
        console.log(updatedPost);
        this.http.put<{ message: string}>(`http://localhost:3000/api/posts/${postId}`, updatedPost).subscribe((data) => {
            const updatedPosts = [...this.posts];
            const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
            updatedPosts[oldPostIndex] = post;
            this.posts = updatedPosts;
            this.postsUpdated.next([...this.posts]);
            this.router.navigate(['/']);
        });
    }

    addPost(post: Post) {
        const newPost: Post = {id: post.id, description: post.description, title: post.title};
        this.http.post<{ message: string, postId: string }>('http://localhost:3000/api/posts', newPost).subscribe((data) => {
            console.log(`Post ID from API : ${data.postId}`);
            const postId = data.postId;
            post.id = postId;
            console.log(post);
            this.posts.push(post);
            console.log(this.posts);
            this.postsUpdated.next([...this.posts]);
            this.router.navigate(['/']);
        });
    }

    deletePost(id: string) {
        this.http.delete<{ message: string }>(`http://localhost:3000/api/posts/${id}`).subscribe((data) => {
            const updatedPosts = this.posts.filter(post => post.id !== id);
            this.posts = updatedPosts;
            this.postsUpdated.next([...this.posts]);
        });
    }
}
