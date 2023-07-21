let timer;
let minutes = 25;
let seconds = 0;
let isPaused = true;

function startTimer() {
  if (isPaused) {
    isPaused = false;
    timer = setInterval(updateTimer, 1000);
  }
}

function pauseTimer() {
  clearInterval(timer);
  isPaused = true;
}

function resetTimer() {
  clearInterval(timer);
  isPaused = true;
  minutes = 25;
  seconds = 0;
  displayTime();
}

function updateTimer() {
  if (seconds > 0) {
    seconds--;
  } else if (minutes > 0) {
    minutes--;
    seconds = 59;
  } else {
    clearInterval(timer);
    isPaused = true;
    // Implement the break or long break here
    // For simplicity, we'll just reset the timer for now
    resetTimer();
    return;
  }

  displayTime();
}

function displayTime() {
  const timerDisplay = document.getElementById('timerDisplay');
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  timerDisplay.innerText = formattedTime;
}

function switchTab(tab) {
  clearInterval(timer);
  isPaused = true;

  if (tab === 'pomodoro') {
    minutes = 25;
    document.body.style.backgroundColor = 'royalblue';
  } else if (tab === 'long-break') {
    minutes = 15;
    document.body.style.backgroundColor = 'green';
  } else if (tab === 'short-break') {
    minutes = 5;
    document.body.style.backgroundColor = 'yellow';
  }

  seconds = 0;
  displayTime();
}

function toggleTimer() {
  if (isPaused) {
    startTimer();
  } else {
    pauseTimer();
  }

  const startPauseBtn = document.querySelector('.start-pause-btn');
  const btnText = isPaused ? 'Start' : 'Pause';
  startPauseBtn.textContent = btnText;
}
