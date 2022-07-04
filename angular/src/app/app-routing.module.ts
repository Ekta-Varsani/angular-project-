import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CityComponent } from './city/city.component';
import { CountryComponent } from './country/country.component';
import { DriverComponent } from './driver/driver.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { RideConfirmedComponent } from './ride-confirmed/ride-confirmed.component';
import { RideCreateComponent } from './ride-create/ride-create.component';
import { RideHistoryComponent } from './ride-history/ride-history.component';
import { RideRequestToDriverComponent } from './ride-request-to-driver/ride-request-to-driver.component';
import { RideScheduleComponent } from './ride-schedule/ride-schedule.component';
import { UserComponent } from './user/user.component';
import { VehiclePricingComponent } from './vehicle-pricing/vehicle-pricing.component';

import { VehileComponent } from './vehicle/vehile.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: "full"
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: "main",
    component: MainComponent,
    children: [
      {
        path: "country",
        component: CountryComponent,
      },
      {
        path: 'user',
        component: UserComponent
      },
      {
        path: 'vehicle',
        component: VehileComponent
      },
      {
        path: 'driver',
        component: DriverComponent
      },
      {
        path: 'vehiclePricing',
        component: VehiclePricingComponent
      },
      {
        path: 'city',
        component: CityComponent
      },
      {
        path: 'createRide',
        component: RideCreateComponent
      },
      {
        path: 'scheduleRide',
        component: RideScheduleComponent
      },
      {
        path: 'request',
        component: RideRequestToDriverComponent
      },
      {
        path: 'confirmedRide',
        component: RideConfirmedComponent
      },
      {
        path: 'rideHistory',
        component: RideHistoryComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  
 }
