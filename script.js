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
const shortBreakSound = document.getElementById('shortBreakSound');
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
        startTimer();

        if (!isWorkTime) {
          shortBreakSound.play();
        } else {
          shortBreakSound.pause();
          shortBreakSound.currentTime = 0; 
        }
      }
    }, 1000);
    document.getElementById('start-pause').innerHTML =
      '<i class="fas fa-pause"></i>';
      if (!isWorkTime) {
        shortBreakSound.play();
      }   
  }
}
function pauseTimer() {
  if (isRunning) {
    isRunning = false;
    clearInterval(timer);
    document.getElementById('start-pause').innerHTML =
      '<i class="fas fa-play"></i>';
      if (!isWorkTime) {
        shortBreakSound.pause();
      }
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
    // shortBreakSound.play(); // Play sound when short break starts
  }
}
function startWorkTimer() {
  if (!isRunning || !isWorkTime) {
    pauseTimer();
    isWorkTime = true;
    remainingSeconds = workMinutes * 60;
    updateTimerDisplay(workMinutes, 0);
    updateProgressCircle(workMinutes * 60, workMinutes * 60);
    highlightCurrentMode();
    shortBreakSound.pause(); // Stop sound when work timer starts
    shortBreakSound.currentTime = 0; // Reset the sound
  }
}
function updateTimes() {
  workMinutes = parseInt(document.getElementById('work-time').value);
  breakMinutes = parseInt(document.getElementById('break-time').value);
  localStorage.setItem('workMinutes', workMinutes);
  localStorage.setItem('breakMinutes', breakMinutes);
  if (!isRunning) {
    remainingSeconds = isWorkTime ? workMinutes * 60 : breakMinutes * 60;
    updateTimerDisplay(
      Math.floor(remainingSeconds / 60),
      remainingSeconds % 60
    );
    updateProgressCircle(remainingSeconds, remainingSeconds);
  }
}
function updateTimerDisplay(minutes, seconds) {
  document.getElementById('time').textContent = `${String(minutes).padStart(
    2,
    '0'
  )}:${String(seconds).padStart(2, '0')}`;
}
function updateProgressCircle(seconds, totalSeconds) {
  const offset = circumference - (seconds / totalSeconds) * circumference;
  progressCircle.style.strokeDashoffset = offset;
}
function openModal() {
  document.getElementById('settings-modal').style.display = 'block';
}
function closeModal() {
  document.getElementById('settings-modal').style.display = 'none';
}
function saveSettings() {
  updateTimes();
  closeModal();
}
function toggleTheme() {
  const body = document.body;
  const currentTheme = body.classList.contains('dark') ? 'dark' : 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  body.classList.remove(currentTheme);
  body.classList.add(newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
}
function updateThemeIcon(theme) {
  const themeToggle = document.getElementById('theme-toggle');
  if (theme === 'dark') {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    themeToggle.style.backgroundColor = '		#F4C430';
  } else {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.style.backgroundColor = '#333';
  }
}
function loadSettings() {
  const savedWorkMinutes = localStorage.getItem('workMinutes');
  const savedBreakMinutes = localStorage.getItem('breakMinutes');
  const savedTheme = localStorage.getItem('theme');
  if (savedWorkMinutes) {
    workMinutes = parseInt(savedWorkMinutes);
    document.getElementById('work-time').value = workMinutes;
  }
  if (savedBreakMinutes) {
    breakMinutes = parseInt(savedBreakMinutes);
    document.getElementById('break-time').value = breakMinutes;
  }
  if (savedTheme) {
    document.body.classList.add(savedTheme);
    updateThemeIcon(savedTheme);
  } else {
    document.body.classList.add('dark');
    updateThemeIcon('dark');
  }
  remainingSeconds = isWorkTime ? workMinutes * 60 : breakMinutes * 60;
  updateTimerDisplay(Math.floor(remainingSeconds / 60), remainingSeconds % 60);
  updateProgressCircle(remainingSeconds, remainingSeconds);
  highlightCurrentMode();
}
function highlightCurrentMode() {
  if (isWorkTime) {
    document.getElementById('work-timer').classList.add('active');
    document.getElementById('short-break').classList.remove('active');
  } else {
    document.getElementById('work-timer').classList.remove('active');
    document.getElementById('short-break').classList.add('active');
  }
}
loadSettings();