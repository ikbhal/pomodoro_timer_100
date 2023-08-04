
// TodoList component
const TodoList = {
  data() {
    return {
      newTodo: '',
      todos: [],
    };
  },
  mounted() {
    this.loadFromLocalStorage();
  },
  methods: {
    addTodo() {
      if (this.newTodo.trim() !== '') {
        this.todos.push({ text: this.newTodo, checked: false });
        this.newTodo = '';
      }
    },
    toggleCheck(index) {
      this.todos[index].checked = !this.todos[index].checked;
    },
    deleteTodo(index) {
      this.todos.splice(index, 1);
    },
    exportJSON() {
      const jsonData = JSON.stringify(this.todos);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'todos.json';
      a.click();
    },
    exportText() {
      const textData = this.todos.map((todo) => `- [${todo.checked ? 'x' : ' '}] ${todo.text}`).join('\n');
      const blob = new Blob([textData], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'todos.txt';
      a.click();
    },
    saveToLocalStorage() {
      localStorage.setItem('todos', JSON.stringify(this.todos));
      alert('Todos saved to local storage.');
    },

    importFromJSON(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        try {
          const importedTodos = JSON.parse(reader.result);
          if (!Array.isArray(importedTodos)) {
            throw new Error('Invalid JSON format. Please provide a valid array of todos.');
          }
          this.todos = importedTodos;
          alert('Todos imported successfully.');
        } catch (error) {
          alert('Error importing todos. Please ensure you are using a valid JSON file.');
        }
      };
      reader.readAsText(file);
    },
          
    deleteAllTodos() {
      if (confirm("Are you sure you want to delete all todos?")) {
        this.todos = [];
        localStorage.removeItem("todos");
      }
    },

    loadFromLocalStorage() {
      const storedTodos = localStorage.getItem("todos");
      if (storedTodos) {
        this.todos = JSON.parse(storedTodos);
      }
    },

  },

  template: `
    <div>
      <h3>Todo List</h3>
      <button @click="deleteAllTodos" class="btn btn-danger">Delete All</button>
      
      <button @click="saveToLocalStorage" class="btn btn-primary mt-2">
        Save
      </button>
      <br/>
      <input type="file" ref="fileInput" @change="importFromJSON" style="display: none;">
      <button @click="$refs.fileInput.click()" class="btn btn-primary mt-2">Import</button>
      <br/>
      <button @click="exportJSON" class="btn btn-primary mt-2">
        <i class="fas fa-download"></i> Export as JSON
      </button>
      <button @click="exportText" class="btn btn-primary mt-2">
        <i class="fas fa-download"></i> Export as Text
      </button>
    </div>
      <input v-model="newTodo" @keyup.enter="addTodo" class="form-control mb-2" placeholder="Add a new todo...">
      <ul class="list-group">
        <li v-for="(todo, index) in todos" :key="index" class="list-group-item">
          <input type="checkbox" v-model="todo.checked" @change="toggleCheck(index)">
          <button @click="deleteTodo(index)" class="btn btn-danger btn-sm float-right">
            <i class="fas fa-trash-alt"></i> <!-- Font Awesome trash icon -->
          </button>
          <span :class="{ 'text-decoration-line-through': todo.checked }">{{ todo.text }}</span>
        </li>
      </ul>
     
    </div>
  `,
};

const app = new Vue({
  el: '#app',
  data: {
    currentTab: 'pomodoro',
    isRunning: false,
    timeLeft: 25 * 60, // 25 minutes in seconds (pomodoro time)
    timer: null,
    pomodorosCompleted: 0,
    pomodorosBeforeLongBreak: 4,
    isBackgroundSoundPlaying: false,
  },
  // Register the TodoList component globally
  components: {
    'todo-list': TodoList,
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
        this.pauseBackgroundSound();
      } else {
        this.timer = setInterval(this.updateTimer, 1000);
        this.playBackgroundSound();
      }
      this.isRunning = !this.isRunning;
    },
    updateTimer() {
      if (this.timeLeft > 0) {
        this.timeLeft -= 1;
      } else {
        this.onTimerEnd();
      }
    },
    resetTimer() {
      clearInterval(this.timer);
      this.isRunning = false;
      this.timeLeft = this.getTimeForCurrentTab();
      this.pauseBackgroundSound();
    },
    toggleBackground(){
      if (this.isBackgroundSoundPlaying) {
        this.pauseBackgroundSound();
      } else {
        this.playBackgroundSound();
      }
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
    onTimerEnd() {
      this.stopBackgroundSound();
      this.playNotificationSound();
      this.pomodorosCompleted++;
      if (this.pomodorosCompleted % this.pomodorosBeforeLongBreak === 0) {
        this.currentTab = 'longBreak';
      } else {
        this.currentTab = 'shortBreak';
      }
      this.timeLeft = this.getTimeForCurrentTab();
      this.resetTimer();
    },
    playBackgroundSound() {
      if (!this.isBackgroundSoundPlaying) {
        this.isBackgroundSoundPlaying = true;
        const audio = new Audio('/waves-14877.mp3');
        audio.loop = true;
        audio.play();
        this.backgroundSound = audio;
      }
    },
    pauseBackgroundSound() {
      if (this.isBackgroundSoundPlaying && this.backgroundSound) {
        this.isBackgroundSoundPlaying = false;
        this.backgroundSound.pause();
      }
    },
    stopBackgroundSound() {
      if (this.isBackgroundSoundPlaying && this.backgroundSound) {
        this.isBackgroundSoundPlaying = false;
        this.backgroundSound.pause();
        this.backgroundSound.currentTime = 0;
      }
    },
    playNotificationSound() {
      const audio = new Audio('/clock-alarm.mp3');
      audio.play();
    },
  },
  watch: {
    currentTab() {
      this.timeLeft = this.getTimeForCurrentTab();
      this.resetTimer();
    },
    timeLeft() {
      if (this.timeLeft === 0) {
        this.onTimerEnd();
      }
    },
  },
  mounted() {
    this.timeLeft = this.getTimeForCurrentTab();
  },
});
