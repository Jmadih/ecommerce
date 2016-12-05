import { Component, OnInit } from '@angular/core';
import {ShoppingService} from "../../../shared/services/shopping.service";


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  constructor(private _service : ShoppingService) { }

  ngOnInit() {
    this._service.getMyBag();
    this._service.bag$.subscribe(myBag => {
      document.getElementById("bagsize").setAttribute("data-badge", this.getQuantities(myBag)+"");
    });
  }

  getQuantities(bag){
    return this._service.getQuantities(bag);
  }

}
