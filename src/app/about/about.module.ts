import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MdModule} from "../core/md.module";
import {AboutComponent} from "./about.component";
import {AboutRoutes} from "./about.route";

@NgModule({
  imports: [MdModule, CommonModule, AboutRoutes],
  declarations: [AboutComponent],
  providers: []
})
export class AboutModule { }
