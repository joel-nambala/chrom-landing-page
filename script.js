'use strict';

// Select DOM Elements
const momentum = document.querySelector('.momentum');
const momentumTime = document.querySelector('.momentum-time');
const momentumGreet = document.querySelector('.momentum-greet');
const momentumName = document.querySelector('.momentum-name');
const momentumFocus = document.querySelector('.momentum-focus');
const quoteAuthor = document.querySelector('.quote-author');
const quoteText = document.querySelector('.quote-text');
const weatherCity = document.querySelector('.weather-city');
const weatherTemp = document.querySelector('.weather-temp');
const weatherIcon = document.querySelector('.weather-icon');

class App {
  #today = new Date();
  #API_KEY = 'a55da39139ac651b32e5cef13ec51ae4';

  constructor() {
    // Set the current time
    setInterval(this.#setTime.bind(this), 1000);

    // Get name
    this.#getName();

    // Get focus
    this.#getFocus();

    // Add a greeting
    this.#greeting();

    // Get random quotes
    this.#getRandomQuotes();

    // Get local weather
    this.#currentLocation();

    // Add event listeners to set name and focus
    momentumName.addEventListener('keypress', this.#setName);
    momentumName.addEventListener('blur', this.#setName);
    momentumFocus.addEventListener('keypress', this.#setFocus);
    momentumFocus.addEventListener('blur', this.#setFocus);

    // Clear local storage
    momentumTime.addEventListener('click', this.clearLocalStorage);
  }

  // Set the time method
  #setTime() {
    // 1. Format the time
    const formatTime = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(this.#today);

    // 2. Append the time to the UI
    momentumTime.textContent = formatTime;
  }

  // Change greeting
  #greeting() {
    const hour = this.#today.getHours();

    if (hour < 12) {
      // Good morning
      momentumGreet.textContent = 'Good morning';
      momentum.style.backgroundImage = 'url(./img/photo-1.png)';
    }

    if (hour >= 12 && hour < 18) {
      // Good afternoon
      momentumGreet.textContent = 'Good afternoon';
      momentum.style.backgroundImage = 'url(./img/photo-1.png)';
    }

    if (hour >= 18 && hour <= 23) {
      // Good evening
      momentumGreet.textContent = 'Good evening';
      momentum.style.backgroundImage = 'url(./img/photo-1.png)';
    }
  }

  // Get name from the local storage
  #getName() {
    // Get the item from the local storage
    const name = localStorage.getItem('name');

    if (name === null) momentumName.textContent = '[Enter name]';
    else momentumName.textContent = localStorage.getItem('name');
  }

  // Get focus from the local storage
  #getFocus() {
    // Get the item from the local storage
    const focus = localStorage.getItem('focus');

    if (focus === null) momentumFocus.textContent = '[Enter focus]';
    else momentumFocus.textContent = localStorage.getItem('focus');
  }

  // Set name to the local storage
  #setName(e) {
    if (e.type === 'keypress') {
      // Make sure enter was pressed
      if (e.key === 'Enter') {
        localStorage.setItem('name', e.target.innerText);
        momentumName.blur();
      }
    } else {
      localStorage.setItem('name', e.target.innerText);
    }
  }

  // Set focus to the local storage
  #setFocus(e) {
    if (e.type === 'keypress') {
      // Make sure enter was pressed
      if (e.key === 'Enter') {
        localStorage.setItem('focus', e.target.innerText);
        momentumFocus.blur();
      }
    } else {
      localStorage.setItem('focus', e.target.innerText);
    }
  }

  // Clear local storage
  clearLocalStorage() {
    localStorage.clear('name');
    localStorage.clear('focus');
  }

  // Get random quotes
  async #getRandomQuotes() {
    try {
      // AJAX request
      const response = await fetch('https://type.fit/api/quotes');

      // Convert into json format
      const data = await response.json();

      // Throw an error if encounterd
      if (!response.ok) throw new Error('Something went wrong! 🔥🔥🔥');

      // Slice a copy of the array
      const dataCopy = data.slice(0, 500);

      // Generate a random integer
      const randomInt = Math.floor(Math.random() * dataCopy.length);

      // Get the quote from an array at the position of the random integer
      const quote = dataCopy[randomInt];

      // Display the quote to the UI
      if (quote.author === null)
        this.#displayQuotes('Joel Nambala', quote.text);
      else this.#displayQuotes(quote.author, quote.text);
    } catch (error) {
      // Catch the errors encountered
      quoteText.textContent = `${error.message} Please check your internet connection`;
    }
  }

  // Display the quotes to the UI
  #displayQuotes(author, text) {
    // Display the incoming data to the UI
    quoteAuthor.textContent = author;
    quoteText.textContent = text;
  }

  // Get weather data
  async #getWeather(lat, lng) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=hourly,minutely&units=metric&appid=${
          this.#API_KEY
        }`
      );

      if (!response.ok) throw new Error('Something went wrong!!!');

      const data = await response.json();
      console.log(data);

      weatherTemp.innerHTML = `<h2 class="weather-temp">${data.current.temp} &#8451;</h2>`;
      // weatherIcon.src = `http://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png`;
    } catch (error) {
      console.log(error.message);
    }
  }

  // Where on earth are you
  async #whereOnEarth(lat, lng) {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );

      if (!response.ok) throw new Error('Something went wrong!!!');

      const data = await response.json();

      weatherCity.textContent = data.city;
    } catch (error) {
      console.error(error.message);
    }
  }

  // Get current location
  #currentLocation() {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      this.#whereOnEarth(latitude, longitude);
      this.#getWeather(latitude, longitude);
    });
  }
}

const app = new App();
