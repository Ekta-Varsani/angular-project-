import { Component, OnInit } from '@angular/core';
import { CountryServiceService } from '../services/country-service.service';
import { RideCreateServiceService } from '../services/ride-create-service.service';
import { VehicleServiceService } from '../services/vehicle-service.service';
declare var $: any;

@Component({
  selector: 'app-ride-history',
  templateUrl: './ride-history.component.html',
  styleUrls: ['./ride-history.component.css']
})
export class RideHistoryComponent implements OnInit {

  rideList: any = []
  pageDetail: any = []
  countryList: any = []
  vehicleList: any = []
  page: any = 1
  limit: any = 2
  PickUpLocation: any
  DropOffLocation: any
  creationdate: any
  UserName: any
  UserPhoneNumber: any
  UserEmail: any
  UserImage: any
  DriverName: any
  DriverEmail: any
  DriverImage: any
  DriverPhoneNumber: any
  payment: any
  pickupDate: any
  totalPage: any
  lastData: any // last ride of current page
  finalLastData: any //last ride
  extra: any //list of rides of current page
  searchText: any

  constructor(private createRideService: RideCreateServiceService, private countryService: CountryServiceService, private vehicleService: VehicleServiceService) {
    //rides
    this.createRideService.getRideAcceptedOrCancled().subscribe(data => {
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

    //countries
    this.countryService.countryDisplay().subscribe(data => {
      this.countryList = data
    })

    //vehicles
    this.vehicleService.vehicleDisplay().subscribe(data => {
      this.vehicleList = data
    })
  }

  ngOnInit(): void {
    //first 2 rides
    this.createRideService.paginationForHistory({ page: this.page, limit: this.limit }).subscribe(data => {

      this.pageDetail = data
      this.extra = data

      this.PickUpLocation = this.pageDetail[0].PickUpLocation
      this.DropOffLocation = this.pageDetail[0].DropOffLocation
      this.UserImage = this.pageDetail[0].UserDetail.image
      this.UserName = this.pageDetail[0].UserDetail.UserName
      this.UserEmail = this.pageDetail[0].UserDetail.Email
      this.UserPhoneNumber = this.pageDetail[0].UserDetail.PhoneNumber
      this.creationdate = this.pageDetail[0].creationdate
      this.pickupDate = this.pageDetail[0].Date
      this.DriverName = this.pageDetail[0].DriverDetail.DriverName
      this.DriverEmail = this.pageDetail[0].DriverDetail.Email
      this.DriverPhoneNumber = this.pageDetail[0].DriverDetail.PhoneNumber
      this.DriverImage = this.pageDetail[0].DriverDetail.image

      if (this.pageDetail[0].Cash == 'true') {
        this.payment = 'Cash'
      }

    //disable next button
      this.lastData = this.pageDetail[this.pageDetail.length - 1]._id;
      this.finalLastData = this.rideList[this.rideList.length - 1]._id;

      if (this.lastData == this.finalLastData) {
        (document.getElementById("nextBtn") as HTMLButtonElement || null).disabled = true;
      }
    })
  }

  flage: any = true
  showDetails(data: any) {

    this.PickUpLocation = data.PickUpLocation
    this.DropOffLocation = data.DropOffLocation
    this.UserImage = data.UserDetail.image
    this.UserName = data.UserDetail.UserName
    this.UserEmail = data.UserDetail.Email
    this.UserPhoneNumber = data.UserDetail.PhoneNumber
    this.creationdate = data.creationdate
    this.pickupDate = data.Date

    if (data.Cash == 'true') {
      this.payment = 'Cash'
    }
    

    if (data.DriverDetail) {
      this.DriverName = data.DriverDetail.DriverName
      this.DriverEmail = data.DriverDetail.Email
      this.DriverPhoneNumber = data.DriverDetail.PhoneNumber
      this.DriverImage = data.DriverDetail.image
      this.flage = true
    }
    else {
      this.flage = false
    }

    $(`tr`).children().removeClass("selected");
    $(`#${data._id} > td`).addClass('selected')
  }

  //next page
  next() {
    this.page++;
    this.createRideService.paginationForHistory({ page: this.page, limit: this.limit }).subscribe(data => {
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

    this.createRideService.paginationForHistory({ page: this.page, limit: this.limit }).subscribe(data => {
      this.pageDetail = data
      this.extra = data
    });
    (document.getElementById("nextBtn") as HTMLElement).removeAttribute('disabled')
  }
  select: any
  textValue: any

  //search by user/ driver/ city
  getValue() {
    this.select = (document.getElementById("select") as HTMLInputElement).value
    if (this.select == 'user') {
      this.searchByUser()
    }
    if (this.select == 'driver') {
      this.searchByDriver()
    }
    if (this.select == 'city') {
      this.searchByCity()
    }
  }

  //search by user
  searchByUser() {
    let search = (document.getElementById("searchUser") as HTMLInputElement).value
    let myTable = document.getElementById("myTable") as HTMLElement;
    let tr = myTable.getElementsByTagName("tr")

    for (let i = 0; i < tr.length; i++) {
      let td = tr[i].getElementsByTagName("td")[1];

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

  //search by driver
  searchByDriver() {
    let search = (document.getElementById("searchUser") as HTMLInputElement).value
    let myTable = document.getElementById("myTable") as HTMLElement;
    let tr = myTable.getElementsByTagName("tr")

    for (let i = 0; i < tr.length; i++) {
      let td = tr[i].getElementsByTagName("td")[2];

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

  //search by city
  searchByCity() {
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

  //search by pickup date
  searchByPickUpDate(event:any){
    let search = event.target.value;
    this.pageDetail = []
    for (let i = 0; i < this.extra.length; i++) {
      if ((this.extra[i].Date).split('T')[0] == search) {
        this.pageDetail.push(this.extra[i])
        console.log(this.extra[i]);
      }
    }
  }

  //search by amount range
  searchByAmount(){
    this.pageDetail = []
    let from = (document.getElementById("from") as HTMLInputElement).value
    let to = (document.getElementById("to") as HTMLInputElement).value
    
    for(let i=0; i<this.extra.length; i++){
      if(this.extra[i].finalCost >= from && this.extra[i].finalCost <= to){
        this.pageDetail.push(this.extra[i])
      }
    }
  }

  //search by status
  searchByStatus(event:any){
    let search = event.target.value;
    this.pageDetail = []
    for (let i = 0; i < this.extra.length; i++) {
      if (this.extra[i].Status == search) {
        this.pageDetail.push(this.extra[i])
      }
    }
  }

}
