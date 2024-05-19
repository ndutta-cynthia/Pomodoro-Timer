let workMinutes = localStorage.getItem('workMinutes')
  ? parseInt(localStorage.getItem('workMinutes'))
  : 25;
let breakMinutes = localStorage.getItem('breakMinutes')
  ? parseInt(localStorage.getItem('breakMinutes'))
  : 5;
let isRunning = false;
let isWorkTime = true;
let remainingSeconds = workMinutes * 60;
let timer;
const progressCircle = document.querySelector('.progress-ring__circle');
const radius = progressCircle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;
progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
progressCircle.style.strokeDashoffset = circumference;
document.getElementById('start-pause').addEventListener('click', toggleTimer);
document
  .getElementById('short-break')
  .addEventListener('click', startShortBreak);
document.getElementById('work-timer').addEventListener('click', startWorkTimer);
document.getElementById('settings-button').addEventListener('click', openModal);
document.querySelector('.close-button').addEventListener('click', closeModal);
document
  .getElementById('save-settings')
  .addEventListener('click', saveSettings);
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
function toggleTimer() {
  if (isRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
}
function startTimer() {
  if (!isRunning) {
    isRunning = true;
    timer = setInterval(() => {
      remainingSeconds--;
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;
      updateTimerDisplay(minutes, seconds);
      updateProgressCircle(
        remainingSeconds,
        isWorkTime ? workMinutes * 60 : breakMinutes * 60
      );
      if (remainingSeconds <= 0) {
        clearInterval(timer);
        isRunning = false;
        isWorkTime = !isWorkTime;
        remainingSeconds = isWorkTime ? workMinutes * 60 : breakMinutes * 60;
        updateTimerDisplay(
          Math.floor(remainingSeconds / 60),
          remainingSeconds % 60
        );
        updateProgressCircle(remainingSeconds, remainingSeconds);
        highlightCurrentMode();
        startTimer(); // Automatically start the next mode
      }
    }, 1000);
    document.getElementById('start-pause').innerHTML =
      '<i class="fas fa-pause"></i>';
  }
}
function pauseTimer() {
  if (isRunning) {
    isRunning = false;
    clearInterval(timer);
    document.getElementById('start-pause').innerHTML =
      '<i class="fas fa-play"></i>';
  }
}
function startShortBreak() {
  if (!isRunning || isWorkTime) {
    pauseTimer();
    isWorkTime = false;
    remainingSeconds = breakMinutes * 60;
    updateTimerDisplay(breakMinutes, 0);
    updateProgressCircle(breakMinutes * 60, breakMinutes * 60);
    highlightCurrentMode();
  }
}