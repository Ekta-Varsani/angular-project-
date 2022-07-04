import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CityServiceService {

  constructor(private http: HttpClient) { }

  //add city
  urlPost = "http://192.168.0.105:4000/api/city/create"
  addCity(body:any){
    return this.http.post(this.urlPost, body)
  }

  //get cities
  urlGET = "http://192.168.0.105:4000/api/city/getCity"
  getCity(){
    return this.http.get<any>(this.urlGET)
  }

  //update driver
  urlUpdate = "http://192.168.0.105:4000/api/city/update"
  updateCity(url:any, body:any){
    return this.http.put(this.urlUpdate + `/${url}`, body)
  }
}
