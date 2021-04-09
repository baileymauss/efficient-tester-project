import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Platform, ToastController, IonList } from '@ionic/angular';
import { ApiDjangoService } from '../services/api-django.service';
import { myID } from 'src/app/services/authentication.service';
import { StorageService, Item } from 'src/app/services/storage.service';
import {currentGroup} from 'src/app/lab-group/lab-group.page';

@Component({
  selector: 'app-addgroupmember',
  templateUrl: './addgroupmember.component.html',
  styleUrls: ['./addgroupmember.component.scss'],
})

export class AddgroupmemberComponent implements OnInit {
	  
	  items: Item[] = [];

  constructor(
  private modalController: ModalController,
  private ApiService: ApiDjangoService,
  private plt: Platform) { 
  
  this.plt.ready().then(() => {
      this.loadItems();
    });
	}

  async close(){
	  await this.modalController.dismiss();
  }
  
   addLabGroup(){
    if (this.ApiService.networkConnected) {
      this.ApiService.showLoading();
              console.log(myID);
              let labgroupMembershipToCreate = {
                "user": myID,
                "group": currentGroup,
              }
  
              this.ApiService.createLabGroupMembership(labgroupMembershipToCreate).subscribe((res) => {
                if (res) {
                  console.log(res)
                }
                else {
                  this.ApiService.stopLoading();
                  this.ApiService.showError("An error occured while creating a membership")
                }
              });
    }
  }
  
    loadItems(){
    this.ApiService.getUsers().subscribe(items => {
      this.items = items["results"];
	  console.log(items["results"]);
    });
  }
  
  ngOnInit() {}

}
