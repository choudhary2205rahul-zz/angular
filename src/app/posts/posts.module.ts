import {NgModule} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";

import {PostCreateComponent} from "./post-create/post-create.component";
import {PostListComponent} from "./post-list/post-list.component";
import {AppMaterialModule} from "../app-material.module";
import {PostsRoutingModule} from "./posts-routing.module";

@NgModule({
    declarations: [PostCreateComponent, PostListComponent],
    imports: [
        CommonModule,
        AppMaterialModule,
        RouterModule,

        PostsRoutingModule,
        ReactiveFormsModule
    ]
})
export class PostsModule {
}