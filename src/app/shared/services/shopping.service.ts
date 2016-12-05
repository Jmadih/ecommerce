import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {BASE_URL, HENRI_POTIER_URL} from '../constants';
import {BehaviorSubject, Observable} from 'rxjs';
import {Book} from '../book';
import {Offers} from "../offers.enum";
import {Offer} from "../offer";

@Injectable()
export class ShoppingService {
  bag$ : Observable<Book[]>;
  private _bag : BehaviorSubject<Book[]>;
  private dataStore : {
    bag : Book[]
  };

  constructor(private _http: Http) {
    this.dataStore = { bag : [] };
    this._bag = <BehaviorSubject<Book[]>> new BehaviorSubject([]);
    this.bag$ = this._bag.asObservable();
  }

  getBooks() {
    return this._http.get(`${HENRI_POTIER_URL}/books`)
      .map( res => res.json());
  }

  getOffers(isbns) {
    return this._http.get(`${HENRI_POTIER_URL}/books/${isbns}/commercialOffers`)
      .map( res => res.json() );
  }

  getMyBag() {
    this._http.get(`${BASE_URL}/api/bag`).map(response => response.json()).subscribe(data => {
        this.dataStore.bag = data;
        this._bag.next(Object.assign({}, this.dataStore).bag);
      }, error => console.error('Error while trying to load items in the bag.'),
      () => console.log("The bag contains "+this.dataStore.bag .length+" distinct item(s)"));
  }

  addItem(item: Book) {
    this._http.post(`${BASE_URL}/api/bag/`, item)
      .map(response => response.json()).subscribe(data => {
        let notFound = true;
        this.dataStore.bag.forEach((b, i) => {
          if (b.isbn === data.isbn) { this.dataStore.bag[i].quantity++; notFound = false; }
        });
        if(notFound){
          item.quantity = 1;
          this.dataStore.bag.push(item);
        }
        this._bag.next(Object.assign({}, this.dataStore).bag);
      }, error => console.error('Error while trying to add an item.')
      , ()=> console.log("The book -"+item.title+"- has been added to your bag :)")
    );
  }

  removeItem(item: Book) {
    this._http.put(`${BASE_URL}/api/bag/`, item)
      .map(response => response.json()).subscribe(data => {
        this.dataStore.bag = data;
        this._bag.next(Object.assign({}, this.dataStore).bag);
      }, error => console.error('Error while trying to remove an item.'),
      ()=> console.log("The book with "+item.isbn+" has been removed from your bag :)"));
  }

  deleteItem(id) {
    return this._http.delete(`${BASE_URL}/api/bag/${id}`)
      .map( res => res.json() ).subscribe(data => {
          this.dataStore.bag = data ;
          this._bag.next(Object.assign({}, this.dataStore).bag);
        }, error => console.error('Error while trying to delete an item'),
        ()=> console.log("The book with "+id+"- has been deleted from your bag :)"));
  }

  totalPrice(bag){
    var totalPrice = 0;
    for(var i = 0 ; i< bag.length; i++){
      totalPrice += bag[i].price * bag[i].quantity;
    }
    return totalPrice;
  }

  getIsbns(bag){
    var isbns = "";
    for(var i = 0 ; i< bag.length; i++){
      isbns += bag[i].isbn+",";
    }
    return isbns.slice(0,isbns.length-1);
  }

  getQuantities(bag){
    var total = 0;
    for(var i = 0 ; i< bag.length; i++){
      total += bag[i].quantity;
    }
    return total;
  }

  getPromo(offers, totalPrice){
    var offer : Offer = new Offer();
    offer.type = 'nothing';
    offer.value = 0;
    for(var i = 0; i < offers.length; i ++){
      var cfvalue = offers[i].value;
      var cftype = offers[i].type;
      if( cfvalue > offer.value && ((cftype === Offers.slice && totalPrice >= 100) || cftype !=="slice")){
        offer.value = cfvalue;
        offer.type = cftype;
      }
    }
    return offer;
  }

  calcPromo(offer: Offer, totalPrice){
    var priceAfterPromo = 0;
    if (offer.type === Offers.slice) {
      console.log("slice of "+ offer.value);
      priceAfterPromo = totalPrice - (totalPrice / 100) * offer.value;
    }
    else if (offer.type === Offers.minus) {
      console.log("minus of "+ offer.value);
      priceAfterPromo = totalPrice - offer.value;
    }
    else if (offer.type === Offers.percentage) {
      console.log("percentage of "+ offer.value);
      priceAfterPromo = totalPrice - totalPrice * ( offer.value / 100);
    }
    return priceAfterPromo;
  }

}
