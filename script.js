var key = "1d5c835475ae3fad01ab4ae55f24d53a";

function init() {
  var city = localStorage.getItem("last-city");
  if (city == null) {
    city = "Denver";
  }
  loadWeather(city);
}

init();

function loadWeather(city) {
  var locData =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    key;
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

    $.ajax({ url: apiRef, method: "GET" }).then(function (response) {
      console.log("Weather", response);

      var date = new Date(Number.parseInt(response.current.dt) * 1000);
      var name =
        city +
        " (" +
        (date.getMonth() + 1) +
        "/" +
        date.getDate() +
        "/" +
        date.getFullYear() +
        ")";
      console.log(name);
      var currTemp = response.current.temp; //f
      var wind = response.current.wind_speed; //mph
      var currHumidity = response.current.humidity; //%
      var uv = response.current.uvi;
      $("#currTemp").text(
        "Temperature: " + currTemp + String.fromCharCode(176) + "F"
      );
    });
  });
}
