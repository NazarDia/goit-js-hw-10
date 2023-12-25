import flatpickr from 'flatpickr';
import izitoast from 'izitoast';
import 'flatpickr/dist/flatpickr.min.css';
import 'izitoast/dist/css/iziToast.min.css';

const inputEl = document.querySelector('input[type="text"]');
const buttonEl = document.querySelector('button[type="button"]');
const dayEl = document.querySelector('[data-days]');
const hourEl = document.querySelector('[data-hours]');
const minEl = document.querySelector('[data-minutes]');
const secEl = document.querySelector('[data-seconds]');

let userSelectedDate;
let intervalId;
let convertTime;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (new Date(selectedDates[0]).valueOf() < new Date().valueOf()) {
      izitoast.error({
        position: 'topRight',
        message: 'Please choose a date in the future',
      });
      buttonEl.disabled = true;
    } else {
      inputEl.style.background = '#FFFFFF';
      buttonEl.disabled = false;
      userSelectedDate =
        new Date(selectedDates[0]).valueOf() - new Date().valueOf();
      if (intervalId) {
        clearInterval(intervalId);
      }
    }
  },
};

flatpickr(inputEl, options);

document.addEventListener('DOMContentLoaded', () => {
  buttonEl.disabled = true;
});

buttonEl.addEventListener('click', () => {
  if (intervalId) {
    clearInterval(intervalId);
  }
  convertTime = convertMs(userSelectedDate);
  renderTime(convertTime);
  inputEl.style.background = '#F5F5F5';
  buttonEl.disabled = true;

  intervalId = setInterval(() => {
    userSelectedDate = userSelectedDate - 1000;
    convertTime = convertMs(userSelectedDate);
    renderTime(convertTime);
    if (Object.values(convertTime).reduce((a, b) => a + b, 0) <= 0) {
      clearInterval(intervalId);
      inputEl.style.background = '#FFFFFF';
    }
  }, 1000);
});

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);

  const hours = Math.floor((ms % day) / hour);

  const minutes = Math.floor(((ms % day) % hour) / minute);

  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function renderTime(newTime) {
  dayEl.textContent = addLeadingZero(newTime.days);
  hourEl.textContent = addLeadingZero(newTime.hours);
  minEl.textContent = addLeadingZero(newTime.minutes);
  secEl.textContent = addLeadingZero(newTime.seconds);
}
