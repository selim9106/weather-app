/** 
 *function to select DOM element (id's, class, tag) */

 function getDomelement (selector) {
    return document.querySelector(selector)
}


// -----------------------------------burgermenu-------------------------------------

let asidemobile = getDomelement(".aside")
let burgermenu = getDomelement("#bgmenu");
let closebgbutton = getDomelement("#closebgmenu");
let menulinks = document.querySelectorAll(".aside__menu__item");

burgermenu.onclick = openBgmenu;
closebgbutton.onclick = closeBgMenu;

menulinks.forEach(link =>link.addEventListener("click", closeBgMenu));

function openBgmenu() {
    asidemobile.classList.add("asidemobile");
};

function closeBgMenu() {
    asidemobile.classList.remove("asidemobile");
};


// ------------------------------------- API --------------------------




let mainContent = getDomelement(".main");

let currentTemp = getDomelement(".todayweather__temp__degrees");
let tempValue = getDomelement(".degreevalue");

let unit = getDomelement("#toggleunit");
let todaywicon = getDomelement(".todayweather__picture__icon");

let currentTempdetails = getDomelement(".todayweather__picture__caption");


/**
 * 
 * @param {string} city inputcity
 * @returns 
 */
async function getWeather (city) {
    const apiKey = "cccc6ab1922b222363df0abbd37784ca";
    // let lat = getCurrentPosition
    // let lat = document.getElementById('latitude').value;
    // let lon = document.getElementById('longitude').value;
    // let url = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}`

    let lang = 'en';
    let units = 'metric';
    const apiurl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&lang=${lang}&units=${units}&cnt=1&appid=${apiKey}`;
    const response = await fetch(apiurl)
    const json = await response.json()
    return json;
}

// console.log(getWeather("Brussels")); ===> Attention, retourne une promesse qu'il faut traiter (cf fonction displayWeather)



async function displayCityweather (inputcity) {

    let details = await getWeather(inputcity);
    console.log(details);
    
    let timeZone = details.city.timezone;
    let date = new Date().toDateString({timeZone: timeZone});

    mainContent.innerHTML = 
    `<article class="main__article">
        <a href="#" class="main__article__slider main__article__slider--left"></a>
        <a href="#" class="main__article__slider main__article__slider--right"></a>

        <!------------------------- carousel --------------------->
        <section class="main__article__section main__article__section--city">
            <h1 class="section__city" id="city">${details.city.name}</h1>
            <nav class ="section__nav">
                <ul class="section__nav__buttons">
                    <li class="section__nav__buttons__btn"></li>
                    <li class="section__nav__buttons__btn"></li>
                    <li class="section__nav__buttons__btn"></li>
                    <li class="section__nav__buttons__btn"></li>
                </ul>
            </nav>
        </section>

        <!------------------------- Today's weather --------------------->
        <section class="main__article__section main__article__section--todaysweather">
            <div class="main__article__section__time">
                <h2 class="section__time__item section__time__item--day" id="date">${date}</h2>
                <h3 class="section__time__item section__time__item--hour" id="time">${getcurrentTime()}</h3>
            </div>

            <section class="main__article__section__todayweather">

                <div class="todayweather__temp">
                    <p class="todayweather__temp__degrees"><span class="degreevalue">${parseInt(details.list[0].main.temp)}</span><span class="degreeicon" id="degreeiconbig">&deg;</span></p>
                    <button class="todayweather__temp__toggle" id="toggleunit">&deg;C</button>
                </div>

                <div class="todayweather__picture">

                    <figure class="todayweather__picture__icon">
                        <img src="https://openweathermap.org/img/wn/${details.list[0].weather[0].icon}@2x.png">
                    </figure>
                    <figcaption class="todayweather__picture__caption">20&deg;/27&deg<br> Feels like 30&deg;</figcaption>

                </div>
            </section>


        </section>


     </article>
                    `
    // Display & update hour
    let currenttime = getDomelement("#time");

    function getcurrentTime() {
        let time = new Date().toLocaleTimeString({timeZone: timeZone});
        return time
    }

    setInterval(() => {
        currenttime.innerHTML = getcurrentTime()},1000);

}

let localisation = navigator.geolocation;

localisation.getCurrentPosition(success, error);

  function success(pos) {
    const crd = pos.coords;
    let lat = crd.latitude;
    let long = crd.longitude;
    let parslat = Math.round(lat*10)/10;
    let parslong = Math.round(long*10)/10;
    console.log(parslat, parslong);
  };
  
  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  };


// let currentlocation = getDomelement("#location");

//  fonction on load


let searchField = getDomelement("#searchfield");
let submit = getDomelement("form");
function initApp() {

    // currentlocation.value = localisation;
    // console.log(currentlocation.value);

    
    submit.addEventListener("submit", function(e) {
        // line below prevent from reloading page every function call
        e.preventDefault();
        let city = searchField.value;
        displayCityweather(city);
    })

};


initApp()




/**
 * 
 * @param {String}
 * @return {Promise<Array>} result array search
 * 
 * Get the city input field
 */

const getCity = async searchText => {
    let cityapiurl = `https://api.teleport.org/api/cities/?search=${searchText}`
    let result = await fetch (cityapiurl)
    let cities = await result.json();
    return cities
};

/**
 * Autocomplete search field
 */

async function suggestCity (searchedcity) {
    let cities = await getCity(searchedcity)
    let citiesArray = cities._embedded["city:search-results"]

        if (!document.getElementById("suggestions")) {
        suggestions = document.createElement("div")
        suggestions.id ="suggestions";
        submit.appendChild(suggestions)
    }

    let results = document.getElementById("suggestions");
    results.innerHTML = ""
    console.log(results)


    for (let city of citiesArray) {
        suggestions.innerHTML += 
        `<div class="suggestions__item">${city.matching_full_name}</div>`
    }

}

searchField.addEventListener("input", () => suggestCity(searchField.value))

