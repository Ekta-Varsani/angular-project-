import { Component, OnInit } from '@angular/core';
import { RideScheduledServiceService } from '../services/ride-scheduled-service.service';
import { ToastrService } from 'ngx-toastr';
import { RideCreateServiceService } from '../services/ride-create-service.service';
import { DriverServiceService } from '../services/driver-service.service';
import { io } from "socket.io-client";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-ride-request-to-driver',
  templateUrl: './ride-request-to-driver.component.html',
  styleUrls: ['./ride-request-to-driver.component.css']
})
export class RideRequestToDriverComponent implements OnInit {
  private socket : any;
  requestList:any = []
  accept:any
  decline:any
  // rideList:any

  constructor(private scheduledRideService: RideScheduledServiceService, private toastr: ToastrService, private createRideService: RideCreateServiceService, private driverService: DriverServiceService ) {
    this.scheduledRideService.getRequests().subscribe(data => {
      this.requestList = data
    })
    
     this.socket = io('http://localhost:4000');
  }

  ngOnInit(): void {
    this.socket.on("connect", (count: any) => {
      console.log("socket connected"); 
    });

    
    this.socket.on("updateReq", (socket:any) => {
      console.log("socket");
      // socket.next()
            // console.log(socket);

    })

    // this.updateRide()

  }

  // updateRide(){
  //   return new Observable(observer => {
  //     this.socket.on('updateReq', (message:any) => {
  //       observer.next(message);
  //       console.log(message);
        
  //     });
  //   });
  // }

  
  onAccept(data:any){
    console.log(data);
    
    this.accept = (document.getElementById("accept") as HTMLInputElement).value
    this.scheduledRideService.getApproved(data._id, {Status: this.accept}).subscribe(res => {
      this.toastr.success("You have accepted the request")
    })

    this.createRideService.getApprovance(data.RideDetail._id, {Status: this.accept, DriverDetail: data.DriverDetail._id}).subscribe(res => {
      console.log(res);
      
    })

   
  }

  onDecline(data:any){
    this.decline = (document.getElementById("decline") as HTMLInputElement).value;
    
    this.scheduledRideService.getApproved(data._id, {Status: null}).subscribe(res => {
      this.toastr.error("you have declined the request")
    })

    this.createRideService.getApprovance(data.RideDetail._id, {Status: 'pending'}).subscribe(res => {
      console.log(res);
      
    })

  }

}
