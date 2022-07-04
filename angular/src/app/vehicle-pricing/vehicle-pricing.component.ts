import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CityServiceService } from '../services/city-service.service';
import { CountryServiceService } from '../services/country-service.service';
import { VehiclePriceServiceService } from '../services/vehicle-price-service.service';
import { VehicleServiceService } from '../services/vehicle-service.service';
import { ToastrService } from 'ngx-toastr';

let inp: any

@Component({
  selector: 'app-vehicle-pricing',
  templateUrl: './vehicle-pricing.component.html',
  styleUrls: ['./vehicle-pricing.component.css']
})
export class VehiclePricingComponent implements OnInit {

  countryList:any = []
  vehicleList:any = []
  cityList: any = []
  countryWiseCities:any = []
  
  constructor(private priceService: VehiclePriceServiceService, private countryService: CountryServiceService, private vehicleService: VehicleServiceService, private cityService: CityServiceService, private toastr: ToastrService) { 
    //country
    this.countryService.countryDisplay().subscribe(res => {
      this.countryList = res
    })
    //vehicle
    this.vehicleService.vehicleDisplay().subscribe(res => {
      this.vehicleList = res
    })

    //cities
    this.cityService.getCity().subscribe(res => {
      this.cityList = res
    })
  }

  priceForm = new FormGroup({
    countryId: new FormControl('', [Validators.required]),
    CityName: new FormControl('', [Validators.required]),
    ServiceType: new FormControl('', [Validators.required]),
    MaxSpace: new FormControl('', [Validators.required]),
    Profite: new FormControl('', [Validators.required]),
    MinFare: new FormControl('', [Validators.required]),
    DistancePrice: new FormControl('', [Validators.required]),
    BasePrice: new FormControl('', [Validators.required]),
    PpUD: new FormControl('', [Validators.required]),
    PpUT: new FormControl('', [Validators.required]),
  })

  onChange(event:any){
    this.countryWiseCities = []
    inp = event.target.value
    for(let i=0; i<this.cityList.length; i++){
      if(inp == this.cityList[i].countryId._id){
        this.countryWiseCities.push(this.cityList[i]) 
      }
    }  
    console.log(this.countryWiseCities);
    
  }

  onSubmit(){
    this.priceService.addPrice(this.priceForm.value).subscribe(res => {
      this.toastr.success('Price added successfully!!!')
    })
    window.location.reload()
  }

  ngOnInit(): void {
  }

}
