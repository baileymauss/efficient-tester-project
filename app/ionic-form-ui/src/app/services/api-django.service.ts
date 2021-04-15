import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, tap } from 'rxjs/operators';
import { AlertController ,LoadingController} from '@ionic/angular';
import { Plugins } from '@capacitor/core';


const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class ApiDjangoService {

  public tokenSSO: String = "";
    networkConnected: boolean = true;
    virtualHostName: string = 'http://127.0.0.1:8000';
    appName: string = '';
    apiPrefix = "/api"
    loader: any;
    expireDate: any;
    isOnline = false;
    //urlPwdOublie: string = '';
    checkUrl: string = '';
    cordovaiOS = false;
    isShowingLoader = false;
    getUserUrl = this.virtualHostName + this.apiPrefix + "/users/"
    getProtocolUrl = this.virtualHostName + this.apiPrefix + "/protocols/"
    getLabGroupUrl = this.virtualHostName + this.apiPrefix + "/labgroups/"
	getLabGroupUrl = this.virtualHostName + this.apiPrefix + "/groupmembership/"
	getExperimentUrl = this.virtualHostName + this.apiPrefix + "/experiments/"
    getAuthUserUrl = this.virtualHostName + "/auth/users/";
    //getMyUrl = this.virtualHostName + "/auth/users/me/";
    getLoginUrl = this.virtualHostName +  "/auth/jwt/create/";
    refreshtokenUrl = this.virtualHostName +  "/auth/jwt/refresh/";
    urlPwdOublie = this.virtualHostName + "/account/reset_password/";
    getCustomUserUrl : string =''

  constructor(private http:HttpClient,
    public loadingController: LoadingController,
    public alertCtrl: AlertController) { }

  /////////////////////////////
  //DONT KNOW WHERE I USE THIS METHOD BELOW
  /////////////////////////////
  getUserNow() {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let url = this.getAuthUserUrl

    return new Observable(observer => {
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
  /////////////////////////////////////////////////

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

  public setLocalData(key, jsonData){
    return new Promise(async resolve => {
      await Storage.set({key:`${this.virtualHostName}-${key}`,value:JSON.stringify(jsonData)})
      resolve(true)
    });
  }

  public getLocalData(key){
    return new Promise(async resolve => {
      let ret = await Storage.get({key:`${this.virtualHostName}-${key}`}) 
            
            if (ret.value){
                resolve( JSON.parse(ret.value))
            }
            else{
                resolve(null)
            }
        });
  }

  public removeLocalData(key){
    return new Promise(async resolve => {
      let ret = await Storage.remove({key:`${this.virtualHostName}-${key}`}) 
    });
  }


  refreshToken(token){
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let input = {
      "refresh":token
    }
    let url = this.refreshtokenUrl;
    console.log("=== On demand refresh token with ", input)
    return this.http.post(url, input, options).pipe(
      tap(response => {
      console.log("=== Refresh Response", response)
      this.setLocalData("access",{"access":response["access"]})
      this.setLocalData("refresh",{"refresh":response["refresh"]})
      })
    );
  }
  
  login(user){
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    
    let url = this.getLoginUrl;

    return Observable.create(observer => {
      this.http.post(url, user, options).subscribe(
        (res) => {
          observer.next(res);
          observer.complete();
        }, 
        error => {
          observer.next();
          observer.complete();
          console.log(error);// Error getting the data
        });
    });
  }

  //This is where the user will be registered
  createUser(user){
    
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    
    let url = this.getAuthUserUrl;

    //console.log("url" + url);

    return Observable.create(observer => {
      // At this point make a request to your backend  
      console.log("on appelle BACKEND encoded url " + url);
      this.http.post(url, user, options)
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
  
  getUsers() {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let url = this.getUserUrl;

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
  
getProtocols() {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let url = this.getProtocolUrl;

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

createProtocol(protocol){
    
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    
    let url = this.getProtocolUrl;

    return Observable.create(observer => {
      // At this point make a request to your backend  
      console.log("on appelle BACKEND encoded url " + url);
      this.http.post(url, protocol, options)
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
  
getExperiments() {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let url = this.getExperimentUrl;

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
  
createExperiment(experiment){
    
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    
    let url = this.getExperimentUrl;

    return Observable.create(observer => {
      // At this point make a request to your backend  
      console.log("on appelle BACKEND encoded url " + url);
      this.http.post(url, experiment, options)
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

  sendResetPasswordLink(email) {
    const options = {
     headers: new HttpHeaders({
       'Content-type': "application/x-www-form-urlencoded",
       })
     }; 
    let postParams = {'email' : email,}
    let url = this.urlPwdOublie;
    return Observable.create(observer => {
      // At this point make a request to your backend to make a real check!
      this.http.post(url, postParams, options)
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

getLabGroups() {
  const options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  let url = this.getLabGroupUrl;

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

createLabGroups(labgroup){
  
  const options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  
  let url = this.getLabGroupUrl;

  return Observable.create(observer => {
    // At this point make a request to your backend  
    console.log("on appelle BACKEND encoded url " + url);
    this.http.post(url, labgroup, options)
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

createLabGroupMembership(labgroupmembership){
  
  const options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  
  let url = this.getLabGroupMembershipUrl;

  return Observable.create(observer => {
    // At this point make a request to your backend  
    console.log("on appelle BACKEND encoded url " + url);
    this.http.post(url, labgroupmembership, options)
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

getLabGroupMembership() {
  const options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  let url = this.getLabGroupMembershipUrl;

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
