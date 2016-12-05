/* tslint:disable:no-unused-variable */

import {TestBed, inject, fakeAsync, tick} from '@angular/core/testing';
import { ShoppingService } from './shopping.service';
import {Http, ConnectionBackend, BaseRequestOptions, Response, ResponseOptions} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {BOOKS, BAG, OFFERS, BOOK1, BOOK2} from "./shopping.mocks";

describe('Service: Shopping', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Http, useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
          return new Http(backend, defaultOptions);
        }, deps: [MockBackend, BaseRequestOptions]

        },
        {provide : ShoppingService, useClass : ShoppingService},
        {provide: MockBackend, useClass: MockBackend},
        {provide: BaseRequestOptions, useClass: BaseRequestOptions}
      ]
    });
  });

  it('should be defined', () => {
    expect(ShoppingService).toBeDefined();
  });

  it('should get Books',

    inject([ShoppingService, MockBackend], fakeAsync((shoppingService: ShoppingService, mockBackend: MockBackend) => {
      let response = BOOKS;
      mockBackend.connections.subscribe(connection => {
        connection.mockRespond(new Response(new ResponseOptions({body: JSON.stringify(response)})));
      });
      shoppingService.getBooks().subscribe((response) => {
        expect(response.length).toBe(7);
      });
    }))
  );

  it('should get Offers',
    inject([ShoppingService, MockBackend], fakeAsync((shoppingService: ShoppingService, mockBackend: MockBackend) => {
      let offer = {
        "offers": [
          {
            "type": "percentage",
            "value": 4
          },
          {
            "type": "minus",
            "value": 15
          },
          {
            "type": "slice",
            "sliceValue": 100,
            "value": 12
          }
        ]
      };
      mockBackend.connections.subscribe(connection => {
        connection.mockRespond(new Response(new ResponseOptions({body: JSON.stringify(offer)})));
      });
      shoppingService.getOffers('c8fabf68-8374-48fe-a7ea-a00ccd07afff,a460afed-e5e7-4e39-a39d-c885c05db861')
        .subscribe((response) => {
          expect(response.offers.length).toBeGreaterThan(0);
        });
    })))

  it('Service : crud item to bag',
    inject([ShoppingService, MockBackend], fakeAsync((shoppingService: ShoppingService, mockBackend: MockBackend) => {
      let bag : any;
      let bd = BAG;
      let book1 = BOOK1;
      let book2 = BOOK2;
      let offers = OFFERS;

      mockBackend.connections.subscribe(connection => {
        if(connection.request.method === 0){ //GET
            connection.mockRespond(new ResponseOptions({body: JSON.stringify(bd)}));
        }else if(connection.request.method === 1){ //POST
          bd.push(book1);
          bd.push(book2);
          connection.mockRespond(new Response(new ResponseOptions({body: JSON.stringify(bd)})));
        }else if (connection.request.method === 2){ //DELETE
          connection.mockRespond(new Response(new ResponseOptions({body: JSON.stringify([book2])})));
        }else if (connection.request.method === 3){ //PUT
          book2.quantity--;
          connection.mockRespond(new Response(new ResponseOptions({body: JSON.stringify([book2])})));
        }
      });

      //--- The bag suppose to be empty
      shoppingService.bag$.subscribe((getBag) => {
        bag = getBag;
      });
      tick();
      expect(bag.length).toBe(0);

      //---- Create items -------
      shoppingService.addItem(book1);
      shoppingService.addItem(book2);
      tick();
      shoppingService.bag$.subscribe((getBag) => {
        bag = getBag;
      });
      tick();
      expect(bag.length).toBe(2);

      // --- Calculate total Price
      var total = shoppingService.totalPrice(bag);
      expect(total).toBe(65);
      var bestOffer = shoppingService.getPromo(offers, total);
      expect(bestOffer.type).toBe("minus");
      expect(bestOffer.value).toBe(15);
      var totalAfterPromo = total - bestOffer.value;
      expect(totalAfterPromo).toBe(50);

      // ---- Delete book1
      shoppingService.deleteItem("1");
      tick();
      shoppingService.bag$.subscribe((getBag) => {
        bag = getBag;
      });
      tick();
      expect(bag.length).toBe(1);

      // --- Remove example of book2
      shoppingService.removeItem(book2);
      tick();
      shoppingService.bag$.subscribe((getBag) => {
        bag = getBag;
      });
      tick();
      expect(bag[0].quantity).toBe(0);
    }))
  );
});
