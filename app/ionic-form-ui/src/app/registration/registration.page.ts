import { Component, OnInit } from '@angular/core';
//import { Platform } from '@ionic/angular';
import { ApiDjangoService } from '../services/api-django.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {
  registerCredentials = { username: '', firstName: '', lastName: '', email: '', password: '', passwordbis: '' };

  constructor(public apiService: ApiDjangoService,
    public router: Router) { }

  ngOnInit() {
  }

  register() {

    if (this.registerCredentials.password != this.registerCredentials.passwordbis) {
      this.apiService.showError("Sorry passwords doesn't match");
    }
    else if (this.registerCredentials.username.length == 0 && this.registerCredentials.email.length == 0) {
      this.apiService.showError("Please enter your email and username");
    }
    else {
      
      if (this.apiService.networkConnected) {
        this.apiService.showLoading();

        // Check email
        let queryPath = '?email=' + this.registerCredentials.email;
        this.apiService.findUser(queryPath).subscribe((listUser) => {
          this.apiService.stopLoading()
          console.log(JSON.stringify(listUser))
          if (listUser) {
            let nbUserFound = listUser["count"]
            if (nbUserFound==0){
              let userToCreate = {
                "email": this.registerCredentials.email,
                "username": this.registerCredentials.username,
                "firstName": this.registerCredentials.firstName,
                "lastName": this.registerCredentials.lastName,
                "password": this.registerCredentials.password,
                "is_active": true,
                "is_staff": false
              }
  
              this.apiService.createUser(userToCreate).subscribe((resultat) => {
                if (resultat) {
                  console.log(resultat)
                }
                else {
                  this.apiService.stopLoading();
                  this.apiService.showError("An error occured while registering")
                }
              });
            }
            else{
              this.apiService.showError("An account already exists for this email, please login");
            }
           
          }
          else {
            
            this.apiService.showError("An error occured while registering")
         
          }
        });

      }
    }
  }
}
