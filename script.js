let data;
const search = document.getElementById("search");
const input_field = document.getElementById("input_field");
const loc = document.getElementById("location");

let current, forecast, loc_details;
async function getData(name) {
    const promise = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=6abb1df4873d4f95a1d174402251212&q=${name}&days=2&aqi=yes&alerts=no`);
    data = await promise.json();
    if (data.error) throw new Error(data.error.message);
    current = data.current;
    forecast = data.forecast;
    loc_details = data.location;
}
async function getData(lat,long) {
    const promise = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=6abb1df4873d4f95a1d174402251212&q=${lat},${long}&days=2&aqi=yes&alerts=no`);
    data = await promise.json();
    if (data.error) throw new Error(data.error.message);
    current = data.current;
    forecast = data.forecast;
    loc_details = data.location;
}
function setLocation() {
    loc.innerHTML = loc_details.name + ", " + loc_details.country;
}
function setBasics() {
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date = document.querySelector(".date");
    const temperature = document.querySelector(".temperature");

    let temp = new Date(forecast.forecastday[0].date);
    date.children[0].innerHTML = days[temp.getDay()];
    date.children[1].innerHTML = temp.getDate() + " " + months[temp.getMonth()] + " " + temp.getFullYear();

    temperature.children[0].innerHTML = current.temp_c + "&deg;C";
    temperature.children[1].innerHTML = `High: ${forecast.forecastday[0].day.maxtemp_c} Low: ${forecast.forecastday[0].day.mintemp_c}`;

    let weather_image = document.getElementById("weather-image");
    weather_image.src = current.condition.icon;
    let weather_details = document.querySelector(".weather-details")
    weather_details.children[0].innerHTML = current.condition.text;
    weather_details.children[1].innerHTML = "Feels Like " + (current.feelslike_c);
}
function setOtherDetails() {
    let astro = document.querySelector(".astro");

    astro.children[0].children[1].innerHTML = forecast.forecastday[0].astro.sunrise.substring(0, forecast.forecastday[0].astro.sunrise.indexOf(" "));
    astro.children[1].children[1].innerHTML = forecast.forecastday[0].astro.sunset.substring(0, forecast.forecastday[0].astro.sunset.indexOf(" "));
    astro.children[0].children[2].innerHTML = forecast.forecastday[0].astro.sunrise.substring(forecast.forecastday[0].astro.sunrise.indexOf(" ") + 1, forecast.forecastday[0].astro.sunrise.length);
    astro.children[1].children[2].innerHTML = forecast.forecastday[0].astro.sunset.substring(forecast.forecastday[0].astro.sunset.indexOf(" ") + 1, forecast.forecastday[0].astro.sunset.length);

    let tomorrow_details = document.querySelector(".forecast-details2")
    tomorrow_details.children[0].children[0].children[1].innerHTML = forecast.forecastday[1].day.condition.text;
    tomorrow_details.children[0].children[1].innerHTML = forecast.forecastday[1].day.avgtemp_c + "&deg;";
    tomorrow_details.children[1].src = forecast.forecastday[1].day.condition.icon;
}

