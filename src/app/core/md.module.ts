import { NgModule } from '@angular/core';


import {MdButtonModule} from '@angular2-material/button/button';
import {MdSidenavModule} from '@angular2-material/sidenav/sidenav';
import {MdCardModule} from '@angular2-material/card/card';
import {MdMenuModule} from '@angular2-material/menu/menu';
import {MdTabsModule} from '@angular2-material/tabs/tabs';
import {MdProgressBarModule} from '@angular2-material/progress-bar/progress-bar';
import {MdInputModule} from "@angular2-material/input";
import {MdCheckboxModule} from "@angular2-material/checkbox";
import {MdSliderModule} from "@angular2-material/slider";
import {MdListModule} from "@angular2-material/list";

export let MD_MODULES: any = [
  MdButtonModule,
  MdCardModule,
  MdSidenavModule,
  MdMenuModule,
  MdTabsModule,
  MdInputModule,
  MdCheckboxModule,
  MdProgressBarModule,
  MdSliderModule,
  MdListModule
];

@NgModule({
  exports: [...MD_MODULES]
})
export class MdModule {}
