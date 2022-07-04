const fetch = require("node-fetch")
var country;

  fetch("https://restcountries.com/v2/all")
  .then(res => res.json())
  .then(data => fetchCountries(data))
  .catch(error => "Error: ", error)
  
  function fetchCountries(countriesData){
    country = countriesData;
    let options = ""
    for(let i = 0; i< country.length-1; i++){
        options += `<option value = "${country[i].name}">${country[i].name}</option>`
    }

    // country.forEach(countries => options += `<option value="${countries.name}">${countries.name}</option>`);
    
    document.getElementById("country").innerHTML = options;
  }
  