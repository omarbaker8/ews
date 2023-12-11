let countyJsonMap = {
    "Galway": "Connacht.json",
    "Leitrim": "Connacht.json",
    "Mayo": "Connacht.json",
    "Roscommon": "Connacht.json",
    "Sligo": "Connacht.json",
    "Cavan": "Ulster.json",
    "Donegal": "Ulster.json",
    "Monaghan": "Ulster.json",
    "Kilkenny": "Leinster.json",
    "Wexford": "Leinster.json",
    "Clare": "Munster.json",
    "Cork": "Munster.json",
    "Kerry": "Munster.json",
    "Limerick": "Munster.json",
    "Tipperary": "Munster.json",
    "Waterford": "Munster.json",
    "Carlow": "Leinster.json",
    "Dublin": "Dublin.json",
    "Kildare": "Leinster.json",
    "Laois": "Leinster.json",
    "Longford": "Leinster.json",
    "Louth": "Leinster.json",
    "Meath": "Leinster.json",
    "Offaly": "Leinster.json",
    "Westmeath": "Leinster.json",
    "Wicklow": "Leinster.json",
    "Antrim": "Ulster.json",
    "Armagh": "Ulster.json",
    "Down": "Ulster.json",
    "Fermanagh": "Ulster.json",
    "Derry": "Ulster.json",
    "Tyrone": "Ulster.json"
};

let counties = Object.keys(countyJsonMap); // Array of county names


function showSuggestions(input) {
    let suggestionsList = document.getElementById('suggestions');
    suggestionsList.innerHTML = '';
    suggestionsList.classList.add('slide-in-down');

    const errorMessage = document.getElementById('error-message'); // Assuming you have an error message element
    errorMessage.style.display = 'none'; // Hide error message initially

    if (input.length > 0) {
        const filtered = counties.filter(county => county.toLowerCase().startsWith(input.toLowerCase()));
        if (filtered.length === 0) {
            document.getElementById('error-message').style.display = 'block';
            document.getElementById('countyInput').style.color = 'rgba(237, 25, 25, 0.755)';

        } else {
            document.getElementById('error-message').style.display = 'none';
            document.getElementById('countyInput').style.color = '#212529';
        }
        if (filtered.length === 1) {
            // Auto-select if only one county matches
            selectCounty(filtered[0]);
        } else if (filtered.length > 1) {
            // Display list of suggestions
            filtered.forEach(county => {
                let listItem = document.createElement('li');
                listItem.classList.add('list-group-item');
                listItem.textContent = county;
                listItem.onclick = function() {
                    selectCounty(county);
                };
                suggestionsList.appendChild(listItem);
            });
        } else {
            // Display a subtle error message
            errorMessage.style.display = 'block';
        }
    }
}


// Function to handle county selection
function selectCounty(county) {
    if (counties.includes(county)) {
        getWeather(county);
        document.getElementById('countyInput').value = county;
        document.getElementById('suggestions').innerHTML = '';
    } else {
        // Show error if county is not in the list
        alert('Invalid county selected');
    }
}




function getWeather(county) {

    const jsonFile = countyJsonMap[county];
    
    const apiUrl = `https://corsproxy.io/?https://www.met.ie/Open_Data/json/${jsonFile}`;

    $.ajax({
        url: apiUrl,
        method: 'GET',
        success: function(response) {
            // Process the response here
            if (response && response.forecasts && response.forecasts.length > 0) {
                const forecast = response.forecasts[0].regions;
                displayWeather(forecast, county);
            } else {
                console.error("No weather data available");
            }
        },
        error: function(error) {
            console.error("Error fetching weather data", error);
        }
    });
}


