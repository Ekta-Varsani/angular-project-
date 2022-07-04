import { Component } from '@angular/core';
import { BnNgIdleService } from 'bn-ng-idle';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'menu';
  constructor(private bnIdle: BnNgIdleService, private router: Router){}
  ngOnInit(): void {
    this.bnIdle.startWatching(1200).subscribe((isTimedOut: boolean) => {
      localStorage.removeItem('token')
      this.router.navigate(['/login'])
    });
  }
}
