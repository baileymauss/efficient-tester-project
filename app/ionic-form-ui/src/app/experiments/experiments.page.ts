import { AuthenticationService } from 'src/app/services/authentication.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, ToastController, IonList} from '@ionic/angular';
import { StorageService, Item } from 'src/app/services/storage.service';
import { ApiDjangoService } from '../services/api-django.service';
import {myID} from 'src/app/services/authentication.service';

@Component({
  selector: 'app-experiments',
  templateUrl: './experiments.page.html',
  styleUrls: ['./experiments.page.scss'],
})
export class ExperimentsPage implements OnInit {

  experimentCredentials = { stepNum: '', creatorID: '', protocolID: ''};
  
  selectedItem?: Item;

  infoAboutMe : any;

  creatorID='';

  items: Item[] = [];

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
  
    loadItems(){
    this.ApiService.getExperiments().subscribe(items => {
      this.items = items["results"];
	  console.log(items["results"]);
    });
  }

  ngOnInit() {
  }

}