function displayWeather(forecast, county) {
    let today = forecast.find(item => item.today)?.today || "No data";
    let tonight = forecast.find(item => item.tonight)?.tonight || "No data";
    let tomorrow = forecast.find(item => item.tomorrow)?.tomorrow || "No data";
    let issuedDate = forecast.find(item => item.issued)?.issued;
    let formattedDate = issuedDate ? new Date(issuedDate).toISOString().split('T')[0] : "Unknown date";

    const weatherInfoHtml = `
        <div class="card">
            <div class="card-header">Weather in ${county} - Date: ${formattedDate}</div>
            <div class="card-body">
                <ul class="nav nav-tabs" id="forecastTab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="today-tab" data-bs-toggle="tab" data-bs-target="#today" type="button" role="tab" aria-controls="today" aria-selected="true">Today</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="tonight-tab" data-bs-toggle="tab" data-bs-target="#tonight" type="button" role="tab" aria-controls="tonight" aria-selected="false">Tonight</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="tomorrow-tab" data-bs-toggle="tab" data-bs-target="#tomorrow" type="button" role="tab" aria-controls="tomorrow" aria-selected="false">Tomorrow</button>
                    </li>
                </ul>
                <div class="tab-content" id="forecastTabContent">
                    <div class="tab-pane fade show active" id="today" role="tabpanel" aria-labelledby="today-tab">
                        <p class="card-text">${today}</p>
                    </div>
                    <div class="tab-pane fade" id="tonight" role="tabpanel" aria-labelledby="tonight-tab">
                        <p class="card-text">${tonight}</p>
                    </div>
                    <div class="tab-pane fade" id="tomorrow" role="tabpanel" aria-labelledby="tomorrow-tab">
                        <p class="card-text">${tomorrow}</p>
                    </div>
                </div>
                <button id="speakButton" class="btn btn-outline-dark"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-megaphone-fill" viewBox="0 0 16 16">
                <path d="M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0zm-1 .724c-2.067.95-4.539 1.481-7 1.656v6.237a25.222 25.222 0 0 1 1.088.085c2.053.204 4.038.668 5.912 1.56zm-8 7.841V4.934c-.68.027-1.399.043-2.008.053A2.02 2.02 0 0 0 0 7v2c0 1.106.896 1.996 1.994 2.009a68.14 68.14 0 0 1 .496.008 64 64 0 0 1 1.51.048zm1.39 1.081c.285.021.569.047.85.078l.253 1.69a1 1 0 0 1-.983 1.187h-.548a1 1 0 0 1-.916-.599l-1.314-2.48a65.81 65.81 0 0 1 1.692.064c.327.017.65.037.966.06z"/>
              </svg>  Read Forecast</button>
            </div>
        </div>
    `;

    let weatherInfo = document.getElementById('weatherInfo');
    weatherInfo.innerHTML = weatherInfoHtml;
    weatherInfo.classList.remove('slide-in-down');
    setTimeout(() => {
        weatherInfo.classList.add('slide-in-down');
    }, 1);

    // Event listeners for tabs
    document.getElementById('today-tab').addEventListener('click', function() {
        document.body.style.background = "linear-gradient(to bottom, #d4d4eb, #9494bb)";
        document.querySelector('.bi-cloud-drizzle').style.color = '#212529'; // Off-white color for SVG
        document.querySelector('h2').style.color = '#212529'; // Off-white color for heading
        updateDate(issuedDate, 0, county);
        let stems = document.querySelectorAll('.stem');
        stems.forEach(function(stem) {
            stem.style.background = "linear-gradient(to bottom, rgba(63, 93, 229, 0), rgba(7, 7, 7, 0.25)";
        });
        document.body.classList.toggle('splat-toggle');
        let splats = document.querySelectorAll('.splat');
        splats.forEach(function(splat) {
            splat.style.background = "";
            
        });
    });
    document.getElementById('tonight-tab').addEventListener('click', function() {
        document.body.style.transition = "background 0.5s ease";
        document.body.style.background = "linear-gradient(to bottom, #202080, #111119)";
        let stems = document.querySelectorAll('.stem');
        stems.forEach(function(stem) {
            stem.style.background = "linear-gradient(to bottom, #24244ab3, #0056b3)";
        });
        let splats = document.querySelectorAll('.splat');
        splats.forEach(function(splat) {
            splat.style.background = "linear-gradient(to bottom, #24244ab3, #0056b3)";
            
        });
        document.querySelector('.bi-cloud-drizzle').style.color = '#F8F8FF'; // Off-white color for SVG
        document.querySelector('h2').style.color = '#F8F8FF'; // Off-white color for heading
        updateDate(issuedDate, 0, county);
    });
    document.getElementById('tomorrow-tab').addEventListener('click', function() {
        document.body.style.background = "linear-gradient(to bottom, #d4d4eb, #9494bb)";
        document.querySelector('.bi-cloud-drizzle').style.color = '#212529'; // Off-white color for SVG
        document.querySelector('h2').style.color = '#212529'; // Off-white color for heading
        updateDate(issuedDate, 1, county);
        let stems = document.querySelectorAll('.stem');
        stems.forEach(function(stem) {
            stem.style.background = "linear-gradient(to bottom, rgba(63, 93, 229, 0), rgba(7, 7, 7, 0.25)";
        });
        let splats = document.querySelectorAll('.splat');
        splats.forEach(function(splat) {
            splat.style.background = "";
            
        });
    });

    document.getElementById('speakButton').addEventListener('click', () => {
        let activeTabId = document.querySelector('.tab-content .active').getAttribute('id');
        readForecast(activeTabId === 'today' ? today : (activeTabId === 'tonight' ? tonight : tomorrow));
    });

    function updateDate(originalDate, daysToAdd, county) {
        let date = new Date(originalDate);
        date.setDate(date.getDate() + daysToAdd);
        let formattedDate = date.toISOString().split('T')[0];
        document.querySelector('.card-header').textContent = `Weather in ${county} - Date: ${formattedDate}`;
    }
}

