let startTime = 0;
let elapsedTime = 0;
let timerInterval;
let isRunning = false;
let previousLapTime = 0;
let lapTimes = [];

const display = document.getElementById("display");
const startPauseBtn = document.getElementById("startPause");
const resetBtn = document.getElementById("reset");
const lapBtn = document.getElementById("lap");
const lapBody = document.getElementById("lapBody");
const lapsSection = document.getElementById("lapsSection");
const toast = document.getElementById("toast");

// Audio
const startSound = document.getElementById("startSound");
const lapSound = document.getElementById("lapSound");
const resetSound = document.getElementById("resetSound");

function formatTime(ms) {
  let date = new Date(ms);
  let h = String(date.getUTCHours()).padStart(2, '0');
  let m = String(date.getUTCMinutes()).padStart(2, '0');
  let s = String(date.getUTCSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function updateDisplay() {
  display.textContent = formatTime(elapsedTime);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

startPauseBtn.addEventListener("click", () => {
  if (!isRunning) {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => {
      elapsedTime = Date.now() - startTime;
      updateDisplay();
    }, 250);
    isRunning = true;
    startPauseBtn.innerHTML = `<i class="fas fa-pause"></i>`;
    startSound.play();
  } else {
    clearInterval(timerInterval);
    isRunning = false;
    startPauseBtn.innerHTML = `<i class="fas fa-play"></i>`;
    startSound.play();
  }
});

resetBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  elapsedTime = 0;
  previousLapTime = 0;
  lapTimes = [];
  updateDisplay();
  isRunning = false;
  startPauseBtn.innerHTML = `<i class="fas fa-play"></i>`;
  lapBody.innerHTML = '';
  lapsSection.style.display = "none";
  resetSound.play();
});

lapBtn.addEventListener("click", () => {
  if (!isRunning) return;

  const currentLapTime = elapsedTime - previousLapTime;
  previousLapTime = elapsedTime;
  lapTimes.push(currentLapTime);

  const row = document.createElement("tr");
  const lapNumber = lapTimes.length;

  row.innerHTML = `
    <td>${lapNumber < 10 ? `0${lapNumber}` : lapNumber}</td>
    <td>+${formatTime(currentLapTime)}</td>
    <td>${formatTime(elapsedTime)}</td>
  `;

  lapBody.insertBefore(row, lapBody.firstChild);
  lapsSection.style.display = "block";
  lapSound.play();
  showToast("Lap Recorded!");

  highlightBestAndWorstLaps();
});

function highlightBestAndWorstLaps() {
  [...lapBody.rows].forEach(row => {
    row.cells[1].style.color = '';
  });

  if (lapTimes.length < 2) return;

  let min = Math.min(...lapTimes);
  let max = Math.max(...lapTimes);

  [...lapBody.rows].forEach((row, index) => {
    let time = lapTimes[lapTimes.length - 1 - index];
    if (time === min) row.cells[1].style.color = 'blue';
    if (time === max) row.cells[1].style.color = 'red';
  });
}

// Init
updateDisplay();
