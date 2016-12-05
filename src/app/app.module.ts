import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ShopComponent } from './shop/shop.component';
import { MybagComponent } from './mybag/mybag.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import {RoutesModule} from "./app.routing";
import {CoreModule} from "./core/core.module";
import {SharedModule} from "./shared/shared.module";
import {ShoppingService} from "./shared/services/shopping.service";
import { ToolbarComponent } from './layout/header/toolbar/toolbar.component';
import { MenubarComponent } from './layout/header/menubar/menubar.component';
import { AboutComponent } from './about/about.component';
import {AboutModule} from "./about/about.module";

@NgModule({
  declarations: [
    AppComponent,
    ShopComponent,
    MybagComponent,
    HeaderComponent,
    FooterComponent,
    ToolbarComponent,
    MenubarComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    RoutesModule,
    FormsModule,
    HttpModule,
    SharedModule,
    AboutModule
  ],
  providers: [ShoppingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
