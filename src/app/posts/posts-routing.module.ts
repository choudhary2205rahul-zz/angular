import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../auth/auth.guard";
import {PostCreateComponent} from "./post-create/post-create.component";
import {PostListComponent} from "./post-list/post-list.component";

const routes: Routes = [
    {path: 'create', component: PostCreateComponent, canActivate:  [AuthGuard]},
    {path: 'list', component: PostListComponent, canActivate:  [AuthGuard]},
    {path: 'edit/:postId', component: PostCreateComponent, canActivate:  [AuthGuard]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class PostsRoutingModule {
}