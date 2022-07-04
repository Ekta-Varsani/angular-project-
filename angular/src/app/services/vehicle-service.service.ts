import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VehicleServiceService {

  constructor(private http: HttpClient) { }

  //add vehicle
  urlApi = "http://192.168.0.105:4000/api/vehicle/create"
  addVehicle(data:any){
    return this.http.post(this.urlApi, data)
  }

  //get vehicles
  getVehicleUrl = "http://192.168.0.105:4000/api/vehicle/allVehicle"
  vehicleDisplay(){
    return this.http.get(this.getVehicleUrl)
  }

  //update vehicle
  updateVehicle(url:any, body:any){
    const updateUrl = "http://192.168.0.105:4000/api/vehicle/update"
    return this.http.put(updateUrl + `/${url}`,body)
   }

}
