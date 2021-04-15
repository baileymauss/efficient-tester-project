import { AuthenticationService } from 'src/app/services/authentication.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, ToastController, IonList} from '@ionic/angular';
import { StorageService, Item } from 'src/app/services/storage.service';
import { ApiDjangoService } from '../services/api-django.service';
import {myID} from 'src/app/services/authentication.service';
import {currentGroup} from 'src/app/lab-group/lab-group.page';

export var protocolID:number;

@Component({
  selector: 'app-protocols',
  templateUrl: './protocols.page.html',
  styleUrls: ['./protocols.page.scss'],
})
export class ProtocolsPage implements OnInit{

  protocolCredentials = { name: '', plateType: '', numSamples: '', posRate: ''};
  
  selectedItem?: Item;

  infoAboutMe : any;

  creatorID='';

  items: Item[] = [];
  
  displayList: Item[] = [];

  newItem: Item = <Item>{};

  @ViewChild('mylist') mylist: IonList;

  constructor(private storageService: StorageService, 
    private plt: Platform,
    private ApiService: ApiDjangoService, 
    private toastController: ToastController, 
    private authService: AuthenticationService, 
    private router: Router) {
     
    this.plt.ready().then(() => {
      this.loadItems();
    });
    
  }

  addProtocol(){
    if (this.ApiService.networkConnected) {
      this.ApiService.showLoading();
              console.log(myID);
              let protocolToCreate = {
                "name": this.protocolCredentials.name,
                "creator_ID": myID,
                "plate_type": this.protocolCredentials.plateType,
                "num_samples": this.protocolCredentials.numSamples,
                "suspected_pos_rate": this.protocolCredentials.posRate,
                "active_status": true,
				"num_experiments": 0
              }
  
              this.ApiService.createProtocol(protocolToCreate).subscribe((res) => {
                if (res) {
                  console.log(res)
                  this.loadItems();
                }
                else {
                  this.ApiService.stopLoading();
                  this.ApiService.showError("An error occured while creating a Protocol")
                }
              });
            //}
            //else{
            //  this.ApiService.showError("A Protocol already exists for this name and positive rate!");
            //}
          //}
          //else {
            
          //  this.ApiService.showError("An error occured while registering")
         
          //}
      //});
    }
  }

  
  redirect() {
    this.router.navigateByUrl("/experiments");
   }
  
  onSelect(item: Item): void {
    this.selectedItem = item;
    protocolID = item.id;
    console.log(protocolID)
	  this.redirect();
  }
  
    /** 
    this.newItem.modified = Date.now();
    this.newItem.id = Date.now();
    this.storageService.addItem(this.newItem).then(item => {
      this.newItem = <Item>{};
      //this.showToast('Item added!')
      this.loadItems();
    });
  }
  **/

  loadItems(){
    this.ApiService.getProtocols().subscribe(items => {
      for (let index in items["results"]){
        let currentItem = items["results"][index]["lab_group"];
        //console.log(currentItem)
		 	  if(currentItem == currentGroup){
          console.log(currentItem)
				  this.displayList.push(items["results"][index]);
        }
    }
    console.log(this.displayList)
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
