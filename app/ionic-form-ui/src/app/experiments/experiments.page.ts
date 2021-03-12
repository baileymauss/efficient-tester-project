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

	experimentCredentials = { name: '', creatorID: '', protocolID: '', completed: '', stepNum: ''};

	infoAboutMe : any;

	creatorID='';
	
	protocolID='';

	experiments: Experiment[] = [];

	newItem: Experiment = <Experiment>{};

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
  
    addExperiment(){
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
              let experimentToCreate = {
                "name": this.experimentCredentials.name,
                "creator_ID": myID,
                "protocolID": this.experimentCredentials.plateType,
                "completed": false,
                "stepNum": 1
              }
  
              this.ApiService.createExperiment(experimentToCreate).subscribe((res) => {
                if (res) {
                  console.log(res)
                }
                else {
                  this.ApiService.stopLoading();
                  this.ApiService.showError("An error occured while creating an experiment")
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
  
    loadItems(){
    this.ApiService.getExperiments().then(experiments => {
      this.experiments = experiments;
    });
  }
  
    async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  ngOnInit() {
  }

}
