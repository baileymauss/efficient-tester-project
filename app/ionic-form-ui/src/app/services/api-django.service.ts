import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { AlertController ,LoadingController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ApiDjangoService {

  public tokenSSO: String = "";
    networkConnected: boolean = true;
    virtualHostName: string = 'http://127.0.0.1:8000'
    appName: string = '';
    apiPrefix = "/api"
    loader: any;
    expireDate: any;
    isOnline = false;
    urlPwdOublie: string = '';
    checkUrl: string = '';
    cordovaiOS = false;
    isShowingLoader = false;
    getUserUrl = this.virtualHostName + this.apiPrefix + "/users/"
    getCustomUserUrl : string =''

  constructor(private http:HttpClient,
    public loadingController: LoadingController,
    public alertCtrl: AlertController) { }

  getUsers() {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let url = this.getUserUrl

    return Observable.create(observer => {
      // At this point make a request to your backend  
      console.log("on appelle BACKEND encoded url " + url);
      this.http.get(url, options)
        .pipe(retry(1))
        .subscribe(res => {
          observer.next(res);
          observer.complete();
        }, error => {
          observer.next();
          observer.complete();
          console.log(error);// Error getting the data
        });
    });
  }

  findUser(path){
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    
    let url = this.getUserUrl+path;

    return Observable.create(observer => {
      // At this point make a request to your backend  
      console.log("on appelle BACKEND encoded url " + url);
      this.http.get(url, options)
        .pipe(retry(1))
        .subscribe(res => {
          observer.next(res);
          observer.complete();
        }, error => {
          observer.next();
          observer.complete();
          console.log(error);// Error getting the data
        });
    });
  }

  createUser(user){
    
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    
    let url = this.getUserUrl;

    return Observable.create(observer => {
      // At this point make a request to your backend  
      console.log("on appelle BACKEND encoded url " + url);
      this.http.post(url, user, options)
        .pipe(retry(1))
        .subscribe(res => {
          observer.next(res);
          observer.complete();
        }, error => {
          observer.next();
          observer.complete();
          console.log(error);// Error getting the data
        });
    });
  }

  async showLoading() {
     
    this.loader = await this.loadingController.create({
      message:  'Please wait',
      duration: 4000
    });
    return await this.loader.present();
   
  }

  async stopLoading() {
    console.log("On stop loading")
    if (this.loader){
      this.loader.dismiss()
    }
    else{
      console.log("Pas de loader")
    }
   
  }

  async showNoNetwork() {
    let alert = await this.alertCtrl.create({
      header: 'Sorry',
      message: 'No network detected. Please check your internet connexion',
      buttons: ['OK']
    });
   
    return await alert.present();
    
  }

  async showError(text) {
    let alert = await this.alertCtrl.create({
      header: 'Error',
      message: text,
      buttons: ['OK']
    });
    return await alert.present();
  }

}
