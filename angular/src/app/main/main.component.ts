import { Component, OnInit } from '@angular/core';
import { RideCreateServiceService } from '../services/ride-create-service.service';
declare var $:any;
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  reassignedData:any = []
  rideList:any = []
  notification:any 
  public sidebarShow: boolean = false;
  
  constructor(private createRideService: RideCreateServiceService) { 
    this.createRideService.getRide().subscribe(data => {
      this.rideList = data

      for(let i=0; i<this.rideList.length; i++){
        if(this.rideList[i].Status == 'declined'){
          this.reassignedData.push(this.rideList[i])
        }
      }
      this.notification = this.reassignedData.length
     
    })
  }

  ngOnInit(): void {
  }

  

}
