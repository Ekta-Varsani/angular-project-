import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CountryComponent } from './country/country.component';
import { HomeComponent } from './home/home.component';
import {HttpClientModule} from '@angular/common/http';
import { UserComponent } from './user/user.component';
import { VehileComponent } from './vehicle/vehile.component'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { ToastrModule } from 'ngx-toastr';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { Ng2SearchPipeModule} from 'ng2-search-filter';
import { DriverComponent } from './driver/driver.component'
import { CommonModule } from '@angular/common';
import { BnNgIdleModule } from 'bn-ng-idle';
import { VehiclePricingComponent } from './vehicle-pricing/vehicle-pricing.component';
import { CityComponent } from './city/city.component';
import { RideCreateComponent } from './ride-create/ride-create.component';
import { RideScheduleComponent } from './ride-schedule/ride-schedule.component';
import { RideRequestToDriverComponent } from './ride-request-to-driver/ride-request-to-driver.component';
import { RideConfirmedComponent } from './ride-confirmed/ride-confirmed.component';
import {MatBadgeModule} from '@angular/material/badge';
import { RideHistoryComponent } from './ride-history/ride-history.component';

@NgModule({
  declarations: [
    AppComponent,
    CountryComponent,
    HomeComponent,
    UserComponent,
    VehileComponent,
    LoginComponent,
    MainComponent,
    DriverComponent,
    VehiclePricingComponent,
    CityComponent,
    RideCreateComponent,
    RideScheduleComponent,
    RideRequestToDriverComponent,
    RideConfirmedComponent,
    RideHistoryComponent,
   
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    Ng2SearchPipeModule,
    CommonModule,
    MatBadgeModule,
    ToastrModule.forRoot({
      timeOut: 3000
    })
  ],
  providers: [BnNgIdleModule],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class AppModule { }
