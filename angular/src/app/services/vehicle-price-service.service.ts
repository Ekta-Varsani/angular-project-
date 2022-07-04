import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VehiclePriceServiceService {

  constructor(private http: HttpClient) { }

  //add pricing
  urlPost = "http://localhost:4000/api/vehiclePrice/create"
  addPrice(body:any){
    return this.http.post(this.urlPost, body)
  }

  urlget = "http://localhost:4000/api/vehiclePrice/getPrice"
  getPrice(){
    return this.http.get(this.urlget)
  }
}
