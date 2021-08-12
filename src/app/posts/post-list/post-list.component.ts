import {Component, OnDestroy, OnInit} from '@angular/core';
import {Post} from "../../models/post.model";
import {PostService} from "../../service/post.service";
import {Subscription} from "rxjs";
import {PageEvent} from "@angular/material/paginator";
import {AuthService} from "../../auth/auth.service";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

    totalPosts = 0;
    postsPerPage = 2;
    currentPage = 1;
    pageSizeOptions = [1, 2, 5, 10];
    /*posts = [
      {id: 1, title: 'My First PostModel', description: 'This is First PostModel'},
      {id: 2, title: 'My Second PostModel', description: 'This is Second PostModel'},
      {id: 3, title: 'My Third PostModel', description: 'This is Third PostModel'},
      {id: 4, title: 'My Fourth PostModel', description: 'This is Fourth PostModel'}
    ];*/

    //@Input() posts:Post[] = [];
    posts: Post[] = [];
    private postsSubscription: Subscription = new Subscription;
    private authListenerSubs: Subscription = new Subscription;
    isUserAuthenticated: boolean = false
    isLoading = false;
    userId: string = '';
    panelOpenState: boolean = false;

    constructor(private postService: PostService, private authService: AuthService) {
    }

    ngOnInit(): void {
        this.isLoading = true;
        this.postService.getPosts(this.postsPerPage, this.currentPage);
        this.userId = this.authService.getUserId();
        this.postService.getPostsUpdateListener()
            .subscribe((data: { posts: Post[], postsCount: number }) => {
                this.isLoading = false;
                this.posts = data.posts;
                this.totalPosts = data.postsCount;
            }, error => {
                this.isLoading = false;
                console.log('Error while listening to posts service subject')
            });
        this.isUserAuthenticated = this.authService.getIsAuthenticated();
        this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
            this.isUserAuthenticated = isAuthenticated;
            this.userId = this.authService.getUserId();
        }, (error) => {
            this.isLoading = false;
        });
    }

    ngOnDestroy() {
        this.postsSubscription.unsubscribe();
        this.authListenerSubs.unsubscribe();
    }

    onDelete(id: string) {
        this.isLoading = true;
        this.postService.deletePost(id).subscribe(data => {
            this.postService.getPosts(this.postsPerPage, this.currentPage);
        }, (error) => {
            this.isLoading = false;
        });
    }

    onChangedPage(pageEvent: PageEvent) {
        this.isLoading = true;
        this.currentPage = pageEvent.pageIndex + 1;
        this.postsPerPage = pageEvent.pageSize;
        this.postService.getPosts(this.postsPerPage, this.currentPage);
    }
}
