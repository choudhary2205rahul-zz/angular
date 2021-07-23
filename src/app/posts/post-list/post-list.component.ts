import {Component, OnDestroy, OnInit} from '@angular/core';
import {Post} from "../../models/post.model";
import {PostService} from "../../service/post.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy {

  panelOpenState = false;
  /*posts = [
    {id: 1, title: 'My First PostModel', description: 'This is First PostModel'},
    {id: 2, title: 'My Second PostModel', description: 'This is Second PostModel'},
    {id: 3, title: 'My Third PostModel', description: 'This is Third PostModel'},
    {id: 4, title: 'My Fourth PostModel', description: 'This is Fourth PostModel'}
  ];*/

  //@Input() posts:Post[] = [];
  posts:Post[] = [];
  private postsSubscription: Subscription = new Subscription;
  isLoading = false;

  constructor(private postService:PostService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts();
    this.postService.getPostsUpdateListener().subscribe((posts:Post[]) => {
      this.isLoading = false;
      this.posts = posts;
    }, error => {
      console.log('Error while listening to posts service subject')
    })
  }

  ngOnDestroy() {
    this.postsSubscription.unsubscribe();
  }

  onDelete(id: string) {
    console.log(id);
    this.postService.deletePost(id);
  }
}
