import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CountryServiceService } from '../services/country-service.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountryComponent implements OnInit {

  countrydata: any = []
  countryDisplayData:any = []
  searchText:any

  constructor(private countryService: CountryServiceService, private toastr: ToastrService, private ref: ChangeDetectorRef, private router: Router) {

    //display country list
    this.countryService.getCountry().subscribe(data => {
      this.countrydata = data;
    })
    
    //display data
    this.countryService.countryDisplay().subscribe(data => {
      this.countryDisplayData = data
    })
  }

  ngOnInit(): void {
  }

  basicForm = new FormGroup({
    CounteryName: new FormControl('', [Validators.required]),
    CurrencyCode: new FormControl('', [Validators.required]),
    CounteryCode: new FormControl('', [Validators.required]),
    CurrencySign: new FormControl('', [Validators.required]),
    Sign: new FormControl('', [Validators.required]),
    // _id: new FormControl('')
  });

  updateForm = new FormGroup({
    CurrencyCode: new FormControl(''),
    CounteryCode: new FormControl(''),
    CurrencySign: new FormControl(''),
    _id: new FormControl('')
  })

//display data of selected country--get---------
  selectCountry(event: any) {
    this.countryService.getdata(event.target.value).subscribe((res:any) => {
      this.basicForm = new FormGroup({
        'CounteryName': new FormControl(res[0].name),
        'CurrencyCode': new FormControl(res[0].currencies[0].code),
        'CounteryCode': new FormControl(res[0].callingCodes[0]),
        'CurrencySign': new FormControl(res[0].currencies[0].symbol),
        'Sign': new FormControl(res[0].flags.png)
      })
    })
  }
 
  //add country--post--------
  onSubmit(){
    this.countryService.addCountry(this.basicForm.value).subscribe(data => {
      console.log(this.basicForm.value)
      // this.ref.markForCheck();
      // this.toastr.success("country added successfully!!")

      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.toastr.success('Country added successfully!!!')
        this.router.navigate(['/main/country']);
      });
    })
  }

  //get current data-----------
  edit(id:any){
    console.log(id);
    this.countryService.edit(id).subscribe(res => {
      console.log(res) 
      const data = JSON.parse(JSON.stringify(res))
      this.updateForm = new FormGroup ({
        'CurrencyCode' : new FormControl(data.CurrencyCode),
        'CurrencySign': new FormControl(data.CurrencySign),
        'CounteryCode': new FormControl(data.CounteryCode),
        '_id': new FormControl(data._id)
      })
      const con:HTMLElement = document.getElementById("countryNameUpdate") as HTMLElement
      con.innerHTML = data.CounteryName
    })
  }

//update country
  update(data:any){
    this.countryService.updateCountry(data,this.updateForm.value).subscribe(res => {
      const data = JSON.parse(JSON.stringify(res))
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.toastr.success('country updated successfully!!!')
        this.router.navigate(['/main/country']);
      });
    })
  }

duplicate =document.getElementById("addCountry") as HTMLInputElement | null;
btn:any
//duplicate entry
compare(event:any){
    this.duplicate = (event.target.value).toLowerCase()
    this.btn=false
    for(let i =0 ;i<this.countryDisplayData.length; i++){
      if(this.duplicate == this.countryDisplayData[i].CounteryName){
        this.toastr.error("country already exists")
        this.btn=true
      }
    }
}

}
