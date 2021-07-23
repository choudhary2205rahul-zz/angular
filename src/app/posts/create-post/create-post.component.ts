import {Component, OnInit} from '@angular/core';
import {Post} from "../../models/post.model";
import {NgForm} from "@angular/forms";
import {PostService} from "../../service/post.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";

@Component({
    selector: 'app-create-post',
    templateUrl: './create-post.component.html',
    styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

    post: Post = {id:'', title:'', description:''};
    private mode = 'create';
    private postId: string = '';
    isLoading = false;

    //@Output() postCreated = new EventEmitter<Post>();

    constructor(private postService: PostService, private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('postId')) {
                this.mode = 'edit';
                this.postId = paramMap.get('postId') || '';
                // Show Spinner
                this.isLoading = true;
                this.postService.getPost(this.postId).subscribe(data => {
                    // Hide Spinner
                    this.isLoading = false;
                    this.post = {id: data.post._id, title: data.post.title, description: data.post.description};
                });
            } else {
                this.mode = 'create';
                this.postId = '';
            }
        });
    }

    onSavePost(postCreateFrom: NgForm) {

        if (postCreateFrom.invalid) {
            return;
        }

        this.isLoading = true;

        if (this.mode === 'create')  {
            this.post = {id: '', title: postCreateFrom.value.title, description: postCreateFrom.value.description}
            //this.postCreated.emit(this.post);
            this.postService.addPost(this.post);
        } else {
            this.post = {id: this.postId, title: postCreateFrom.value.title, description: postCreateFrom.value.description}
            this.postService.updatePost(this.postId,this.post);
            postCreateFrom.resetForm();
        }

        this.post = {id:'', title:'', description:''};
        postCreateFrom.resetForm();
    }
}
