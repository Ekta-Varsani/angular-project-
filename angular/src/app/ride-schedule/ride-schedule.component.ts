import { Component, OnInit } from '@angular/core';
import { DriverServiceService } from '../services/driver-service.service';
import { RideCreateServiceService } from '../services/ride-create-service.service';
import { RideScheduledServiceService } from '../services/ride-scheduled-service.service';
import { VehicleServiceService } from '../services/vehicle-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

declare var $: any;

let formData: any = {}

@Component({
    selector: 'app-ride-schedule',
    templateUrl: './ride-schedule.component.html',
    styleUrls: ['./ride-schedule.component.css']
})
export class RideScheduleComponent implements OnInit {
    rideList: any = []
    driverList: any = []
    vehicleList: any = []
   
    finalCost: any
    Time: any
    Distance: any
    PickUpLocation: any
    DropOffLocation: any
    creationdate: any
    UserName: any
    PhoneNumber: any
    Email: any
    image: any
    user: any
    searchText: any
    textValue: any
    date: any
    page: any = 1
    limit: any = 10
    pageDetail: any = [] // list of rides of current page
    totalPage: any
    lastData: any // last ride of current page
    finalLastData: any //last ride
    extra: any //list of rides of current page
    rideId: any // id of selected ride
    reqList: any = [] //list of all requests for the drivers 
    vehicleName: any // matchedVehicle of selected ride and driver
    matchedDriver: any = [] // matched driver list with vehicle
    driverRides: any = [] // scheduled rides of seleceted driver
    select: any //selected value for search

    constructor(private rideCreateService: RideCreateServiceService, private driverService: DriverServiceService, private vehicleService: VehicleServiceService, private scheduledRideservice: RideScheduledServiceService, private toastr: ToastrService, private router: Router) {

        //all drivers
        this.driverService.getDrivers().subscribe(data => {
            this.driverList = data
        })

        //all vehicles
        this.vehicleService.vehicleDisplay().subscribe(data => {
            this.vehicleList = data
        })

        //all rides
        this.rideCreateService.getRide().subscribe(data => {
            this.rideList = data

            if (this.limit < this.rideList.length) {
                if (this.rideList.length % 2 == 0) {
                    this.totalPage = ((this.rideList.length) / this.limit)
                }
                else {
                    this.totalPage = ((this.rideList.length) / this.limit) + 0.5
                }
            }
            else {
                this.totalPage = 1
            }
        })

        //all requests for drivers
        this.scheduledRideservice.getRequests().subscribe(data => {
            this.reqList = data
        })


    }

    ngOnInit(): void {
        //first 2 rides 
        this.rideCreateService.pagination({ page: this.page, limit: this.limit }).subscribe(data => {
            this.pageDetail = data
            this.extra = data

            //data of first ride
            this.finalCost = this.pageDetail[0].finalCost
            this.Time = this.pageDetail[0].Time
            this.Distance = this.pageDetail[0].Distance
            this.PickUpLocation = this.pageDetail[0].PickUpLocation
            this.DropOffLocation = this.pageDetail[0].DropOffLocation
            this.image = this.pageDetail[0].UserDetail.image
            this.UserName = this.pageDetail[0].UserDetail.UserName
            this.Email = this.pageDetail[0].UserDetail.Email
            this.PhoneNumber = this.pageDetail[0].UserDetail.PhoneNumber
            this.creationdate = this.pageDetail[0].creationdate
        })

        // $(`#${this.pageDetail[0]._id} > td`).addClass('selected')
    }

    //search by name/ pickup location/dropoff location
    getValue(event: any) {
        this.select = (document.getElementById("select") as HTMLInputElement).value
        if (this.select == 'User') {
            this.searchByUser()
        }
        if (this.select == 'PickUp Add') {
            this.searchByPickUpLocation()
        }
        if (this.select == 'DropOff Add') {
            this.searchByDropOffLocation()
        }
    }

    //search by user
    searchByUser() {
        let search = (document.getElementById("searchUser") as HTMLInputElement).value
        let myTable = document.getElementById("myTable") as HTMLElement;
        let tr = myTable.getElementsByTagName("tr")

        for (let i = 0; i < tr.length; i++) {
            let td = tr[i].getElementsByTagName("td")[3];

            if (td) {
                this.textValue = td.textContent;

                if (this.textValue.indexOf(search) > -1) {

                    tr[i].style.display = ""
                }
                else {
                    tr[i].style.display = "none"
                }
            }
        }
    }

    //search by pickuplocation
    searchByPickUpLocation() {
        let search = (document.getElementById("searchUser") as HTMLInputElement).value
        let myTable = document.getElementById("myTable") as HTMLElement;
        let tr = myTable.getElementsByTagName("tr")

        for (let i = 0; i < tr.length; i++) {
            let td = tr[i].getElementsByTagName("td")[4];

            if (td) {
                this.textValue = td.textContent;

                if (this.textValue.indexOf(search) > -1) {

                    tr[i].style.display = ""
                }
                else {
                    tr[i].style.display = "none"
                }
            }
        }
    }

