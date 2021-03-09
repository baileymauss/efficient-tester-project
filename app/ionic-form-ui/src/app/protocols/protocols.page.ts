import { AuthenticationService } from 'src/app/services/authentication.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, ToastController, IonList} from '@ionic/angular';
import { StorageService, Item } from 'src/app/services/storage.service';
import { ApiDjangoService } from '../services/api-django.service';

@Component({
  selector: 'app-protocols',
  templateUrl: './protocols.page.html',
  styleUrls: ['./protocols.page.scss'],
})
export class ProtocolsPage implements OnInit{

  items: Item[] = [];

  newItem: Item = <Item>{};

  @ViewChild('mylist') mylist: IonList;

  constructor(private ApiService: ApiDjangoService, private plt: Platform, private toastController: ToastController, private authService: AuthenticationService, private router: Router) {
    this.plt.ready().then(() => {
      this.loadItems();
    });
  }

  addItem(){
    this.newItem.modified = Date.now();
    this.newItem.id = Date.now();
	this.newItem.created = Date.now();
	this.newItem.active = True;
	this.newItem.creator_ID = localStorage.getItem(userID);

	//replace this with get method from service.ts
    this.ApiService.createProtocol(this.newItem).then(item => {
      this.newItem = <Item>{};
      //this.showToast('Item added!')
      this.loadItems();
    });
  }

  loadItems(){
    this.ApiService.getProtocols().then(items => {
      this.items = items;
    });
  }
/**
  updateItem(item: Item){
    item.title = 'UPDATED: ${item.title}';
    item.modified = Date.now();

    this.storageService.updateItem(item).then(item => {
      this.showToast('Item updated!');
      this.mylist.closeSlidingItems();
      this.loadItems();
    });
  }

  deleteItem(item: Item){
    this.storageService.deleteItem(item.id).then(item => {
      this.showToast('Item removed!');
      this.mylist.closeSlidingItems();
      this.loadItems();
    });
  }

  async showToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
 **/
  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  ngOnInit(){

  }

}
