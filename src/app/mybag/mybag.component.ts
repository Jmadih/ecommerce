import {Component, OnInit} from '@angular/core';
import {ShoppingService} from "../shared/services/shopping.service";
import {Book} from "../shared/book";
import {Offer} from "../shared/offer";

@Component({
  selector: 'app-mybag',
  templateUrl: './mybag.component.html',
  styleUrls: ['mybag.component.scss']
})
export class MybagComponent implements OnInit {
  bag : Book[];
  totalPrice : number;
  priceAfterPromo : number;

  constructor(private _service : ShoppingService) { }

  ngOnInit() {
    this._service.getMyBag();
    this._service.bag$.subscribe( bag => {
      this.bag = bag;
      this.totalPrice = this.total(bag);
      this.priceAfterPromo = this.totalPrice;
      this.updatePromo(this.bag);
    }, error => console.error('Error while trying to get the bag'));

  }


  updatePromo(bag){
    var isbns = this._service.getIsbns(bag);
    return this.selectBestOffer(isbns);
  }

  add(item){
    this._service.addItem(item);
    this.updatePromo(this.bag);
  }

  remove(item){
    if(item.quantity == 1){
      var r = confirm("Are you sure you want to delete this item ?");
      if (r == true) {
        this.deleteItem(item);
      }
    }else{
      this._service.removeItem(item);
    }
    this.updatePromo(this.bag);
  }

  deleteItem(model){
    this._service.deleteItem(model.id);
    this.updatePromo(this.bag);
  }

  total(bag){
    return this._service.totalPrice(bag);
  }

  private selectBestOffer(isbns){
    if(isbns.length>0){
       this._service.getOffers(isbns).subscribe( data => {
         var offer = this.getPromo(data.offers, this.totalPrice);
         this.priceAfterPromo = this.calcPromo(offer, this.totalPrice);
      });
    }
  }

  private getPromo(offers, totalPrice){
    return this._service.getPromo(offers, totalPrice);
  }

  private calcPromo(offer: Offer, totalPrice) {
    return this._service.calcPromo(offer, totalPrice);
  }

  buy(){
    alert("Oh sorry! you thought you can buy ? ^^");
  }

}
