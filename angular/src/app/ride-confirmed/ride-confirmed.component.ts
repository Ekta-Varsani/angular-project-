import { Component, OnInit } from '@angular/core';
import { DriverServiceService } from '../services/driver-service.service';
import { RideCreateServiceService } from '../services/ride-create-service.service';
import { RideScheduledServiceService } from '../services/ride-scheduled-service.service';
import { ToastrService } from 'ngx-toastr';
import { VehicleServiceService } from '../services/vehicle-service.service';
import { Router } from '@angular/router';
declare var $: any;

let formData: any = {}

@Component({
  selector: 'app-ride-confirmed',
  templateUrl: './ride-confirmed.component.html',
  styleUrls: ['./ride-confirmed.component.css']
})
export class RideConfirmedComponent implements OnInit {

  confirmedRideList: any = []
  acceptedRideList: any = []
  matchedDriver: any = [] // matched driver list with vehicle
  vehicleName: any // matchedVehicle of selected ride and driver
  rideId: any // id of selected ride
  selectedDate: any
  rideListOfSelectedDate: any = []
  driverList: any = []
  driverRides: any = [] // scheduled rides of seleceted driver
  reqList: any = [] //list of all requests for the drivers
  vehicleList: any = []
  searchText: any
  extra: any = [] //list of rides of current page


  constructor(private createRideService: RideCreateServiceService, private driverService: DriverServiceService, private scheduledRideService: RideScheduledServiceService, private toastr: ToastrService, private vehicleService: VehicleServiceService, private router: Router) {
    this.createRideService.getRide().subscribe(data => {
      this.confirmedRideList = data
      for (let i = 0; i < this.confirmedRideList.length; i++) {
        if (this.confirmedRideList[i].Status == 'accepted') {
          this.acceptedRideList.push(this.confirmedRideList[i])
        }
      }
    })

    this.driverService.getDrivers().subscribe(data => {
      this.driverList = data
    })

    this.scheduledRideService.getRequests().subscribe(data => {
      this.reqList = data
    })

    this.vehicleService.vehicleDisplay().subscribe(data => {
      this.vehicleList = data
    })
  }

  ngOnInit(): void {
    // let currentDate: any = new Date().toISOString().slice(0, 10);
    // console.log(currentDate);

    // (document.getElementById("date") as HTMLInputElement).value = currentDate;
    // this.rideListOfSelectedDate = []
    // for (let i = 0; i < this.acceptedRideList.length; i++) {
    //   let splitedDate = this.acceptedRideList[i].Date.split('T');
    //   let splitedDate1 = splitedDate[0]

    //   if (splitedDate1 == currentDate) {
    //     this.rideListOfSelectedDate.push(this.acceptedRideList[i])
    //     this.extra.push(this.acceptedRideList[i])
    //   }
    // }
  }

  getRides(event: any) {
    this.selectedDate = event.target.value
    this.rideListOfSelectedDate = []
    for (let i = 0; i < this.acceptedRideList.length; i++) {
      let splitedDate = this.acceptedRideList[i].Date.split('T');
      let splitedDate1 = splitedDate[0]

      if (splitedDate1 == this.selectedDate) {
        this.rideListOfSelectedDate.push(this.acceptedRideList[i])
        this.extra.push(this.acceptedRideList[i])
      }
    }

  }

  //search bu user
  searchByUser(event: any) {
    let search = event.target.value
    this.rideListOfSelectedDate = []

    for (let i = 0; i < this.extra.length; i++) {
      if (this.extra[i].UserDetail.UserName == search) {
        this.rideListOfSelectedDate.push(this.extra[i])
      }
    }
  }

  //search by driver
  searchByDriver(event:any){
    let search = event.target.value
    this.rideListOfSelectedDate = []

    for (let i = 0; i < this.extra.length; i++) {
      if (this.extra[i].DriverDetail.DriverName == search) {
        this.rideListOfSelectedDate.push(this.extra[i])
      }
    }
  }

