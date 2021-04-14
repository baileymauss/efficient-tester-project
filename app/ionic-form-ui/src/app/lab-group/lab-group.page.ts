import { AuthenticationService } from 'src/app/services/authentication.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, ToastController, IonList} from '@ionic/angular';
import { StorageService, Item } from 'src/app/services/storage.service';
import { ApiDjangoService } from '../services/api-django.service';
import {myID} from 'src/app/services/authentication.service';
import { ModalController } from '@ionic/angular';
import {GroupPopupComponent} from 'src/app/group-popup/group-popup.component';
import {AddgroupmemberComponent} from 'src/app/addgroupmember/addgroupmember.component';

export var currentGroup:number;

@Component({
  selector: 'app-lab-group',
  templateUrl: './lab-group.page.html',
  styleUrls: ['./lab-group.page.scss'],
})
export class LabGroupPage implements OnInit {
  labGroupCredentials = { myName: ''};

  infoAboutMe : any;

  group_id='';

  items: Item[] = [];
  
  displayList: Item[] = [];

  newItem: Item = <Item>{};

  @ViewChild('mylist') mylist: IonList;

  constructor(private storageService: StorageService, 
    private plt: Platform,
    private ApiService: ApiDjangoService, 
    private toastController: ToastController, 
    private authService: AuthenticationService, 
    private router: Router,
	private modalCtrl: ModalController) {
     
    this.plt.ready().then(() => {
      this.loadItems();
    });
    
  }

  addLabGroup(){
    if (this.ApiService.networkConnected) {
      this.ApiService.showLoading();
              console.log(myID);
              let labgroupToCreate = {
                "name": this.labGroupCredentials.myName,
                "group_id": myID,
              }
  
              this.ApiService.createLabGroups(labgroupToCreate).subscribe((res) => {
                if (res) {
                    console.log(res)
				    currentGroup = res.id;
				  
				    let groupMembershipToCreate = {
				    "user": myID,
				    "group": currentGroup, 
				    "role": 1,
					}
                    this.ApiService.createLabGroupMembership(groupMembershipToCreate).subscribe((res) => {
                        if (res) {
                            console.log(res)
                        }
                        else {
                            this.ApiService.stopLoading();
                            this.ApiService.showError("An error occured while creating a Protocol")
                        }


                    }   
                }
                else {
                  this.ApiService.stopLoading();
                  this.ApiService.showError("An error occured while creating a Protocol")
                }
				
				
              }
			  
			  );
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
  
  async addMember(){
	  const modal = await this.modalCtrl.create({
		  component: AddgroupmemberComponent,
		  componentProps: {
			  groupID: currentGroup
		  }
	  })
	  await modal.present();
  }
  
  async groupPopup(groupName){
	  const modal = await this.modalCtrl.create({
		  component: GroupPopupComponent,
		  componentProps: {
			  groupName: groupName
		  }
	  })
	  await modal.present();
  }
  
  redirect() {
    this.router.navigateByUrl("/experiments");
   }
  
  onSelect(item: Item): void {
	  currentGroup = item.id;
	  this.groupPopup(currentGroup);
	  //this.redirect();
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
    this.ApiService.getLabGroups().subscribe(items => {
        for (let index in items["results"]) {
            for (let i in items["results"][index]["member_list"]) {
                let someUser = items["results"][index]["member_list"][i];
                if (someUser == myID) {
                    this.displayList.push(items["results"][index]);
                }
            }
        }
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
