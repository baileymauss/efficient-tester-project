import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import {ApiDjangoService} from '../services/api-django.service';
 
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

export var myID:string;
export var myEmail:string;

const TOKEN_KEY = 'access';
const REFRESH_TOKEN_KEY = 'refresh';
 
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // Init with null to filter out the first value in a guard!
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';
  refresh = '';
 
  constructor(private apiService: ApiDjangoService) {
    this.loadToken();
  }
 
  loadToken() {
    this.apiService.getLocalData(TOKEN_KEY).then((value:string)=>{    
    if (value) {
      console.log('set token: ', value);
      this.token = value["access"];
      this.apiService.getLocalData(REFRESH_TOKEN_KEY).then((value:string)=>{
        this.refresh=value["refresh"]
        this.isAuthenticated.next(true);
      }) 
    }
    else {
      this.isAuthenticated.next(false);
    }
  })
  }

  login(user){
    return new Promise(async resolve => {
      this.apiService.login(user).subscribe((result)=>{
         if (result) {
            let accessToken = result["access"]
            let refreshToken = result["refresh"]
            this.apiService.setLocalData("access",{"access":accessToken})
            this.apiService.setLocalData("refresh",{"refresh":refreshToken})
            this.token = accessToken;
            this.refresh=refreshToken
            this.isAuthenticated.next(true);
           
          
           resolve(true)
          }
        else{
          resolve(false)
        }
        })
        this.apiService.getProtocols().subscribe((data) => {
          console.log(data);
        });
      let queryPath = "?email=" + user.email;
      this.apiService.findUser(queryPath).subscribe((listUser) => { 
         //console.log(JSON.stringify(listUser))
         if(listUser){
           myID = listUser["results"][0]["id"];
           //myEmail = listUser["results"][0]["email"];
           this.apiService.setLocalData("id",{"id": myID})
           //console.log("saved ID")
           //console.log(myID)

         }
      })
    })
  }
 
  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    return new Promise(async resolve => {
      this.apiService.removeLocalData(TOKEN_KEY).then(()=>{
         this.apiService.removeLocalData(REFRESH_TOKEN_KEY).then(()=>{
           resolve()
         }
       )
      });
   })
  }

  refreshToken(){
    return this.apiService.refreshToken(this.refresh)
  }
}