  getDetailsOfRide(data: any) {
    console.log(data);
    let time = data.Date.split('T')[1]
    let final = time.split(':')
    let hr = final[0]
    let min = final[1]
    let ft = hr + ':' + min
    console.log(ft);


    (document.getElementById("getDetailOfRide") as HTMLElement).innerHTML = `
    <div class="card shadow p-2 detail">
    <div class="row">
        <div class="col-4">
            <span>
                <i class="fa fa-credit-card" aria-hidden="true"></i>
            </span>
            &#8377; ${data.finalCost}
        </div>
        <div class="col-5">
            <span>
                <i class="fa fa-clock-o" aria-hidden="true"></i>
            </span>
            ${data.Time}
        </div>
        <div class="col-3">
            <span>
                <i class="fa fa-road" aria-hidden="true"></i>
            </span>
            ${data.Distance}
        </div>
    </div>
    <div class="row mt-3">
        <div class="col-5">
            <strong>Creation Time:
            </strong>
        </div>
        <div class="col-7">${data.creationdate}</div>
    </div>
    <div class="row mt-3">
        <strong>Location:
        </strong>
    </div>
    <div class="row mt-3">
        <div class="col-3 extra">
            <div class="icon d-flex justify-content-center">
                <i class="fa fa-circle" aria-hidden="true"></i>
            </div>
        </div>
        <div class="col-9">
            <div class="location" style="background-color: rgb(248, 246, 246);">${data.PickUpLocation}</div>
        </div>
    </div>
    <div class="row mt-3">
        <div class="col-3 extra">
            <div class="icon d-flex justify-content-center">
                <i class="fa fa-circle" aria-hidden="true"></i>
            </div>
        </div>
        <div class="col-9">
            <div class="location" style="background-color: rgb(248, 246, 246);">${data.DropOffLocation}</div>
        </div>
    </div>
    <div class="row mt-3">
        <div class="col-4">
            <img class="mx-3" src="${data.UserDetail.image}" height="80px" width="80px" style="border-radius:50%;">
        </div>
        <div class="col-8">
            <strong>Passanger Detail:</strong><br>
            ${data.UserDetail.UserName}<br>
            ${data.UserDetail.Email}<br>
            ${data.UserDetail.PhoneNumber}
        </div>
    </div>
    <div class="row mt-3">
        <div class="col-4">
            <img class="mx-3" src="${data.DriverDetail.image}" height="80px" width="80px" style="border-radius:50%;">
        </div>
        <div class="col-8">
            <strong>Driver Detail:</strong><br>
            ${data.DriverDetail.DriverName}<br>
            ${data.DriverDetail.Email}<br>
            ${data.DriverDetail.PhoneNumber}
        </div>
    </div>
</div>
    `
    this.matchedDriver = []
    this.driverRides = []

    this.vehicleName = data.VehiclePriceDetail.ServiceType._id
    this.rideId = data._id

    for (let i = 0; i < this.driverList.length; i++) {
      if (this.vehicleName == this.driverList[i].ServiceType._id) {
        this.matchedDriver.push(this.driverList[i])
      }
    }

  }

  //get rides of selected driver
  getDriverSheduledRide(data: any) {
    this.driverRides = []

    for (let i = 0; i < this.confirmedRideList.length; i++) {
      if (this.confirmedRideList[i].Status == 'accepted') {
        if (data._id == this.confirmedRideList[i].DriverDetail._id) {
          this.driverRides.push(this.confirmedRideList[i])
        }
      }
    }
  }

  onAssignDriver() {
    formData['RideDetail'] = (document.getElementById("rideId") as HTMLInputElement).value;
    formData['DriverDetail'] = $('input[name="driver"]:checked').val()

    this.scheduledRideService.addScheduledRide(formData).subscribe(res => {
      console.log(res);
      this.toastr.success("Request has been sent to Driver Successfully!!")
    })
  }

  onAssignRandomDriver() {
    var item = this.matchedDriver[Math.floor(Math.random() * this.matchedDriver.length)];
    formData['RideDetail'] = (document.getElementById("rideId") as HTMLInputElement).value;
    formData['DriverDetail'] = item._id

    this.scheduledRideService.addScheduledRide(formData).subscribe(res => {
      console.log(res);
      this.toastr.success("Request has been sent to Driver Successfully!!")
    })
  }

  Status: any = 'canceled'
  //remove ride
  removeRide(data: any) {
    this.createRideService.updateStatus(data._id, { Status: this.Status }).subscribe(res => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.toastr.success('Ride canceled successfully!!!')
        this.router.navigate(['/main/confirmedRide']);
      });
    })
  }

}