function setHighlights() {
    let highlights = document.querySelector(".todays-highlights");
    highlights.children[0].children[1].innerHTML = forecast.forecastday[0].day.daily_chance_of_rain + "%";
    highlights.children[1].children[1].innerHTML = forecast.forecastday[0].day.uv;
    highlights.children[2].children[1].innerHTML = forecast.forecastday[0].day.avghumidity + "%";
    highlights.children[3].children[1].innerHTML = forecast.forecastday[0].day.avgvis_km + "km";
}
function setTips() {
    let tips = document.querySelector(".tips");
    let container = tips.children[1];
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    let temp_var;
    //Do Temp Test
    temp_var = forecast.forecastday[0].day.avgtemp_c;
    if (temp_var >= 45) {
        container.appendChild(createP("-> Heatwave alert. Stay indoors, hydrate frequently, avoid sun exposure.", "red"));
    }
    else if (temp_var >= 38 && temp_var < 45) {
        container.appendChild(createP("-> Very hot day. Drink water and avoid outdoor activity (12–4 PM).", "orange"));
    }
    else if (temp_var >= 30 && temp_var < 38) {
        container.appendChild(createP("-> Warm weather. Stay hydrated.", "yellow"));
    }
    else if (temp_var > 4 && temp_var <= 13) {
        container.appendChild(createP("-> Cold conditions. Wear warm clothes.", "yellow"));
    }
    else if (temp_var <= 4) {
        container.appendChild(createP("-> Extreme cold. Risk of hypothermia, limit outdoor exposure.", "red"));
    }
    else {
        container.appendChild(createP("-> Nice Temperature Enjoy the Day &#128526;", "green"));
    }

    //Do Visibility Check
    temp_var = forecast.forecastday[0].day.avgvis_km;
    if (temp_var < 0.5) {
        container.appendChild(createP("-> Dense fog. &#128533; Avoid driving if possible.", "red"));
    }
    else if (temp_var >= 0.5 && temp_var <= 1) {
        container.appendChild(createP("-> Low visibility. Use fog lights.", "orange"));
    }
    else if (temp_var > 1 && temp_var <= 3) {
        container.appendChild(createP("-> Slight fog. Drive carefully.", "yellow"));
    }
    else { }

    //Do Humidity and Heat Stress Check
    temp_var = forecast.forecastday[0].day.avghumidity;
    if (temp_var >= 85 && forecast.forecastday[0].day.avgtemp_c >= 32) {
        container.appendChild(createP("-> High heat stress risk.&#128543; Stay cool & hydrated.", "red"));
    }
    else if (temp_var >= 70) {
        container.appendChild(createP("-> Humid weather. May feel uncomfortable.", "yellow"));
    }
    else {
        container.appendChild(createP("-> No Fear of Heat Strokes Today &#128525;", "green"));
    }

    //Do UV-Index Check
    temp_var = forecast.forecastday[0].day.uv;
    if (temp_var >= 11) {
        container.appendChild(createP("-> Extreme UV.&#128565; Avoid sun exposure completely.", "red"));
    }
    else if (temp_var >= 8 && temp_var < 11) {
        container.appendChild(createP("-> Use sunscreen, sunglasses & avoid noon sun.", "orange"));
    }
    else if (temp_var >= 6 && temp_var < 8) {
        container.appendChild(createP("-> Apply SPF 30+, wear protective clothing.", "orange"));
    }
    else if (temp_var >= 3 && temp_var < 6) {
        container.appendChild(createP("-> Sun protection recommended.", "yellow"));
    }
    else {
        container.appendChild(createP("-> Minimal UV Risks You are Good to go &#128077;", "green"));
    }

    //Do Rain Checks
    temp_var = current.precip_mm;
    if (temp_var >= 50) {
        container.appendChild(createP("-> Very heavy rain. Avoid travel in flooded areas.", "red"));
    }
    else if (temp_var >= 20 && temp_var < 50) {
        container.appendChild(createP("-> Heavy rainfall. Drive carefully and carry rain protection.", "orange"));
    }
    else if (temp_var >= 5 && temp_var < 20) {
        container.appendChild(createP("-> Light to moderate rain. Roads may be slippery.", "yellow"));
    }
    else if (current.condition.text.toLowerCase().includes("thunder")) {
        container.appendChild(createP("-> Thunderstorm alert. Stay indoors and unplug devices.", "orange"));
    }
    else {

    }

    //Do Wind Check
    temp_var = current.wind_kph;
    if (temp_var >= 75) {
        container.appendChild(createP("-> Cyclone-level winds. &#128552; Stay indoors, secure property.", "red"));
    }
    else if (temp_var >= 40 && temp_var < 75) {
        container.appendChild(createP("-> Strong winds. Avoid two-wheelers and loose objects.", "orange"));
    }
    else if (temp_var >= 20 && temp_var < 40) {
        container.appendChild(createP("-> Breezy conditions. Outdoor caution advised. &#128527;", "yellow"));
    }
    else { }

    //Do AQI Check

    temp_var=current.air_quality["us-epa-index"];

    let aqiStatus, aqiMessage, badgeColor;

    switch (temp_var) {
        case 1:
            aqiStatus = "Good";
            aqiMessage = "Air quality is safe for everyone.";
            badgeColor = "green";
            break;
        case 2:
            aqiStatus = "Moderate";
            aqiMessage = "Sensitive individuals should reduce prolonged outdoor exertion.";
            badgeColor = "yellow";
            break;
        case 3:
            aqiStatus = "Unhealthy for Sensitive Groups";
            aqiMessage = "Children, elderly, and asthmatics should limit outdoor activity.&#128552;";
            badgeColor = "rgba(255, 100, 0, 1)";
            break;
        case 4:
            aqiStatus = "Unhealthy";
            aqiMessage = "Avoid outdoor activities. Wear a mask if needed.&#128555;";
            badgeColor = "rgba(255, 55, 0, 1)";
            break;
        case 5:
            aqiStatus = "Very Unhealthy";
            aqiMessage = "Health alert. Stay indoors.&#128560;";
            badgeColor = "orange";
            break;
        case 6:
            aqiStatus = "Hazardous";
            aqiMessage = "Emergency conditions. Avoid all outdoor exposure.&#128557;";
            badgeColor = "red";
            break;
    }
    container.appendChild(createP(`-> ${aqiMessage}`, badgeColor));
}
function createP(content, color) {
    let p = document.createElement('p');
    p.style.color = color;
    p.innerHTML = content;
    return p;
}
search.addEventListener("click", async () => {
    try {
        await getData(input_field.value);

        setLocation();
        setBasics();
        setHighlights();
        setOtherDetails();
        setTips();
    }
    catch (err) {
        alert(err.message);
    }
})
async function getLocation(position)
{
    console.log(position);
    try {
        await getData(position.coords.latitude,position.coords.longitude);

        setLocation();
        setBasics();
        setHighlights();
        setOtherDetails();
        setTips();
    }
    catch (err) {
        alert(err.message);
    }
}
async function failedToGetLocation()
{
    alert("Please give Location permission to Find your current weather")
    alert("Loading Data to London...");
    try {
        await getData("London");

        setLocation();
        setBasics();
        setHighlights();
        setOtherDetails();
        setTips();
    }
    catch (err) {
        alert(err.message);
    }
} 
document.addEventListener("DOMContentLoaded",()=>{
    navigator.geolocation.getCurrentPosition(getLocation,failedToGetLocation)
})