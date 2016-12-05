import {Directive, ElementRef, Renderer} from "@angular/core";

@Directive({
  selector : '[data-badge]'
})
export class DataBadge{

  constructor(private _element : ElementRef, private _renderer : Renderer){

  }
}
