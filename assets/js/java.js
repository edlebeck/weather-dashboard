var placeholder = document.getElementById("cityInput")
var submitBtn = document.getElementById("cityBtn")
var cityName = document.getElementById("cityName")
var currentTemp = document.getElementById("temp")
var currentWeather = document.getElementById("weatherIcon")
var currentWind = document.getElementById("wind")
var currentHumidity = document.getElementById("humidity")
var currentUV = document.getElementById("uvi")
var city = "MILWAUKEE"
var lat = ""
var lon = ""
var prevSearch = []
var geocodeURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=dac42aacf1187949ffc701f7f8725fad"
var weatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=dac42aacf1187949ffc701f7f8725fad&units=imperial"
var date = []
for (i=0; i<6; i++) {
    var newDay = new Date();
    newDay.setDate(newDay.getDate() + i)
    newDay = newDay.toLocaleDateString();
    date[i] = newDay
}

function cityInfo (cityInput) {

    cityName.innerText = cityInput + "  (" + date[0] + ")";
    var geocodeURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityInput + "&appid=dac42aacf1187949ffc701f7f8725fad"
    fetch(geocodeURL)
    .then(function(response) {
        if (response.ok) {
            return response.json()
        } else {
            alert("Something went wrong\nPlease try again")
        }
    })
    .then(function(data) {
        if (data.length > 0){
            lat = data[0].lat
            lon = data[0].lon
            weatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=dac42aacf1187949ffc701f7f8725fad&units=imperial"
            weather()
        } else {
            prevSearch.pop()
            localStorage.setItem("prevSearch", JSON.stringify(prevSearch));
            var parentDiv = document.getElementById("parent"+prevSearch.length)
            var removeBtn = document.getElementById("prev"+prevSearch.length)
            var searchDiv = document.getElementById("search")
            parentDiv.removeChild(removeBtn)
            searchDiv.removeChild(parentDiv)
            placeholder.value = ''
            placeholder.setAttribute("placeholder", "Enter City")
            alert("Something went wrong\nCheck city spelling")
        }
    })
}

function weather () {
    fetch(weatherURL)
    .then(function(response) {
        // console.log(response.json())
        return response.json()
    })
    .then(function(data){
        currentWeather.setAttribute("src", ("https://openweathermap.org/img/wn/" + data.current.weather[0].icon +"@2x.png"))
        currentTemp.innerText = "Temp:  " + data.current.temp + "\u00B0F"
        currentWind.innerText = "Wind:  " + data.current.wind_speed + " MPH"
        currentHumidity.innerText = "Humidity:  " + data.current.humidity + "%"
        placeholder.value = ''
        placeholder.setAttribute("placeholder", "Enter City")
        if (data.current.uvi <= 2) {
            currentUV.setAttribute("class","btn btn-success")
            currentUV.innerText = data.current.uvi
        } else if (data.current.uvi >= 8) {
            currentUV.setAttribute("class","btn btn-danger")
            currentUV.innerText = data.current.uvi
        } else if (data.current.uvi > 2 && data.current.uvi < 8) {
            currentUV.setAttribute("class","btn btn-warning")
            currentUV.innerText = data.current.uvi
        }
        for (i=1; i<6; i++){
            var days = document.getElementById("date"+i)
            days.innerText = date[i]
            var icon = document.getElementById("weatherIcon"+i)
            icon.setAttribute("src", ("https://openweathermap.org/img/wn/" + data.daily[i-1].weather[0].icon +"@2x.png"))
            var dayTemp = document.getElementById("temp" + i)
            dayTemp.innerText = "Temp:  " + data.daily[i-1].temp.max + "\u00B0F"
            var wind = document.getElementById("wind"+i)
            wind.innerText = "Wind:  " + data.daily[i-1].wind_speed + " MPH"
            var humid = document.getElementById("humidity"+i)
            humid.innerText = "Humidity:  " + data.daily[i-1].humidity + "%"
        }
    })
}

function getInput () {

    city = document.getElementById("cityInput").value;
    city = city.toUpperCase()
    if (city != "") {
        if (prevSearch.indexOf(city) === -1) {
            prevSearch.push(city)
            var previous = document.createElement("div")
            previous.classList.add("d-flex", "justify-content-center")
            previous.id = "parent" + (prevSearch.length-1)
            var prevBtn = document.createElement("button")
            prevBtn.classList.add("btn", "btn-secondary", "m-1", "w-50")
            prevBtn.innerText = prevSearch[prevSearch.length-1]
            prevBtn.id = "prev" + (prevSearch.length-1)
            prevBtn.addEventListener("click", function(){cityInfo(prevBtn.innerText)})
            previous.appendChild(prevBtn)
            var searchCol = document.getElementById("search")
            searchCol.appendChild(previous)
            localStorage.setItem("prevSearch", JSON.stringify(prevSearch));
            cityInfo(city)
        } 
    }
}

function previousSearch() {
    prevSearch = JSON.parse(localStorage.getItem("prevSearch"))
    if (prevSearch === null) {
        prevSearch = ["MILWAUKEE"]
    }
    prevSearch.forEach(function (result){
        var previous = document.createElement("div")
        previous.classList.add("d-flex", "justify-content-center")
        var prevBtn = document.createElement("button")
        prevBtn.classList.add("btn", "btn-secondary", "m-1", "w-50")
        prevBtn.innerText = result
        prevBtn.addEventListener("click", function(){cityInfo(result)})
        previous.appendChild(prevBtn)
        var searchCol = document.getElementById("search")
        searchCol.appendChild(previous)
    });
}

function removePlaceholder () {
    placeholder.removeAttribute("placeholder")
}
function addPlaceholder () {
    placeholder.setAttribute("placeholder", "Enter City")
}


cityInfo(city)
previousSearch()
submitBtn.addEventListener("click", getInput)
placeholder.addEventListener("focus", removePlaceholder)
placeholder.addEventListener("focusout", addPlaceholder)