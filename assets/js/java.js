var placeholder = document.getElementById("cityInput")
var city = "Milwaukee"
var lat = "43.0349931"
var lon = "-87.922497"
var geocodeURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=dac42aacf1187949ffc701f7f8725fad"
var weatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=dac42aacf1187949ffc701f7f8725fad&units=imperial"
var date = new Date().toLocaleDateString()



function cityInfo (cityInput) {
    var geocodeURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityInput + "&appid=dac42aacf1187949ffc701f7f8725fad"
    fetch(geocodeURL)
    .then(function(response) {
        return response.json()
    })
    .then(function(data) {
        lat = data[0].lat
        lon = data[0].lon
        weatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=dac42aacf1187949ffc701f7f8725fad&units=imperial"
        weather()
    })
}

function weather () {
    fetch(weatherURL)
    .then(function(response) {
        console.log(response.json())
    })
}

function removePlaceholder () {
    placeholder.removeAttribute("placeholder");
};
function addPlaceholder () {
    placeholder.setAttribute("placeholder", "Enter City")
}
cityInfo(city)
placeholder.addEventListener("focus", removePlaceholder)
placeholder.addEventListener("focusout", addPlaceholder)