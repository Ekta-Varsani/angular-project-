import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
url = "http://192.168.0.105:4000/api/countery"
  constructor(private http: HttpClient) { }

  //get country
  getUserCountry(){
    return this.http.get(this.url)
  }

  //add user
  urlPost = "http://192.168.0.105:4000/api/user/addUser"
  addUser(body:any){
    console.log(body);
    return this.http.post(this.urlPost, body)
  }

  //get users
  urlGetUser = "http://192.168.0.105:4000/api/user/getuser/alluser"
  getUsers(){
    return this.http.get(this.urlGetUser)
  }
 
  //update user
  updateUser(url:any, body:any){
    const updateUrl = "http://192.168.0.105:4000/api/user/updateUser"
    return this.http.put(updateUrl + `/${url}`,body)
   }

   //delete user
   deleteUser(url:any){
     const deleteUrl = "http://192.168.0.105:4000/api/user/remove/"
     return this.http.delete(deleteUrl+url)
   }

   //create customer on stripe
   createCustomer( body:any){
     const urlStripe = "http://192.168.0.105:4000/api/stripe/addStripe"
     return this.http.post(urlStripe , body)
   }

}
