import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { VehicleServiceService } from '../services/vehicle-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehile',
  templateUrl: './vehile.component.html',
  styleUrls: ['./vehile.component.css']
})
export class VehileComponent implements OnInit {

  vehicleDisplayData:any = []

  constructor(private vehicleService: VehicleServiceService, private toastr: ToastrService, private router: Router) { 

    //display vehicle data
    this.vehicleService.vehicleDisplay().subscribe(data => {
      this.vehicleDisplayData = data;
    }) 
  }

  vehicleForm = new FormGroup ({
    VehicleName: new FormControl('', [Validators.required]),
    image: new FormControl('')
  })

  updateVehicleForm = new FormGroup({
    VehicleName: new FormControl('', [Validators.required]),
    image: new FormControl('')
  })

  ngOnInit(): void {
  }

  //display image
  url:any = ''
  change(event: any) {
    this.url = event.target.files[0]
  }
 
  //add vehicle
  onSubmit(){
    const fd = new FormData()
    fd.append('VehicleName', this.vehicleForm.value.VehicleName)
    fd.append('image', this.url)
    this.vehicleService.addVehicle(fd).subscribe(res => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.toastr.success('Vehicle added successfully!!!')
        this.router.navigate(['/main/vehicle']);
      });
    })
  }

  //display current data on update
  currentImgVehicle:any
  edit(data:any){
    this.updateVehicleForm = new FormGroup({
      VehicleName: new FormControl(data.VehicleName),
      _id : new FormControl(data._id)
    })
    this.currentImgVehicle = data.image
  }

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
 
  //update vehicle
  onUpdate(data:any){
    const fd = new FormData()
    fd.append('VehicleName', this.updateVehicleForm.value.VehicleName)
    fd.append('image', this.fileUpdate)
    fd.append('_id', this.updateVehicleForm.value._id)
    this.vehicleService.updateVehicle(data._id, fd).subscribe(res => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.toastr.success('Vehicle added successfully!!!')
        this.router.navigate(['/main/vehicle']);
      });
    })
  }
}
