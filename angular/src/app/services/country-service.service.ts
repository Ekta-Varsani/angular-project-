import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CountryServiceService {
  
  constructor(private http: HttpClient) {
  }

  //get all countries
  url = "https://restcountries.com/v2"
  getCountry(){
    return this.http.get(this.url + '/all')
  }

  //get data of country
  getdata(value:any){
    return this.http.get(`${this.url}/name/${value}?fullText=true`)
  }

  //add
  urlApi = "http://192.168.0.105:4000/api/countery/create"
  addCountry(data:any){
    return this.http.post(this.urlApi, data)
  }

  //display--get
  getcountryUrl = "http://192.168.0.105:4000/api/countery"
  countryDisplay(){
    return this.http.get(this.getcountryUrl)
  }

  //update--put
  updateCountry(url:any, body:any){
   const updateUrl = "http://192.168.0.105:4000/api/countery/update"
   return this.http.put(updateUrl + `/${body._id}`,body)
  }

  editUrl = "http://192.168.0.105:4000/api/countery/get/"
  edit(url:any){
    return this.http.get(this.editUrl+url)
  }

}