    //search by dropoff location
    searchByDropOffLocation() {
        let search = (document.getElementById("searchUser") as HTMLInputElement).value
        let myTable = document.getElementById("myTable") as HTMLElement;
        let tr = myTable.getElementsByTagName("tr")

        for (let i = 0; i < tr.length; i++) {
            let td = tr[i].getElementsByTagName("td")[5];

            if (td) {
                this.textValue = td.textContent;

                if (this.textValue.indexOf(search) > -1) {

                    tr[i].style.display = ""
                }
                else {
                    tr[i].style.display = "none"
                }
            }
        }
    }

    //search by creation date
    searchByCreationDate(event: any) {
        let search = event.target.value;
        this.pageDetail = []
        for (let i = 0; i < this.extra.length; i++) {
            if ((this.extra[i].creationdate).split('T')[0] == search) {
                this.pageDetail.push(this.extra[i])
                console.log(this.extra[i]);
            }
        }
    }

    //show details at right side when clicked
    showDetails(data: any, event: any) {
        this.driverRides = []
        this.matchedDriver = []

        this.finalCost = data.finalCost
        this.Time = data.Time
        this.Distance = data.Distance
        this.PickUpLocation = data.PickUpLocation
        this.DropOffLocation = data.DropOffLocation
        this.creationdate = data.creationdate
        this.UserName = data.UserDetail.UserName
        this.Email = data.UserDetail.Email
        this.PhoneNumber = data.UserDetail.PhoneNumber
        this.image = data.UserDetail.image

        $(`tr`).children().removeClass("selected");
        $(`#${data._id} > td`).addClass('selected')

        //get drivers who has same vehicle
        this.vehicleName = data.VehiclePriceDetail.ServiceType._id
        this.rideId = data._id
        for (let i = 0; i < this.driverList.length; i++) {
            if (this.vehicleName == this.driverList[i].ServiceType._id) {
                if(this.driverList[i].OnlineStatus == 'approved' && this.driverList[i].ReqStatus == null){
                    this.matchedDriver.push(this.driverList[i])
                }
            }
        }
    }

    //next page
    next() {
        this.page++;
        this.rideCreateService.pagination({ page: this.page, limit: this.limit }).subscribe(data => {
            this.pageDetail = data
            this.extra = data
            this.lastData = this.pageDetail[this.pageDetail.length - 1]._id;
            this.finalLastData = this.rideList[this.rideList.length - 1]._id;

            (document.getElementById("previousBtn") as HTMLElement).removeAttribute('disabled');

            if (this.lastData == this.finalLastData) {
                (document.getElementById("nextBtn") as HTMLButtonElement || null).disabled = true;
            }

        });
    }

    //previous page
    previous() {
        this.page--;
        if (this.page == 1) {
            (document.getElementById("previousBtn") as HTMLButtonElement).disabled = true;
        }

        this.rideCreateService.pagination({ page: this.page, limit: this.limit }).subscribe(data => {
            this.pageDetail = data
            this.extra = data
        });
        (document.getElementById("nextBtn") as HTMLElement).removeAttribute('disabled')
    }

    Status: any = 'canceled'
    //cancel ride
    removeRide(data: any) {
        this.rideCreateService.updateStatus(data._id, { Status: this.Status, DriverDetail: null }).subscribe(res => {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.toastr.success('Ride canceled successfully!!!')
                this.router.navigate(['/main/scheduleRide']);
            });
        })
    }

    //get rides of selected driver
    getDriverSheduledRide(data: any) {
        this.driverRides = []
        console.log(this.driverList);
        
        for (let i = 0; i < this.rideList.length; i++) {
            if (this.rideList[i].DriverDetail) {
                if (data._id == this.rideList[i].DriverDetail._id) {
                    if (this.rideList[i].Status == 'accepted') {
                        this.driverRides.push(this.rideList[i])
                    }
                }
            }
        }
    }

    
    //assign driver
    onAssignDriver() {
        formData['RideDetail'] = (document.getElementById("rideId") as HTMLInputElement).value;
        formData['DriverDetail'] = $('input[name="driver"]:checked').val()
        formData['SelectedDriver'] = 'selected'
        let driverId = $('input[name="driver"]:checked').val()

        this.scheduledRideservice.addScheduledRide(formData).subscribe(res => { 
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.toastr.success('Request has been sent to Driver Successfully!!')
                this.router.navigate(['/main/scheduleRide']);
            });
        });

        this.rideCreateService.updateStatus(this.rideId, {Status: 'pending', DriverDetail: driverId}).subscribe(res => {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/main/request']);
            });
        })
    }

    //assign random driver
    onAssignRandomDriver() {
        var item = this.matchedDriver[Math.floor(Math.random() * this.matchedDriver.length)];
        let currentTime =  Date.now()
       
        this.scheduledRideservice.addScheduledRide({RideDetail: this.rideId, DriverDetail: item._id, reqTime:currentTime,Status: null}).subscribe(res => {
            this.toastr.success("Request has been sent to Driver Successfully!!")
        })

        this.rideCreateService.updateStatus(this.rideId, {Status: 'pending', DriverDetail: item._id}).subscribe(res => {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/main/request']);
            });
        })

        this.driverService.updateReqStatus(item._id, {ReqStatus: 'assigned'}).subscribe(res => {
            console.log(res);
        })

    }

}





