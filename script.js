var key = "1d5c835475ae3fad01ab4ae55f24d53a";

var cities = [];

//function that gets and loads data from api
function loadWeather(city) {
  var locData =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    key;
  //searches for the city by name in the database to receive coords needed to access all data
  $.ajax({ url: locData, method: "GET" }).then(function (response) {
    // console.log("Location", response);
    var long = response.coord.lon;
    var lat = response.coord.lat;
    var apiRef =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      long +
      "&exclude=minutely,hourly,alerts&units=imperial&appid=" +
      key;
    // openweather onecall api needs long/lat coordinates to access current and future data, so its nested inside the outer then function
    $.ajax({ url: apiRef, method: "GET" }).then(function (response) {
      var date = new Date(Number.parseInt(response.current.dt) * 1000); //converts unix time standard to traditional date/time
      var name =
        city +
        " (" +
        (date.getMonth() + 1) +
        "/" +
        date.getDate() +
        "/" +
        date.getFullYear() +
        ")";

      //gets all the data we need from the api object
      var currTemp = response.current.temp; //f
      var wind = response.current.wind_speed; //mph
      var currHumidity = response.current.humidity; //%
      var uv = response.current.uvi;
      //changes the page text to the current data
      $("#currCity").text(name);
      $("#currTemp").text(
        "Temperature: " + currTemp + " " + String.fromCharCode(176) + "F"
      );
      $("#currHumidity").text("Humidity: " + currHumidity + "%");
      $("#currWind").text("Wind Speed: " + wind + " MPH");
      $("#currUV").text(uv);
      uv = Number.parseInt(uv);
      //changes color scheme of uv data depending on number
      //colors based on: https://www.curemelanoma.org/about-melanoma/prevention/uv-index/#:~:text=The%20UV%20Index%20provides%20a,means%20a%20very%20high%20risk.
      if (uv < 3) {
        $("#currUV").attr("class", "btn btn-success");
      } else if (uv < 6) {
        $("#currUV").attr("class", "btn btn-warning");
      } else {
        $("#currUV").attr("class", "btn btn-danger");
      }

      //gets icon link from data
      var currIcon =
        "http://openweathermap.org/img/wn/" +
        response.current.weather[0].icon +
        "@2x.png";
      $("#currIcon").attr("src", currIcon);

      //updates 5-Day forecast with daily weather
      for (i = 1; i < 6; i++) {
        var day = response.daily[i];
        var date = new Date(Number.parseInt(day.dt) * 1000);
        var name =
          "" +
          (date.getMonth() + 1) +
          "/" +
          date.getDate() +
          "/" +
          date.getFullYear();

        $("#foreDate" + i).text(name);
        var currIcon =
          "http://openweathermap.org/img/wn/" + day.weather[0].icon + "@2x.png";
        $("#foreIcon" + i).attr("src", currIcon);
        $("#foreTemp" + i).text(
          "Temp: " + day.temp.max + " " + String.fromCharCode(176) + "F"
        );
        $("#foreHumid" + i).text("Humidity: " + day.humidity + "%");
      }
    });
  });
}

// onClick callback function, assigned to each button on creation
function navigate() {
  var target = $(this);
  localStorage.setItem("last-city", target.text());
  //Moves the clicked button to the top of the list
  var navBtn = target.remove();
  navBtn.click(navigate);
  $(".prevSearch").prepend(navBtn);
  loadWeather(target.text());
}

// Sets up page on load with last displayed city information, Denver by default
function init() {
  var city = localStorage.getItem("last-city");
  if (city == null) {
    city = "Denver";
  }
  loadWeather(city);
  //Adds current city to searched list for convience
  var cityRecord = $("<button>").text(city);
  cityRecord.addClass("btn-light border p-3 record");
  $(".prevSearch").prepend(cityRecord);
  //assigns an event listener to the button
  cityRecord.click(navigate);
  cities.push(city);
}

init();

//Processes user search requests
$(".searchBtn").click(function (event) {
  event.preventDefault();

  var city = $("#cityInput").val();
  //Standardizes the name to traditional capitalization
  city = city.substr(0, 1).toUpperCase() + city.slice(1).toLowerCase();
  //clears the search box
  $("#cityInput").val("");
  //checks to make sure a city was typed and the city isn't already in the history
  if (city == "" || cities.includes(city)) {
    return;
  }
  cities.push(city);
  localStorage.setItem("last-city", city);
  var cityRecord = $("<button>").text(city);
  cityRecord.addClass("btn-light border p-3 record");
  $(".prevSearch").prepend(cityRecord);

  loadWeather(city);
  cityRecord.click(navigate);
});