function readForecast(forecastText) {
    window.speechSynthesis.cancel();
    let speech = new SpeechSynthesisUtterance();
    speech.text = forecastText;
    speech.lang = 'en-US'; 
    window.speechSynthesis.speak(speech);
}


function updateDate(originalDate, daysToAdd) {
    let date = new Date(originalDate);
    date.setDate(date.getDate() + daysToAdd); 
    let formattedDate = date.toISOString().split('T')[0]; 
    document.querySelector('.card-header').textContent = `Weather in ${county} - Date: ${formattedDate}`;
}


document.getElementById('countyInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        let input = this.value;
        if (counties.includes(input)) {
            selectCounty(input);
        }
    } else if (event.key === 'Backspace') {
        this.value = '';
        document.getElementById('suggestions').innerHTML = '';
        window.speechSynthesis.cancel();
    }
});

// Reload the page when "Éire Simple Weather" or the SVG is clicked
document.querySelector('h2').addEventListener('click', function() {
    window.speechSynthesis.cancel();
    location.reload();
});

document.querySelector('.bi-cloud-drizzle').addEventListener('click', function() {
    window.speechSynthesis.cancel();
    location.reload();
});

// Focus on the input when any key is pressed
document.addEventListener('keydown', function() {
    document.getElementById('countyInput').focus();
});

var makeItRain = function() {
    //clear out everything
    $('.rain').empty();
  
    var increment = 0;
    var drops = "";
    var backDrops = "";
  
    while (increment < 100) {
      //couple random numbers to use for various randomizations
      //random number between 98 and 1
      var randoHundo = (Math.floor(Math.random() * (98 - 1 + 1) + 1));
      //random number between 5 and 2
      var randoFiver = (Math.floor(Math.random() * (5 - 2 + 1) + 2));
      //increment
      increment += randoFiver;
      //add in a new raindrop with various randomizations to certain CSS properties
      drops += '<div class="drop" style="left: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"><div class="stem" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div><div class="splat" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div></div>';
      backDrops += '<div class="drop" style="right: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"><div class="stem" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div><div class="splat" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div></div>';
    }
  
    $('.rain.front-row').append(drops);
    $('.rain.back-row').append(backDrops);
  }
  
  $('.splat-toggle.toggle').on('click', function() {
    $('body').toggleClass('splat-toggle');
    $('.splat-toggle.toggle').toggleClass('active');
    makeItRain();
  });
  
  $('.back-row-toggle.toggle').on('click', function() {
    $('body').toggleClass('back-row-toggle');
    $('.back-row-toggle.toggle').toggleClass('active');
    makeItRain();
  });
  
  $('.single-toggle.toggle').on('click', function() {
    $('body').toggleClass('single-toggle');
    $('.single-toggle.toggle').toggleClass('active');
    makeItRain();
  });
  
  makeItRain();
