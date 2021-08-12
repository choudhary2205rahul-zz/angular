import {Component, OnInit} from '@angular/core';
import {Post} from "../../models/post.model";
import {FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {PostService} from "../../service/post.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {mimeType} from "./mime-type.validator";

@Component({
    selector: 'app-create-post',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

    // @ts-ignore
    post: Post = {id: '', title: '', description: '', image: null};
    private mode = 'create';
    private postId: string = '';
    isLoading = false;
    imagePreview: string = '';

    form: FormGroup = new FormGroup({
        'id': new FormControl(null),
        'title': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
        'description': new FormControl(null, {validators: [Validators.required]}),
        'image': new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]}),
    });

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
                    this.post = {
                        id: data.post._id,
                        title: data.post.title,
                        description: data.post.description,
                        image: data.post.image,
                        creator: data.post.creator
                    };
                    this.form.setValue({
                        'id': data.post._id,
                        'title': data.post.title,
                        'description': data.post.description,
                        'image': data.post.image
                    });
                }, error => {
                    this.isLoading = false
                });
            } else {
                this.mode = 'create';
                this.postId = '';
            }
        });
    }

    onSaveAndUpdatePost() {

        if (this.form.invalid) {
            return;
        }

        this.isLoading = true;

        if (this.mode === 'create') {
            this.post = {
                id: '',
                title: this.form.value.title,
                description: this.form.value.description,
                image: this.form.value.image,
                creator: null
            }
            //this.postCreated.emit(this.post);
            this.postService.addPost(this.post);
        } else {
            this.post = {
                id: this.postId,
                title: this.form.value.title,
                description: this.form.value.description,
                image: this.form.value.image,
                creator: null
            }
            this.postService.updatePost(this.postId, this.post);
        }
        this.form.reset();
    }

    onImagePicked(event: Event) {
        // @ts-ignore
        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({
            'image': file
        });
        this.form.get('image')?.updateValueAndValidity();

        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result as string;
        }
        reader.readAsDataURL(file);
    }
}
