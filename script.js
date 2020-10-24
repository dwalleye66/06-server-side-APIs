// Recent City
populateList();
// run last city searched
if (localStorage.getItem("cities") !== null) {
    lastCityStored();
    citySearch();
};
// Set date
$(document).ready(function() {
    $("#currentDate").text(`(${moment().format("l")})`);
    for (i = 1; i < 6; i++) {
        var forecastDate = $(`#currentDatePlus${i}`);
        forecastDate.text(moment().add(`${i}`, "d").format("l"));
    };
});
function citySearch() {
    citySearchInput = $("#citySearchInput").val().trim();
    citySearchInput = citySearchInput.split(" ").join("+");
    displayWeather();
};
$("#citySearchBtn").click(function() {            
    event.preventDefault();
    citySearchInput = $("#citySearchInput").val()
    if (citySearchInput == "") {
        return false;
    }
    citySearch();
});
$('#citySearchInput').keypress(function (event) {           
    if (event.which == 13) {
        event.preventDefault();
        $(this).blur();
        citySearch();
    };
});
$("body").delegate(".searchHistoryBtn", "click", function() {            
    event.preventDefault();
    $("#citySearchInput").val($(this).text());
    citySearch();
});

function displayWeather() {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + citySearchInput + "&appid=34f17f8075202ef3820d231379d0f911&units=imperial";
    $.ajax ({              
        url: queryURL,
        method: "GET" //GET Forecast
        }).then(function(response) {
            var weatherIcon = response.weather[0].icon;
            var weatherURL = "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
            $("#cityName").text(response.name);
            $("#currentWeatherIcon").attr("src", weatherURL);
            $("#currentTemp").text(Math.round(response.main.temp) + " °F");
            $("#currentHumidity").text(response.main.humidity + "%");
            $("#currentWindSpeed").text(response.wind.speed + " MPH");
            // GET UV data
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=34f17f8075202ef3820d231379d0f911&lat=" + lat + "&lon=" + lon;
            $.ajax ({              
                url: uvURL,
                method: "GET"
            })
            .then(function(response) {
                
                $("#currentUV").text(response.value);
                
                if (response.value > 8.0) {
                    $("#currentUV").removeClass().addClass("badge badge-danger");
                }
                else if (6.0 <= response.value && response.value < 8.0) {
                    $("#currentUV").removeClass().addClass("badge badge-warning");
                }
                else if (3.0 <= response.value && response.value < 6.0) {
                    $("#currentUV").removeClass().addClass("badge badge-warning");
                }
                else if (response.value < 3.0) {
                    $("#currentUV").removeClass().addClass("badge badge-success");
                };
            })
        //Add search input into local storage and populate           
        addCitySearched();         
        populateList();             
        })
        
    fiveDayForecast();
}; 
// OpenWeatherMap API function to display 5-day forecast
function fiveDayForecast() {
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + citySearchInput + "&cnt==6&units=imperial&appid=4679460f119c185a5abb3222455a221f"                         
    $.ajax({
        url: forecastURL,
        method: "GET"
    })
    .then(function(response) {   
        var response = response.list;
   
        for (i = 0; i < response.length; i++) {
            var weatherURL = "https://openweathermap.org/img/wn/" + (response[i].weather[0].icon).slice(0, -1) + "d@2x.png";
            $(`#iconPlus${i}`).attr("src", weatherURL);
            $(`#tempPlus${i}`).text(Math.round(response[i].main.temp) + " °F");
            $(`#humidityPlus${i}`).text(response[i].main.humidity + "%");
        };
    });
};
// Save searched city into local storage and display in list under search input
function addCitySearched() {
    var citySearched = $("#citySearchInput").val();
    const city = citySearched;
    let cities;
    if (localStorage.getItem("cities") === null) {
        cities = [];
    }   else {
        cities = JSON.parse(localStorage.getItem("cities"));
    }
    if (cities.includes(city) === false) {
        cities.push(city);
    }
    if (cities.length > 6) {
        cities.shift();
    };
    localStorage.setItem("cities", JSON.stringify(cities));
    
};
// Searched cities list
function populateList() {
    var cities = JSON.parse(localStorage.getItem("cities")) || [];
    var cities = cities.reverse();
    $("#citySearchHistory").empty();
    cities.forEach(function(city) {
        $("#citySearchHistory").append(`<button type="button" class="btn btn-outline-secondary searchHistoryBtn">${city}</button>`)
    })
};
// Last City
function lastCityStored(city) {
    var cities = JSON.parse(localStorage.getItem('cities'));
    var city = cities.slice(-1).pop();
    $("#citySearchInput").val(city);
    console.log(city)
}; 