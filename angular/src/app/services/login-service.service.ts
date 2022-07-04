import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  constructor(private http: HttpClient) { }

  url = "http://192.168.0.105:4000/api/login"

  checkAuth(body: any){
    return this.http.post(this.url, body)
  }

  loggedIn(){
    return !!localStorage.getItem('token')
  }

  logOut(){
    localStorage.removeItem('token')
  }
}
