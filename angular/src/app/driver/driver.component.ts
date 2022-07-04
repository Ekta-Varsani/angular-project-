import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DriverServiceService } from '../services/driver-service.service';
import { UserServiceService } from '../services/user-service.service';
import { VehicleServiceService } from '../services/vehicle-service.service';

declare var $:any;

let driverStatus:any ={}
let addBankObj:any = {}

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.css']
})
export class DriverComponent implements OnInit {

  countryList:any = []
  driverList:any = []
  vehicleList:any = []
  searchText:any

  approved:any = 'approved'
  

  constructor(private userService:UserServiceService, private driverSerive: DriverServiceService, private vehicleService: VehicleServiceService,private toastr: ToastrService,  private router: Router) { 

    //display countries
    this.userService.getUserCountry().subscribe(data => {
      this.countryList = data
    })

    //display drivers
    this.driverSerive.getDrivers().subscribe(data => {
      this.driverList = data
    })

    //display vehicles
    this.vehicleService.vehicleDisplay().subscribe(data => {
      this.vehicleList = data
    })
  }

  driverForm = new FormGroup({
    DriverName: new FormControl('', [Validators.required]),
    Email: new FormControl('', [Validators.required, Validators.email]),
    PhoneNumber: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    countryId: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required])
  })

  updateDriverForm = new FormGroup({
    DriverName: new FormControl('', [Validators.required]),
    Email: new FormControl('', [Validators.required, Validators.email]),
    PhoneNumber: new FormControl('', [Validators.required]),
    countryId: new FormControl('', [Validators.required]),
    image: new FormControl('')
  })  

  //image privew and ewmove fakepath
  imageSrc: any;
  file1:any;
  readURL(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
       this.file1 = file
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;
      reader.readAsDataURL(this.file1=file);
    }
  }

  //add driver
  onsubmit(){
    const fd = new FormData()
    fd.append('DriverName', this.driverForm.value.DriverName)
    fd.append('Email', this.driverForm.value.Email)
    fd.append('countryId', this.driverForm.value.countryId)
    fd.append('PhoneNumber', this.driverForm.value.PhoneNumber)
    fd.append('image', this.file1)
    this.driverSerive.addDriver(fd).subscribe(res => {
      console.log(res);
      // this.toastr.success("User added successfully!!")
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.toastr.success('Driver added successfully!!')
        this.router.navigate(['/main/driver']);
      });
    })
  }

  //get current data while updatting
  currentImgdriver:any
  getCurrentData(data:any){
    console.log(data);
    this.updateDriverForm = new FormGroup({
      DriverName: new FormControl(data.DriverName),
      Email: new FormControl(data.Email),
      PhoneNumber: new FormControl(data.PhoneNumber),
      countryId: new FormControl(data.countryId._id),
      _id: new FormControl(data._id)
    })
    this.currentImgdriver = data.image
  }

  //image privew while updatting
  urlUpdate:any = ''
  fileUpdate:any
  changeUpdate(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.fileUpdate = file
      const reader = new FileReader();
      reader.onload = e => this.urlUpdate = reader.result;
      reader.readAsDataURL(this.fileUpdate=file);
    }
  }

  //update driver
  updateDriver(data:any){
    const fd = new FormData()
    fd.append('DriverName', this.updateDriverForm.value.DriverName)
    fd.append('Email', this.updateDriverForm.value.Email)
    fd.append('countryId', this.updateDriverForm.value.countryId)
    fd.append('PhoneNumber', this.updateDriverForm.value.PhoneNumber)
    fd.append('image', this.fileUpdate)
    
    this.driverSerive.updateDriver(data._id, fd).subscribe(res => {
      console.log(res);
      // this.toastr.success("Driver updated successfully!!")
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.toastr.success('Driver updated successfully!!')
        this.router.navigate(['/main/driver']);
      });
    })
  }

  assignVehicleForm = new FormGroup({
    ServiceType: new FormControl('', [Validators.required]),
    OnlineStatus: new FormControl('approved')
  })

  selectedvehicle:any

  //get current vehicle
  selectVehicle(data:any){
    this.assignVehicleForm = new FormGroup({
      ServiceType: new FormControl(data.ServiceType),
      OnlineStatus: new FormControl("approved"),
      _id: new FormControl(data._id)
    })
  }

  // assign vehicle
  assignVehicle(data:any){
    console.log(this.assignVehicleForm.value);
    
    this.driverSerive.assignVehicle(data._id, this.assignVehicleForm.value).subscribe(res => {
      console.log(res);
      this.toastr.success("Vehicle Assigned to Driver successfully!!")
    }) 
  }

  selectedDriverId:any

  changeStatus(data:any){
    this.selectedDriverId = data._id
    if(data.OnlineStatus == 'approved'){
      $("#dec").show()
      $("#app").hide()
    }
    if(data.OnlineStatus == 'declined'){
      $("#app").show()
      $("#dec").hide()
    }
  }

  //decline status
  onDecline(){
    driverStatus['OnlineStatus'] = 'declined'
    this.driverSerive.assignVehicle(this.selectedDriverId, driverStatus).subscribe(res => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/main/driver']);
      });
    })
  }

  //approve status
  onApprove(){
    driverStatus['OnlineStatus'] = 'approved'
    this.driverSerive.assignVehicle(this.selectedDriverId, driverStatus).subscribe(res => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/main/driver']);
      });
    })
  }

  //delete driver
  deleteDriver(data:any){
    this.driverSerive.deleteDriver(data._id).subscribe(res => {
      console.log(res);
      // this.toastr.success("Driver deleted successfully!!")
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.toastr.success('Driver deleted successfully!!')
        this.router.navigate(['/main/driver']);
      })
    })
  }

  ngOnInit(): void {
  }

 
  addBankForm = new FormGroup({
    DriverName: new FormControl(''),
    Email: new FormControl(''),
    accountNumber: new FormControl('', [Validators.required]),
    routingNumber: new FormControl('', [Validators.required])
  })

  //add bank
  addBank(data:any){
    this.addBankForm = new FormGroup({
      DriverName : new FormControl(data.DriverName),
      Email: new FormControl(data.Email),
      accountNumber: new FormControl(''),
      routingNumber: new FormControl(''),
      _id: new FormControl(data._id)
    })
  }

  onAddBank(data:any){

   console.log(this.addBankForm.value);
   
    this.driverSerive.addDriverBank(data._id, this.addBankForm.value).subscribe(res => {
      console.log(res);
      
    })
  }
  
