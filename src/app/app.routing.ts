import {RouterModule, Routes} from "@angular/router";
import {ModuleWithProviders, NgModule} from "@angular/core";
import {ShopComponent} from "./shop/shop.component";
import {MybagComponent} from "./mybag/mybag.component";

const routes: Routes = [
  {path: '', redirectTo: 'shop', pathMatch: 'full'},
  { path : 'shop', component : ShopComponent},
  { path : 'mybag', component : MybagComponent},
  { path : 'about', loadChildren : 'app/about/about.module#AboutModule'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NameRoutingModule { }

export const RoutesModule: ModuleWithProviders = RouterModule.forRoot(routes, {useHash: true});
