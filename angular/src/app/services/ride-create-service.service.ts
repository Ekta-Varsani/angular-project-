import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RideCreateServiceService {

  constructor(private http: HttpClient) { }

  urlAdd = "http://192.168.0.105:4000/api/rideCreate/create"
  addRide(body:any){
    return this.http.post(this.urlAdd, body)
  }

  urlGet = "http://192.168.0.105:4000/api/rideCreate/getRide"
  getRide(){
    return this.http.get(this.urlGet)
  }

  urlPagination = "http://192.168.0.105:4000/api/rideCreate/pagination"
  pagination(body:any){
    return this.http.post(this.urlPagination, body)
  }

  urlApproved = "http://192.168.0.105:4000/api/rideCreate/approvedOrNot/"
  getApprovance(url:any, body:any){
    return this.http.put(this.urlApproved + `${url}`, body)
  }

  urlRemoveRide = "http://192.168.0.105:4000/api/rideCreate/removeRide/"
  deteleRide(url:any){
    return this.http.delete(this.urlRemoveRide + `${url}`)
  }

  urlUpdateRide = "http://192.168.0.105:4000/api/rideCreate/rideStatus/"
  updateStatus(url:any, body:any){
    return this.http.put(this.urlUpdateRide + `${url}`, body)
  }

  urlPaginationHistory = "http://192.168.0.105:4000/api/rideCreate/paginationApiForHistory"
  paginationForHistory(body:any){
    return this.http.post(this.urlPaginationHistory, body)
  }

  urlGetAcceptedOrCanceled = "http://192.168.0.105:4000/api/rideCreate/RideAcceptedOrCanceled"
  getRideAcceptedOrCancled(){
    return this.http.get(this.urlGetAcceptedOrCanceled)
  }
}
