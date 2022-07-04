import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import 'bootstrap/dist/css/bootstrap.css';
import { CityServiceService } from '../services/city-service.service';
import { CountryServiceService } from '../services/country-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

declare var $:any;

let arr1: any = []; //array of lat lng
let coords: any = 0;
let coordString: any = [];
let coordFinalArray: any = [];
let obj : any //objectt of latLng for infowindow
let objLat:any //lat of infowindow obj
let objLng:any //lng of infowindow obj
var inp : any //id of selected country
var cityName:any 
var color:any 
var cityObj :any = {} //obj of city to store in db
var latLngArray:any = [] //array of obj of lat lng of drawn polygon
var latLngObj: any // obj of lat lng of single point of polygon
var existLatLngArr : any = [] //lat lng arr to display exists polygon
var jsonFormate: any //string of latLngArray
var map:any 
let updatedCoords:any
let location:any = []
let infowindow : any
let infowCoordsUpdate: any
let infowCoordsArr: any = []


@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {
  countryList:any = []
  cityList:any;
  cityArr:any = []
  
  constructor(private countryService: CountryServiceService, private cityService:CityServiceService, private toastr: ToastrService, private router: Router) { 

    //country data
    this.countryService.countryDisplay().subscribe(data => {
      this.countryList = data
    })

    //city data
    this.cityService.getCity().subscribe(data => {
      this.cityList = data
    })
  }

  basic = new FormGroup({
    countryId: new FormControl('', [Validators.required])
  })

  //country selection
  onchange(event:any){
    inp = event.target.value
    this.ngOnInit()
    this.cityArr= []
    for(let i=0;i<this.cityList.length;i++){ 
      if(inp == this.cityList[i].countryId._id){
        this.cityArr.push(this.cityList[i])
      }
    }
    
    for(let i=0; i<this.cityArr.length; i++){
          
      existLatLngArr = JSON.parse(this.cityArr[i].latitude)
      
      const existPolygon = new google.maps.Polygon({
        paths: existLatLngArr,
        strokeColor: this.cityArr[i].color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: this.cityArr[i].color,
        fillOpacity: 0.35,
        editable: true,
        draggable: true,
        map: map
      });
     
      google.maps.event.addListener(existPolygon.getPath(), "set_at", (data:any, latLng:any) =>{
        location = existPolygon.getPath().getArray()
        
        updatedCoords = JSON.stringify(location)
        
        // this.cityArr[i].latitude = updatedCoords
        infowCoordsArr = JSON.parse(this.cityArr[i].latitude)
        infowCoordsUpdate = infowCoordsArr[data]
        
        $('input[name="name"]').val('ADRIAN');
             

          //infoWindow body---
          const contentStringUpdate = `
          <div class="modal-body" id="modal">
            <form [formGroup]="basic" id="cityForm">
              <div class="form-group">
                <div class="row mt-3 ">
                    <div class="col">
                        <input type="text" id="name" value=${this.cityArr[i].CityName} name="CityName">
                    </div>
                </div>
                <div class="row mt-3 ">
                  <div class="col">
                    <input type="color" name="color" id="color" value=${this.cityArr[i].color}>
                  </div>
                </div>
                <button type="button" id="save" class="btn btn-sm btn-outline-success float-end mt-3">Save</button>
              </div>
            </form>
          </div>
        `
        infowindow.setContent(contentStringUpdate)
        infowindow.setPosition(infowCoordsUpdate)
        infowindow.open(map)

        //store data in db---------
        setTimeout(() => {
          $('#save').click( () => {
            cityName = $("#name").val();
            color = $("#color").val()
            this.cityArr[i].CityName = cityName
            this.cityArr[i].color = color
            this.cityArr[i].latitude = updatedCoords
            
            this.cityService.updateCity(this.cityArr[i]._id, this.cityArr[i]).subscribe(data => {
                this.toastr.success('City updated successfully!!!')
            })
            infowindow.close()
          })
        },1000) 
       
      }) 
      
    }
  }

  ngOnInit(): void {

    //map function
    const initMap = (): void => {
      map = new google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
          center: { lat: 20.5937, lng: 78.9629 },
          zoom: 4,
        }
      );
      const bounds = new google.maps.LatLngBounds();
      map.fitBounds(bounds);

      infowindow = new google.maps.InfoWindow();

      //polygon
      var drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_RIGHT,
          drawingModes: [
            google.maps.drawing.OverlayType.POLYGON
          ]
        },
        polygonOptions: {
          fillColor: '#66ff99',
          fillOpacity: 0.5,
          strokeWeight: 2,
          strokeColor: '#006699',
          clickable: false,
          editable: false,
          zIndex: 1
        }
      });

      drawingManager.setMap(map);
      
      //event on polygon complete
      google.maps.event.addListener(drawingManager, 'polygoncomplete',  (polygon: any) => {
        arr1= []
        coordFinalArray = []
        latLngArray = []

        for (var i = 0; i < polygon.getPath().getLength(); i++) {
          arr1.push(polygon.getPath().getAt(i).toUrlValue(6))
          coords++
        }
        
        coordString = arr1.toString(',')
        coordFinalArray = coordString.split(',')
        
        //lat long postion for db--------
        for(let i=0; i<coordFinalArray.length; i++){
          if(i%2==0){
            latLngObj = {
              lat: coordFinalArray[i],
              lng: coordFinalArray[i+1]
            }
            latLngArray.push({"lat":parseFloat(latLngObj.lat), "lng": parseFloat(latLngObj.lng) })
          }
        }    
        jsonFormate = JSON.stringify(latLngArray)  
       
        //infowindow position----
        objLat = parseFloat(coordFinalArray[0])
        objLng = parseFloat(coordFinalArray[1])
        obj = {
          lat: objLat,
          lng: objLng
        }

        //infoWindow body---
        const contentString = `
        <div class="modal-body" id="modal">
          <form [formGroup]="basic" id="cityForm">
            <div class="form-group">
              <div class="row mt-3 ">
                  <div class="col">
                      <input type="text" id="name" name="CityName">
                  </div>
              </div>
              <div class="row mt-3 ">
                <div class="col">
                  <input type="color" name="color" id="color" value="#53c68c">
                </div>
              </div>
              <button type="button" id="save" class="btn btn-sm btn-outline-success float-end mt-3">Save</button>
            </div>
          </form>
        </div>
      `
     
        infowindow.setContent(contentString)
        infowindow.setPosition(obj)
        infowindow.open(map)
        
        //store data in db---------
        setTimeout(() => {
          $('#save').click( () => {
            cityName = $("#name").val();
            color = $("#color").val()
           
            cityObj['CityName']= cityName
            cityObj['countryId']= inp
            cityObj['color'] = color
            cityObj['latitude']= jsonFormate
            
            this.cityService.addCity(cityObj).subscribe(res => {
              console.log(res);
              this.toastr.success('City added successfully!!!')  
            })
            infowindow.close()
          })
        },1000) 
       
      });
    }
    initMap()
  }

}


