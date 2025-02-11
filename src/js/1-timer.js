
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const datePicker = document.querySelector("#datetime-picker");
const startButton = document.querySelector("[data-start]");
const daysSpan = document.querySelector("[data-days]");
const hoursSpan = document.querySelector("[data-hours]");
const minutesSpan = document.querySelector("[data-minutes]");
const secondsSpan = document.querySelector("[data-seconds]");

let userSelectedDate = null;
let timerId = null;

startButton.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
   onClose(selectedDates) {
        console.log("Selected Date:", selectedDates[0]);
        userSelectedDate = selectedDates[0];

    if (userSelectedDate <= new Date()) {
      iziToast.error({ message: "Please choose a date in the future" });
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  },
};

flatpickr(datePicker, options);

startButton.addEventListener("click", () => {
  startButton.disabled = true;
  datePicker.disabled = true;

  timerId = setInterval(() => {
    const timeLeft = userSelectedDate - new Date();
    if (timeLeft <= 0) {
      clearInterval(timerId);
      updateTimerUI(0, 0, 0, 0);
      datePicker.disabled = false;
      return;
    }
    const { days, hours, minutes, seconds } = convertMs(timeLeft);
    updateTimerUI(days, hours, minutes, seconds);
  }, 1000);
});

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  return {
    days: Math.floor(ms / day),
    hours: Math.floor((ms % day) / hour),
    minutes: Math.floor(((ms % day) % hour) / minute),
    seconds: Math.floor((((ms % day) % hour) % minute) / second),
  };
}

function updateTimerUI(days, hours, minutes, seconds) {
  daysSpan.textContent = addLeadingZero(days);
  hoursSpan.textContent = addLeadingZero(hours);
  minutesSpan.textContent = addLeadingZero(minutes);
  secondsSpan.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}


