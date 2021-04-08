import { AuthenticationService } from 'src/app/services/authentication.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, ToastController, IonList} from '@ionic/angular';
import { StorageService, Item } from 'src/app/services/storage.service';
import { ApiDjangoService } from '../services/api-django.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import {myID} from 'src/app/services/authentication.service';
import {protocolID} from 'src/app/protocols/protocols.page';

@Component({
  selector: 'app-experiments',
  templateUrl: './experiments.page.html',
  styleUrls: ['./experiments.page.scss'],
})
export class ExperimentsPage implements OnInit {

  experimentCredentials = { stepNum: '', myNotes: '', protUsed: ''};
  
  selectedItem?: Item;

  infoAboutMe : any;

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
    private inAppBrowser: InAppBrowser) {
     
    this.plt.ready().then(() => {
      this.loadItems();
    });
    
  }
  addExperiment(){
    if (this.ApiService.networkConnected) {
      this.ApiService.showLoading();
              console.log(myID);
              let experimentToCreate = {
                "user_notes": '{}',
                "step_num": this.experimentCredentials.stepNum,
                "protocol_used": this.experimentCredentials.protUsed,
                "current_interaction": '{}'
              }
  
              this.ApiService.createExperiment(experimentToCreate).subscribe((res) => {
                if (res) {
                  console.log(res)
                  this.loadItems();
                }
                else {
                  this.ApiService.stopLoading();
                  this.ApiService.showError("An error occured while creating a Experiment")
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
  
  redirect(item) {
    this.inAppBrowser.create("http://35.153.231.217:8000/imageInteraction/?id=" + item.protocol_used + "&exp=" +item.id);
   }
  
  onSelect(item: Item): void {
    this.selectedItem = item;
    console.log(item)
	  this.redirect(item);
  }

  loadItems(){
    this.ApiService.getExperiments().subscribe(items => {
      for (let index in items["results"]){
        let currentItem = items["results"][index]["protocol_used"];
        //console.log(currentItem)
		 	  if(currentItem == protocolID){
          console.log(currentItem)
				  this.displayList.push(items["results"][index]);
        }
    }
    console.log(this.displayList)
	  //console.log(items["results"][3]["protocol_used"]);
    });
  }

  ngOnInit() {
  }

}
