// VARIABLES

let resultContainer = document.getElementById("result");
let plan = document.getElementById("planner");
let printTrip = document.getElementById("save");
let deleteData = document.getElementById("delete");
let tripForm = document.getElementById("form");
let addTripButton = document.querySelector(".map__link");
let departure = document.querySelector('input[name="from"]');
let destination = document.querySelector('input[name="to"]');
let depDate = document.querySelector('input[name="date"]');
let geoNameURL = 'http://api.geonames.org/searchJSON?q=';
let username = "sumit07sinha";
let currentTimeElapse = (Date.now()) / 1000;
let darkAPIURL = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/";
let darkAPIkey = "841a9888f38f0d5458c1f32b892d2d1b";
let pixabayAPIURL = "https://pixabay.com/api/?key=";
let pixabayAPIkey = "13947861-82731bd440ece605a78d76de8";


// add trip button
const smoothScrolling = addTripButton.addEventListener('click', function (e) {
  e.preventDefault();
  plan.scrollIntoView({ behavior: 'smooth' });
})

// print button
printTrip.addEventListener('click', function (e) {
  window.print();
  location.reload();
});
// delete button
deleteData.addEventListener('click', function (e) {
  tripForm.reset();
  resultContainer.classList.add("invisible");
  location.reload();
})

// FUNCTIONS 

// Function called when tripForm is submitted
export const addTrip = (e) => {
  e.preventDefault();
  //Acquiring and storing user trip data
  const departureCity = departure.value;
  const destinationCity = destination.value;
  const depDateValue = depDate.value;
  const timeElapse = (new Date(depDateValue).getTime()) / 1000;

  // function checkInput to validate input 
  Client.checkInput(departureCity, destinationCity);

  getCityInfo(geoNameURL, destinationCity, username)
    .then((cityInf) => {
      const cityLat = cityInf.geonames[0].lat;
      const cityLong = cityInf.geonames[0].lng;
      const country = cityInf.geonames[0].countryName;
      const weatherData = getWeather(cityLat, cityLong, country, timeElapse)
      return weatherData;
    })
    .then((weatherData) => {
      const daysLeft = Math.round((timeElapse - currentTimeElapse) / 86400);
      const userData = postData('http://localhost:5000/add', { departureCity, destinationCity, depDateValue, weather: weatherData.currently.temperature, summary: weatherData.currently.summary, daysLeft });
      return userData;
    }).then((userData) => {
      updateUI(userData);
    })
}
// tripForm submit
tripForm.addEventListener('submit', addTrip);
//function getCityInfo to get city information from Geonames (latitude, longitude, country)

export const getCityInfo = async (geoNameURL, destinationCity, username) => {
  // res equals to the resultContainer of fetch function
  const res = await fetch(geoNameURL + destinationCity + "&maxRows=10&" + "username=" + username);
  try {
    const cityInf = await res.json();
    return cityInf;
  } catch (error) {
    console.log("error", error);
  }
};

// function getWeather to get weather information from Dark Sky API 

export const getWeather = async (cityLat, cityLong, country, timeElapse) => {
  const req = await fetch(darkAPIURL + "/" + darkAPIkey + "/" + cityLat + "," + cityLong + "," + timeElapse + "?exclude=minutely,hourly,daily,flags");
  try {
    const weatherData = await req.json();
    return weatherData;
  } catch (error) {
    console.log("error", error);
  }
}

// Function postData to POST data to our local server
export const postData = async (url, data = {}) => {
  const req = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    },
    body: JSON.stringify({
      depCity: data.departureCity,
      arrCity: data.destinationCity,
      depDate: data.depDateValue,
      weather: data.weather,
      summary: data.summary,
      daysLeft: data.daysLeft
    })
  })
  try {
    const userData = await req.json();
    return userData;
  } catch (error) {
    console.log("error", error);
  }
}

// Function update UI that reveals the results page with updated trip information including fetched image of the destination

export const updateUI = async (userData) => {
  resultContainer.classList.remove("invisible");
  resultContainer.scrollIntoView({ behavior: "smooth" });

  const res = await fetch(pixabayAPIURL + pixabayAPIkey + "&q=" + userData.arrCity + "+city&image_type=photo");

  try {
    const imageLink = await res.json();
    const dep_Date = userData.depDate.split("-").reverse().join(" / ");
    document.getElementById("city").innerHTML = userData.arrCity;
    document.getElementById("date").innerHTML = dep_Date;
    document.getElementById("days").innerHTML = userData.daysLeft;
    document.getElementById("summary").innerHTML = userData.summary;
    document.getElementById("temp").innerHTML = userData.weather;
    document.getElementById("fromPixabay").setAttribute('src', imageLink.hits[0].webformatURL);
  }
  catch (error) {
    console.log("error", error);
  }
}

export { smoothScrolling }