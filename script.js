var city;
var mainCard = $(".card-body");
// contains list
var searchHistory = [];
// returns local storage search history
function getItems() {
    var storedCities = JSON.parse(localStorage.getItem("searchHistory"))};
    if (storedCities !== null) {
        searchHistory = storedCities;
    };
    // lists up to 8
    for (i = 0; i < searchHistory.length; i++) {
        if (i == 8) {
            break;
  