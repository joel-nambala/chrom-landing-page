'use strict';

// Select DOM Elements
const momentumTime = document.querySelector('.momentum-time');
const momentumGreet = document.querySelector('.momentum-greeting');
const momentumName = document.querySelector('.momentum-name');
const momentumFocus = document.querySelector('.momentum-focus');

class App {
  #today = new Date();

  constructor() {
    // Set the current time
    setTimeout(this.#setTime.bind(this), 1000);

    // Get name
    this.#getName();

    // Get focus
    this.#getFocus();

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

  clearLocalStorage() {
    localStorage.clear('name');
    localStorage.clear('focus');
  }
}

const app = new App();
