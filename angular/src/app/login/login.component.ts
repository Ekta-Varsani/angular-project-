import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginServiceService } from '../services/login-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginData: any = {}
  constructor(private loginService: LoginServiceService,
    private router: Router) { }

  ngOnInit(): void {
  }

  onLogin(){
    this.loginService.checkAuth(this.loginData).subscribe(res => {
      console.log(res);
      const data = JSON.parse(JSON.stringify(res))
      localStorage.setItem('token', data.token)
      this.router.navigate(['/main'])
    })
  }

}
