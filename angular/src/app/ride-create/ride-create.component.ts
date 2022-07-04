import { Component, getModuleFactory, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { CountryServiceService } from '../services/country-service.service';
import { UserServiceService } from '../services/user-service.service';
import { ToastrService } from 'ngx-toastr';
import { CityServiceService } from '../services/city-service.service';
import { VehiclePriceServiceService } from '../services/vehicle-price-service.service';
import { RideCreateServiceService } from '../services/ride-create-service.service';
declare var $:any;

let map: any
let existsLatLng: any
let existLat: any = []
let existLng: any = []
let coords: any
let latitude: any 
let longitude: any 
let city:Array<any>=[]
let matchedPlacedata:any
let vehiclePriceList:any = []
let matchedPlaceVehicle:any = []
let distance:any
let distanceArray: any = []
let finalDistance:any
let finalTime:any
let time:any
let timeArray: any = []
let priceForVehicle:any
let priceForVehicleArray: any = []
let formData:any={}
let userId:any
let timeStart:any
let timeEnd:any
let distanceStart:any
let distanceEnd:any
let distanceStartArray:any = []
let distanceEndArray: any = []
let timeStartArray:any = []
let TimeEndArray:any = []
let timeDisplayHour:any
let timeDisplayMin:any
let finalDistanceMid:any
let finalTimeMid:any

function printpolygon(coords: any, existLat: any, existLng: any, latitude: any, longitude: any) {
  let oddNodes: any = false;
  let j = coords - 1;
  for (let i = 0; i < coords; i++) {
    if (existLng[i] < longitude && existLng[j] >= longitude || existLng[j] < longitude && existLng[i] >= longitude && (existLat[i] <= latitude || existLat[j] <= latitude)) {
      if ((existLat[i] + (longitude - existLng[i]) * (existLat[j] - existLat[i]) / (existLng[j] - existLng[i])) < latitude) {
        oddNodes = !oddNodes
      }
    }
    j = i;
  }
  return oddNodes;
}

class AutocompleteDirectionsHandler {
  map: google.maps.Map;
  originPlaceId: string;
  destinationPlaceId: string;
  travelMode: google.maps.TravelMode;
  directionsService: google.maps.DirectionsService;
  directionsRenderer: google.maps.DirectionsRenderer;

  constructor(map: google.maps.Map) {
    this.map = map;
    this.originPlaceId = "";
    this.destinationPlaceId = "";
    this.travelMode = google.maps.TravelMode.DRIVING;
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsRenderer.setMap(map);

    const originInput = document.getElementById(
      "origin-input"
    ) as HTMLInputElement;
    const destinationInput = document.getElementById(
      "destination-input"
    ) as HTMLInputElement;
    const addedInput = document.getElementById("addedInput") as HTMLInputElement

    // Specify just the place data fields that you need.
    const originAutocomplete = new google.maps.places.Autocomplete(
      originInput,
      { fields: ["name", "formatted_address", "place_id", "geometry"] }
    );

    const destinationAutocomplete = new google.maps.places.Autocomplete(
      destinationInput,
      { fields: ["name", "formatted_address", "place_id", "geometry"] }
    );

    const addedInputAutocomplete = new google.maps.places.Autocomplete(
      addedInput,
      { fields: ["name", "formatted_address", "place_id", "geometry"] }
    );

    this.setupPlaceChangedListenerOrigin(originAutocomplete, "ORIG");
    this.setupPlaceChangedListener(destinationAutocomplete, "DEST");
    this.setupPlaceChangedListener(addedInputAutocomplete, "ADD")
  }

  setupPlaceChangedListenerOrigin(
    autocomplete: google.maps.places.Autocomplete,
    mode: string
  ) {
    autocomplete.bindTo("bounds", this.map);

    autocomplete.addListener("place_changed", () => {

      /*use for get latitude and longitude  */
      var place = autocomplete.getPlace();
      var lat = place.formatted_address

      latitude = place.geometry?.location?.lat()
      longitude = place.geometry?.location?.lng()
      
      if(place.geometry?.location){
        for (let i = 0; i < city.length; i++) {
          existsLatLng = JSON.parse(city[i].latitude)
          existLat = []
          existLng = []
          for (let j = 0; j < existsLatLng.length; j++) {
            existLat.push(existsLatLng[j].lat)
            existLng.push(existsLatLng[j].lng)
            coords = existLat.length
          } 
          if (printpolygon(coords, existLat, existLng, latitude, longitude)) { 
            
            (document.getElementById("destination-input") as HTMLInputElement).removeAttribute("disabled");
            matchedPlacedata = city[i]

            for(let i=0; i<vehiclePriceList.length; i++){ 
              if(matchedPlacedata._id == vehiclePriceList[i].CityName){
                matchedPlaceVehicle.push(vehiclePriceList[i])
                
              }
            } 
          }
        }
      }
    
      this.calculateAndDisplayRoute(this.directionsService, this.directionsRenderer)
    });
  }

  calculateAndDisplayRoute(
    directionsService: google.maps.DirectionsService,
    directionsRenderer: google.maps.DirectionsRenderer
  ) {

    let waypts: google.maps.DirectionsWaypoint[] = [];
    
    waypts=[{
        location:(document.getElementById("addedInput")as HTMLInputElement).value,
        stopover: true,
    }]
    
    if((document.getElementById("addedInput") as HTMLInputElement). value == ''){
      directionsService
      .route({
        origin: (document.getElementById("origin-input") as HTMLInputElement).value,
        destination: (document.getElementById("destination-input") as HTMLInputElement).value,
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
        console.log((response.routes[0].legs[0].duration?.text));
        console.log((response.routes[0].legs[0].distance?.text));
        distance = (response.routes[0].legs[0].distance?.text);
        time = (response.routes[0].legs[0].duration?.text);

            distanceArray = distance.split(" ");
            finalDistance = parseInt(distanceArray[0]);

            timeArray = time.split(" ");
            finalTime = (60 * parseInt(timeArray[0]) + parseInt(timeArray[2]));
           
            (document.getElementById("distance") as HTMLInputElement).innerText = distance ;
            (document.getElementById("time") as HTMLInputElement).innerText = time;
            for(let i=0; i<matchedPlaceVehicle.length; i++){
              
              priceForVehicle = 
               (
                  (matchedPlaceVehicle[i].BasePrice) + 
                  (matchedPlaceVehicle[i].PpUD * (finalDistance - matchedPlaceVehicle[i].DistancePrice)) +
                  (matchedPlaceVehicle[i].PpUT * finalTime)
               )
               matchedPlaceVehicle[i].finalCost = priceForVehicle;
               priceForVehicleArray.push(priceForVehicle)
            }  
        console.log(response);
      })
      .catch((e) => console.log("Directions request failed due to"+e));
    }
    else{
      directionsService
      .route({
        origin: (document.getElementById("origin-input") as HTMLInputElement).value,
        destination: (document.getElementById("destination-input") as HTMLInputElement).value,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
        distanceStart = (response.routes[0].legs[0].distance?.text);
        distanceEnd = (response.routes[0].legs[1].distance?.text)
        timeStart = (response.routes[0].legs[0].duration?.text); 
        timeEnd = (response.routes[0].legs[1].duration?.text);
       
        distanceStartArray = distanceStart.split(" ");
        distanceEndArray = distanceEnd.split(" ");
        timeStartArray = timeStart.split(" ");
        TimeEndArray = timeEnd.split(" ");

        timeDisplayHour = (parseInt(timeStartArray[0]) + parseInt(TimeEndArray[0]));
        timeDisplayMin = (parseInt(timeStartArray[2]) + parseInt(TimeEndArray[2]))

        if(timeDisplayMin > 60){
          timeDisplayMin = timeDisplayMin - 60
          timeDisplayHour = timeDisplayHour + 1
        }
        
        finalDistanceMid = (parseInt(distanceStartArray[0]) + (parseInt(distanceEndArray[0])));
        finalTimeMid = 
            ((60 * parseInt(timeStartArray[0]) + parseInt(timeStartArray[2])) +
            (60 * parseInt(TimeEndArray[0]) + parseInt(TimeEndArray[2])));

        (document.getElementById("time") as HTMLInputElement).innerText = timeDisplayHour + " hr " +  timeDisplayMin + " min";
        (document.getElementById("distance") as HTMLInputElement).innerText = finalTimeMid + " km";
        for(let i=0; i<matchedPlaceVehicle.length; i++){    
          priceForVehicle = 
           (
              (matchedPlaceVehicle[i].BasePrice) + 
              (matchedPlaceVehicle[i].PpUD * (finalDistanceMid - matchedPlaceVehicle[i].DistancePrice)) +
              (matchedPlaceVehicle[i].PpUT * finalTimeMid)
           )
           matchedPlaceVehicle[i].finalCost = priceForVehicle;
           priceForVehicleArray.push(priceForVehicle)
           console.log(matchedPlaceVehicle);
        }  
      })
      .catch((e) => console.log("Directions request failed due to"+e));
    }
  }   

  setupPlaceChangedListener(
    autocomplete: google.maps.places.Autocomplete,
    mode: string
  ) {
    autocomplete.bindTo("bounds", this.map);
    
    autocomplete.addListener("place_changed", () => {
     
      /*use for get latitude and longitude  */
      var place = autocomplete.getPlace();
  
      latitude = place.geometry?.location?.lat()
      longitude = place.geometry?.location?.lng()
     
      var lng = place.formatted_address

      if (!place.place_id) {
        window.alert("Please select an option from the dropdown list.");
        return;
      }

      if (mode === "ORIG") {
        this.originPlaceId = place.place_id;
      } else {
        this.destinationPlaceId = place.place_id;
      }
      // this.route();
      this.calculateAndDisplayRoute(this.directionsService,this.directionsRenderer)
    });
  }
 
}


@Component({
  selector: 'app-ride-create',
  templateUrl: './ride-create.component.html',
  styleUrls: ['./ride-create.component.css']
})

export class RideCreateComponent implements OnInit {
  countryList: any = []
  userList: any = []
  cityList: any = []
  matchedVehicleaccess:any =[]
  error:boolean= false
  priceForVehicleAccess:any = []
  userName: any
  email:any
  
  constructor(private countryService: CountryServiceService, private userService: UserServiceService, private citySerive: CityServiceService, private toastr: ToastrService, private vehiclePriceService: VehiclePriceServiceService, private rideCreateService:RideCreateServiceService) {
    this.countryService.countryDisplay().subscribe(data => {
      this.countryList = data
    })

    this.userService.getUsers().subscribe(data => {
      this.userList = data
    })

    this.citySerive.getCity().subscribe(data => {
      this.cityList = data
    })

    this.vehiclePriceService.getPrice().subscribe(data => {
      vehiclePriceList = data
    })
   
  }

  ngOnInit(): void {
    this.citySerive.getCity().subscribe(data => {
      city = data
    })
  }

  getData(){
    matchedPlaceVehicle = []
    setTimeout(() => {
      this.error = false;
      this.matchedVehicleaccess = matchedPlaceVehicle
      if(matchedPlaceVehicle.length === 0){
        this.error = true   
      }
    },200)
  }

  getPrice(){
    setTimeout(() => {
      this.matchedVehicleaccess = matchedPlaceVehicle
      // if(this.matchedVehicleaccess == ''){
      //   this.error = "true"
      // } 
      this.priceForVehicleAccess = priceForVehicleArray;
    }, 1000)
    console.log(this.matchedVehicleaccess);
    
  }

  add(){
    (document.getElementById("add") as HTMLElement).removeAttribute("hidden");
  }

  remove(){
    const add = (document.getElementById('add') as HTMLElement);
    add.style.display = "none"
    // (document.getElementById("add") as HTMLElement).setAttribute("hidden","true");
  }

  rideForm = new FormGroup({
    countryId: new FormControl('', [Validators.required]),
    PhoneNumber: new FormControl('', [Validators.required]),
    UserName: new FormControl('', [Validators.required]),
    Email: new FormControl('', [Validators.required]),
    PickUpLocation: new FormControl(''),
    DropOffLocation: new FormControl({value: '', disabled: true}),
    Date: new FormControl(''),
    ServiceType: new FormControl(''),
    Cash: new FormControl(''),
    finalCost: new FormControl('')

  })

  isNumber(evt: any) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  checkPhone(data: any) {
    for (let i = 0; i < this.userList.length; i++) {
      if (data.PhoneNumber == this.userList[i].PhoneNumber) {
        this.userName = this.userList[i].UserName;
        this.email = this.userList[i].Email
        userId = this.userList[i]._id

        const uluru = { lat: 20.5937, lng: 78.9629 }
        const initMap = (): void => {
          map = new google.maps.Map(
            document.getElementById("map") as HTMLElement,
            {
              center: { lat: 20.5937, lng: 78.9629 },
              zoom: 4,
            }
          );
    
          const marker = new google.maps.Marker({
            position: uluru,
            map: map,
            draggable: true,
          });
          new AutocompleteDirectionsHandler(map);
        }
        setTimeout(() => {
          initMap()
        }, 10)
      }
    }
  }

  onSubmit() {
    const pickUp = (document.getElementById("origin-input") as HTMLInputElement).value;
    const veh = $('input[name="ServiceType"]:checked').val()
    let fc
    for(let i=0; i<matchedPlaceVehicle.length; i++){
      if(matchedPlaceVehicle[i]._id == veh){
        fc =  matchedPlaceVehicle[i].finalCost
        formData['finalCost'] = fc
      } 
    }

    let newDate = new Date()
    
    // formData['VehicleId'] = 
    formData['creationdate'] = newDate
    formData['UserDetail'] = userId;
    formData['Cash'] = $('input[name="Cash"]:checked').val()
    formData['PickUpLocation'] = pickUp
    formData['DropOffLocation'] = (document.getElementById("destination-input") as HTMLInputElement).value
    formData['MidPoint'] = (document.getElementById("addedInput") as HTMLInputElement).value
    formData['Date'] = (document.getElementById("date") as HTMLInputElement).value
    formData['VehiclePriceDetail'] = $('input[name="ServiceType"]:checked').val()
    formData['Time'] =  (document.getElementById("time") as HTMLInputElement).innerText
    formData['Distance'] =  (document.getElementById("distance") as HTMLInputElement).innerText
    
    this.rideCreateService.addRide(formData).subscribe(res => {
      this.toastr.success("ride booked successfully!!")
      console.log(res);
    })
    window.location.reload()
  }
}
