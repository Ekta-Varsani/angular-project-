import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RideScheduledServiceService {

  constructor(private http: HttpClient) { }

  urlAddRideSchedule = "http://localhost:4000/api/rideSchedule/scheduledRide"
  addScheduledRide(body:any){
    return this.http.post(this.urlAddRideSchedule, body)
  }

  urlAllScheduledRides = "http://localhost:4000/api/rideSchedule/allRequests"
  getRequests(){
    return this.http.get(this.urlAllScheduledRides)
  }

  urlApprove = "http://localhost:4000/api/rideSchedule/approve/"
  getApproved(url:any, body:any){
    return this.http.put(this.urlApprove + `${url}`, body)
  }

  urlUpdateRide = "http://localhost:4000/api/rideSchedule/"

 
}
