var key = "1d5c835475ae3fad01ab4ae55f24d53a";

var cities = [];

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

      var currTemp = response.current.temp; //f
      var wind = response.current.wind_speed; //mph
      var currHumidity = response.current.humidity; //%
      var uv = response.current.uvi;
      $("#currCity").text(name);
      $("#currTemp").text(
        "Temperature: " + currTemp + " " + String.fromCharCode(176) + "F"
      );
      $("#currHumidity").text("Humidity: " + currHumidity + "%");
      $("#currWind").text("Wind Speed: " + wind + " MPH");
      $("#currUV").text(uv);
      uv = Number.parseInt(uv);
      if (uv < 3) {
        $("#currUV").attr("class", "btn btn-success");
      } else if (uv < 6) {
        $("#currUV").attr("class", "btn btn-warning");
      } else {
        $("#currUV").attr("class", "btn btn-danger");
      }

      var currIcon =
        "http://openweathermap.org/img/wn/" +
        response.current.weather[0].icon +
        "@2x.png";
      $("#currIcon").attr("src", currIcon);

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

function init() {
  var city = localStorage.getItem("last-city");
  if (city == null) {
    city = "Denver";
  }
  loadWeather(city);
  var cityRecord = $("<button>").text(city);
  cityRecord.addClass("btn-light border p-3 record");
  $(".prevSearch").prepend(cityRecord);
  cityRecord.click(navigate);
  cities.push(city);
}

init();

//<button class="btn-light border p-3">Search</button>; add in prevSearch class

$(".searchBtn").click(function (event) {
  event.preventDefault();

  var city = $("#cityInput").val();
  city = city.substr(0, 1).toUpperCase() + city.slice(1).toLowerCase();
  $("#cityInput").val("");
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

function navigate() {
  var target = $(this);
  localStorage.setItem("last-city", target.text());
  var navBtn = target.remove();
  navBtn.click(navigate);
  $(".prevSearch").prepend(navBtn);
  loadWeather(target.text());
}
