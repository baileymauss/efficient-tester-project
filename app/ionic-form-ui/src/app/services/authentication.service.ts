import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { ApiDjangoService } from '../services/api-django.service';
 
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
 
const TOKEN_KEY = 'my-token';
 
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // Init with null to filter out the first value in a guard!
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';
 
  constructor(private http: HttpClient) {
    this.loadToken();
  }
 
  async loadToken() {
    const token = await Storage.get({ key: TOKEN_KEY });    
    if (token && token.value) {
      console.log('set token: ', token.value);
      this.token = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }
  login(credentials: {email, password}): Observable<any> {

    const options = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
    };

	//store userid in local storage
	let key = 'userID';
	let queryPath = '?email=' + this.credentials.email;
	let currentUser = this.apiService.findUser(queryPath);
	let currentUserID = currentUser.id;
	localStorage.setItem(key, JSON.stringify(currentUserID));
	
    return this.http.post(`http://127.0.0.1:8000/api/users/`, credentials, options).pipe(
      map((data: any) => data.token),
      switchMap(token => {
        return from(Storage.set({key: TOKEN_KEY, value: token}));
      }),
      tap(_ => {
        this.isAuthenticated.next(true);
      })
    )
	
  }
 
  logout(): Promise<void> {
    this.isAuthenticated.next(false);
	//clear local storage
	localStorage.clear();
    return Storage.remove({key: TOKEN_KEY});
  }
}
