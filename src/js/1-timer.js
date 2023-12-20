import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

document.addEventListener('DOMContentLoaded', function () {
  let userSelectedDate;
  const startButton = document.querySelector('[data-start]');
  const daysElement = document.querySelector('[data-days]');
  const hoursElement = document.querySelector('[data-hours]');
  const minutesElement = document.querySelector('[data-minutes]');
  const secondsElement = document.querySelector('[data-seconds]');

  // Опції для flatpickr
  const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      userSelectedDate = selectedDates[0];

      // Перевірка чи обрана дата в майбутньому
      if (userSelectedDate > new Date()) {
        startButton.removeAttribute('disabled');
        iziToast.hide();
      } else {
        startButton.setAttribute('disabled', true);
        iziToast.error({
          title: 'Error',
          message: 'Please choose a date in the future',
        });
      }
    },
  };

  // Ініціалізація flatpickr
  flatpickr('#datetime-picker', options);

  // Функція для форматування чисел (додавання 0, якщо менше двох символів)
  function addLeadingZero(value) {
    return value.toString().padStart(2, '0');
  }

  // Функція для оновлення таймера
  function updateTimer() {
    const currentTime = new Date();
    const timeDifference = userSelectedDate - currentTime;

    if (timeDifference <= 0) {
      // Таймер закінчився
      clearInterval(timerInterval);
      daysElement.textContent = '00';
      hoursElement.textContent = '00';
      minutesElement.textContent = '00';
      secondsElement.textContent = '00';
    } else {
      // Оновлення значень таймера
      const { days, hours, minutes, seconds } = convertMs(timeDifference);
      daysElement.textContent = addLeadingZero(days);
      hoursElement.textContent = addLeadingZero(hours);
      minutesElement.textContent = addLeadingZero(minutes);
      secondsElement.textContent = addLeadingZero(seconds);
    }
  }

  // Обробник кліку на кнопці "Start"
  startButton.addEventListener('click', function () {
    startButton.setAttribute('disabled', true);
    updateTimer(); // Виклик функції для відображення початкових значень
    timerInterval = setInterval(updateTimer, 1000); // Оновлення таймера кожну секунду
  });

  // Функція для перетворення мілісекунд в об'єкт з днями, годинами, хвилинами і секундами
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
});
