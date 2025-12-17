let data;
const search = document.getElementById("search");
const input_field = document.getElementById("input_field");
const loc = document.getElementById("location");

let current, forecast, loc_details;
async function getData() {
    const promise = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=6abb1df4873d4f95a1d174402251212&q=${input_field.value}&days=2&aqi=yes&alerts=no`);
    data = await promise.json();
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

}
function setHighlights() {
    let highlights = document.querySelector(".todays-highlights");
    console.log(highlights)
    highlights.children[0].children[1].innerHTML=forecast.forecastday[0].day.daily_chance_of_rain+"%";
    highlights.children[1].children[1].innerHTML=forecast.forecastday[0].day.uv;
    highlights.children[2].children[1].innerHTML=forecast.forecastday[0].day.avghumidity+"%";
    highlights.children[3].children[1].innerHTML=forecast.forecastday[0].day.avgvis_km+"km";
}
search.addEventListener("click", async () => {
    await getData();

    setLocation();
    setBasics();
    setHighlights();
})