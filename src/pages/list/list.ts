import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { DetailsPage } from '../details/details';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedItem: any;
  icons: string[];
  items: Observable<any>;
  entries;


  constructor(public httpClient: HttpClient, public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');


    // Let's populate this page with some filler content for funzies
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
      'american-football', 'boat', 'bluetooth', 'build'];

    this.entries = [];
    this.items = this.httpClient.get('https://us-central1-visconsis-401af.cloudfunctions.net/queryOrders', {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
      }
    });
    this.items.subscribe(data => {
      console.log('received data:', data);
      data.forEach(element => {
        this.entries.push({
          title: element.order + ' #' + element.number + ' Order by ' + element.name,
          note: element.date,
          icon: this.icons[Math.floor(Math.random() * this.icons.length)]
        });
      });
    });


  }

  itemTapped(event, item) {
    this.navCtrl.push(DetailsPage, {
      item: item,
    });
  }

  itemChecked(event, item) {
    this.httpClient.post('https://us-central1-visconsis-401af.cloudfunctions.net/updateOrders', {
      item: item,
    });
  }
}
