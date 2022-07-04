import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { UserServiceService } from '../services/user-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  userCountry: any = []
  userList: any = []
  paymentHandler: any;
  // paymentHandler: any;
  constructor(private userService: UserServiceService, private toastr: ToastrService, private router: Router) { 

    //display country list
    this.userService.getUserCountry().subscribe(data => {
      this.userCountry = data;
    })

    //display users
    this.userService.getUsers().subscribe(data => {
      this.userList = data;
    })
  }

  searchText: any
  userForm = new FormGroup({
    UserName: new FormControl('', [Validators.required]),
    Email: new FormControl('', [Validators.required, Validators.email]),
    PhoneNumber: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    countryId: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required])
  });

  updateUserForm = new FormGroup({
    UserName: new FormControl('', [Validators.required]),
    Email: new FormControl('', [Validators.required, Validators.email]),
    PhoneNumber: new FormControl('', [Validators.required]),
    countryId: new FormControl('', [Validators.required]),
    image: new FormControl(''),
  })

  get f() { return this.updateUserForm.controls; }

  imageSrc: any;
  file1:any
  readURL(event: any): void {
    // this.imageSrc = event.target.files[0]
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
         this.file1 = file
        const reader = new FileReader();
        reader.onload = e => this.imageSrc = reader.result;
        reader.readAsDataURL(this.file1=file);
    }
  }

  //add user
  onsubmit(){
    const fd = new FormData()
    fd.append('UserName', this.userForm.value.UserName)
    fd.append('Email', this.userForm.value.Email)
    fd.append('countryId', this.userForm.value.countryId)
    fd.append('PhoneNumber', this.userForm.value.PhoneNumber)
    fd.append('image', this.file1)
    this.userService.addUser(fd).subscribe(res => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.toastr.success('User added successfully!!!')
        this.router.navigate(['/main/user']);
      });
    })
  }

  //get current data while updationg
  currentImg:any
  getCurrentData(id:any){
    this.updateUserForm = new FormGroup({
      UserName: new FormControl(id.UserName),
      Email: new FormControl(id.Email),
      PhoneNumber: new FormControl(id.PhoneNumber),
      countryId: new FormControl(id.countryId._id),
      '_id': new FormControl(id._id)
    })
    this.currentImg = id.image
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
  updateUser(data:any){
    const fd = new FormData()
    fd.append('UserName', this.updateUserForm.value.UserName)
    fd.append('Email', this.updateUserForm.value.Email)
    fd.append('countryId', this.updateUserForm.value.countryId)
    fd.append('PhoneNumber', this.updateUserForm.value.PhoneNumber)
    fd.append('image', this.fileUpdate)
    this.userService.updateUser(data._id, fd).subscribe(res => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.toastr.success('User updated successfully!!!')
        this.router.navigate(['/main/user']);
      });
    })
  }

  ngOnInit(): void {
    this.addStripe()
  }

  //delete user
  deleteUser(data:any){
    console.log(data);
    this.userService.deleteUser(data).subscribe(res => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.toastr.success('User Deleted successfully!!!')
        this.router.navigate(['/main/user']);
      });
    })
  }

//validations---------------------

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
  duplicateEmail =document.getElementById("email") as HTMLInputElement | null;
  btn:any
  compareEmail(event:any){
    this.duplicateEmail = (event.target.value).toLowerCase()
    this.btn=false
    for(let i =0 ;i<this.userList.length; i++){
      if(this.duplicateEmail == this.userList[i].Email){
        this.toastr.error("Email already exists")
        this.btn=true
      }
    }
  }

  //duplicate Phone number
  duplicatePhone =document.getElementById("phone") as HTMLInputElement | null;
  btnPhone:any
  comparePhone(event:any){
    this.duplicatePhone = (event.target.value)
    this.btnPhone=false
    for(let i =0 ;i<this.userList.length; i++){
      if(this.duplicatePhone == this.userList[i].PhoneNumber){
        this.toastr.error("Phone already exists")
        this.btnPhone=true
      }
    }
  }

  //duplicate email while updatting
  duplicateEmailUpdate =document.getElementById("emailUpdate") as HTMLInputElement | null;
  btnUpdate:any
  compareEmailUpdate(event:any){
    this.duplicateEmailUpdate = (event.target.value).toLowerCase()
    this.btnUpdate=false
    for(let i =0 ;i<this.userList.length; i++){
      if(this.duplicateEmailUpdate == this.userList[i].Email){
        this.toastr.error("Email already exists")
        this.btnUpdate=true
      }
    }
  }

  //duplicate phone while updatting
  duplicatePhoneUpdate =document.getElementById("phoneUpdate") as HTMLInputElement | null;
  btnPhoneUpdate:any
  comparePhoneUpdate(event:any){
    this.duplicatePhoneUpdate = (event.target.value)
    this.btnPhoneUpdate=false
    for(let i =0 ;i<this.userList.length; i++){
      if(this.duplicatePhoneUpdate == this.userList[i].PhoneNumber){
        this.toastr.error("Phone Number already exists")
        this.btnPhoneUpdate=true
      }
    }
  }

  customer:any = []
  
  //add card details
  addCard(data:any){

    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51LGcrmItXZ8PhVwXtF6JVeSqNAOtuVGRGwSS3N6ghBslmL43k9rJjIfvcpmUOJS1oXJzBCpkDt4kNgVutPkIRtkR00oPNEur4C',
      locale: 'auto',
      name: data.UserName,
      token: function (stripeToken: any) {
        paymentstripe(stripeToken);
      },
    });

    const paymentstripe = (stripeToken: any) => {
      console.log(stripeToken);

      this.userService.createCustomer({name: data.UserName, email: data.Email, token: stripeToken }).subscribe((dataa: any) => {
        this.toastr.success("Card detail added Successfully..!!")
        this.customer = dataa
        
        this.userService.updateUser(data._id, {card: {cardDetail: stripeToken, customer: this.customer.id}}).subscribe(res => {
          console.log(res);
          
        })

      });

    };

    paymentHandler.open({
      name: data.name,
      description: data.UserName,
      // amount: 0,
      email: data.Email,
      // text: "ADD CARD"
    });

    
  }

  addStripe() {
    // if (!window.document.getElementById('stripe-script')) {
        const addScript = window.document.createElement('script');
        // addScript.id = 'stripe-script';
        addScript.type = 'text/javascript';
        addScript.src = 'https://checkout.stripe.com/checkout.js';
        addScript.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51LGcrmItXZ8PhVwXtF6JVeSqNAOtuVGRGwSS3N6ghBslmL43k9rJjIfvcpmUOJS1oXJzBCpkDt4kNgVutPkIRtkR00oPNEur4C',
          locale: 'auto',
          token: function (stripeToken: any) {
          },
        });
      };
      window.document.body.appendChild(addScript);
    // }
  }

   
}


