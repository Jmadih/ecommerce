import { Component, OnInit } from '@angular/core';
import {ShoppingService} from "../shared/services/shopping.service";

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['shop.component.scss']
})
export class ShopComponent implements OnInit {

  books : any;

  constructor(private _service : ShoppingService) { }

  ngOnInit() {
    this._service.getBooks().subscribe((books) => {
      this.books = books;
    });
  }

  addToBag(item){
    this._service.addItem(item);
    alert("The book -"+item.title+"- has been added to your bag :)");
  }

}
