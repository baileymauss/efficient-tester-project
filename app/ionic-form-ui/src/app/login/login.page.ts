import { AuthenticationService } from 'src/app/services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import {ApiDjangoService} from '../services/api-django.service'
 
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  registerCredentials = { email: '', password: '' };
 
  constructor(
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    public apiService: ApiDjangoService,
    private loadingController: LoadingController
  ) {}
 
  ngOnInit() {}
 
  async login() {
    //const loading = await this.loadingController.create();
    //await loading.present();
    if(this.apiService.networkConnected){
      this.apiService.showLoading();
      let queryPath = "?email=" + this.registerCredentials.email + "&password=" + this.registerCredentials.password;
      this.apiService.findUser(queryPath).subscribe((listUsers) => {
        this.apiService.stopLoading();
        if (listUsers) {
          console.log("Find " + JSON.stringify(listUsers));
          this.router.navigateByUrl('/main');


        }
        else {
          this.apiService.stopLoading();
          this.apiService.showError("Wrong login or password.");

        }
      })
    }
    else {
      this.apiService.showNoNetwork();
    }

  
  }
}