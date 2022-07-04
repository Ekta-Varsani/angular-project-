import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DriverServiceService {

  constructor(private http: HttpClient) { }

  //add user
  urlPost = "http://192.168.0.105:4000/api/driver/create"
  addDriver(body:any){
    console.log(body);
    return this.http.post(this.urlPost, body)
  }

  //get drivers
  urlGet = "http://192.168.0.105:4000/api/driver/getDrivers"
  getDrivers(){
    return this.http.get(this.urlGet)
  }

  //update driver
  urlUpdate = "http://192.168.0.105:4000/api/driver/update"
  updateDriver(url:any, body:any){
    return this.http.put(this.urlUpdate + `/${url}`, body)
  }

  //delete driver
  deleteDriver(url:any){
    const deleteUrl = "http://192.168.0.105:4000/api/driver/remove/"
    return this.http.delete(deleteUrl+url)
  }

  //assign vehicle
  assignVehicle(url:any, body:any){
    const assignVehicleUrl = "http://192.168.0.105:4000/api/driver/assignVehicle"
    return this.http.put(assignVehicleUrl + `/${url}`, body)
  }

  //add bank
  addDriverBank(url:any, body:any){
    const bankUrl = "http://192.168.0.105:4000/api/driver/addBank/"
    return this.http.put(bankUrl + `${url}`, body)
  }

  //update request status
  updateReqStatus(url:any, body:any){
    const urlUpdateStatus = "http://192.168.0.105:4000/api/driver/updateStatus/"
    return this.http.put(urlUpdateStatus + `${url}`, body)
  }

}