//validations---------------------------

  //phone validation
  isNumber(evt:any) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;  
  }

   //duplicate email
   duplicateEmailDriver =document.getElementById("emailDriver") as HTMLInputElement | null;
   btn:any
   compareEmail(event:any){
     this.duplicateEmailDriver = (event.target.value).toLowerCase()
     this.btn=false
     for(let i =0 ;i<this.driverList.length; i++){
       if(this.duplicateEmailDriver == this.driverList[i].Email){
         this.toastr.error("Email already exists")
         this.btn=true
       }
     }
   }
 
   //duplicate Phone number
   duplicatePhoneDriver =document.getElementById("phoneDriver") as HTMLInputElement | null;
   btnPhoneDriver:any
   comparePhone(event:any){
     this.duplicatePhoneDriver = (event.target.value)
     this.btnPhoneDriver=false
     for(let i =0 ;i<this.driverList.length; i++){
       if(this.duplicatePhoneDriver == this.driverList[i].PhoneNumber){
         this.toastr.error("Phone already exists")
         this.btnPhoneDriver=true
       }
     }
   }
 
   //duplicate email while updatting
   duplicateEmailUpdateDriver =document.getElementById("emailUpdateDriver") as HTMLInputElement | null;
   btnUpdateDriver:any
   compareEmailUpdate(event:any){
     this.duplicateEmailUpdateDriver = (event.target.value).toLowerCase()
     this.btnUpdateDriver=false
     for(let i =0 ;i<this.driverList.length; i++){
       if(this.duplicateEmailUpdateDriver == this.driverList[i].Email){
         this.toastr.error("Email already exists")
         this.btnUpdateDriver=true
       }
     }
   }
 
   //duplicate phone while updatting
   duplicatePhoneUpdateDriver =document.getElementById("phoneUpdateDriver") as HTMLInputElement | null;
   btnPhoneUpdateDriver:any
   comparePhoneUpdate(event:any){
     this.duplicatePhoneUpdateDriver = (event.target.value)
     this.btnPhoneUpdateDriver=false
     for(let i =0 ;i<this.driverList.length; i++){
       if(this.duplicatePhoneUpdateDriver == this.driverList[i].PhoneNumber){
         this.toastr.error("Phone Number already exists")
         this.btnPhoneUpdateDriver=true
       }
     }
   }

  
}
