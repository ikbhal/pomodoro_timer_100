const app = new Vue({
    el: '#app',
    data: {
      currentTab: 'pomodoro',
      isRunning: false,
      timeLeft: 25 * 60, // 25 minutes in seconds (pomodoro time)
      timer: null,
    },
    methods: {
      formatTime(timeInSeconds) {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      },
      toggleTimer() {
        if (this.isRunning) {
          clearInterval(this.timer);
        } else {
          this.timer = setInterval(this.updateTimer, 1000);
        }
        this.isRunning = !this.isRunning;
      },
      updateTimer() {
        if (this.timeLeft > 0) {
          this.timeLeft -= 1;
        } else {
          this.toggleTimer();
        }
      },
      resetTimer() {
        clearInterval(this.timer);
        this.isRunning = false;
        this.timeLeft = this.getTimeForCurrentTab();
      },
      getTimeForCurrentTab() {
        switch (this.currentTab) {
          case 'pomodoro':
            return 25 * 60; // 25 minutes in seconds
          case 'longBreak':
            return 15 * 60; // 15 minutes in seconds (example, adjust as needed)
          case 'shortBreak':
            return 5 * 60; // 5 minutes in seconds (example, adjust as needed)
          default:
            return 25 * 60;
        }
      },
    },
    watch: {
      currentTab() {
        this.resetTimer();
      },
      timeLeft() {
        if (this.timeLeft === 0) {
          // TODO: Add a notification or alert when the timer finishes.
        }
      },
    },
    mounted() {
      this.timeLeft = this.getTimeForCurrentTab();
    },
  });
  