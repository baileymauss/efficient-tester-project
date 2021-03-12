import { AuthenticationService } from 'src/app/services/authentication.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, ToastController, IonList} from '@ionic/angular';
import { StorageService, Item } from 'src/app/services/storage.service';
import { ApiDjangoService } from '../services/api-django.service';
import {myID} from 'src/app/services/authentication.service';

@Component({
  selector: 'app-protocols',
  templateUrl: './protocols.page.html',
  styleUrls: ['./protocols.page.scss'],
})
export class ProtocolsPage implements OnInit{

  protocolCredentials = { name: '', plateType: '', numSamples: '', posRate: ''};

  infoAboutMe : any;

  creatorID='';

  protocols: Protocol[] = [];

  newItem: Protocol = <Protocol>{};

  @ViewChild('mylist') mylist: IonList;

  constructor(private storageService: StorageService, 
    private plt: Platform,
    private ApiService: ApiDjangoService, 
    private toastController: ToastController, 
    private authService: AuthenticationService, 
    private router: Router) {
 
    this.plt.ready().then(() => {
      this.ApiService.getProtocols();
    });
    
  }

  addProtocol(){
    if (this.ApiService.networkConnected) {
      this.ApiService.showLoading();
      //let queryPath = '?name=' + this.protocolCredentials.name + "&suspected_pos_rate=" + this.protocolCredentials.posRate;
      //this.ApiService.findProtocol(queryPath).subscribe((listProtocol) => {
          //this.ApiService.stopLoading()
          //console.log(JSON.stringify(listProtocol))
          //if (listProtocol) {
            //let nbProtocolFound = listProtocol["count"]
            //if (nbProtocolFound==0){
              console.log(myID);
              let protocolToCreate = {
                "name": this.protocolCredentials.name,
                "creator_ID": myID,
                "plate_type": this.protocolCredentials.plateType,
                "num_samples": this.protocolCredentials.numSamples,
                "suspected_pos_rate": this.protocolCredentials.posRate,
                "active_status": true
              }
  
              this.ApiService.createProtocol(protocolToCreate).subscribe((res) => {
                if (res) {
                  console.log(res)
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
    /** 
    this.storageService.addItem(this.newItem).then(item => {
      this.newItem = <Item>{};
      //this.showToast('Item added!')
      this.loadItems();
    });
  } **/

  loadItems(){
    this.ApiService.getProtocols().then(protocols => {
      this.protocols = protocols;
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
