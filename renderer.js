// renderer.js
const socket = io('https://vlc-sync-server.onrender.com');

// Elements
const player = document.getElementById('player');
const progressBar = document.getElementById('progressBar');
const playPauseButton = document.getElementById('customPlayPause');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const timeDisplay = document.getElementById('timeDisplay');
const chatInput = document.getElementById('chatInput');
const messagesDiv = document.getElementById('messages');
const actionLogs = document.getElementById('actionLogs');

// Modal Elements
const loginModal = document.getElementById('loginModal');
const usernameInput = document.getElementById('usernameInput');
const joinRoomInput = document.getElementById('joinRoomInput');
const generatedRoomBox = document.getElementById('generatedRoomBox');
const generatedRoomCode = document.getElementById('generatedRoomCode');

// State
let username = '';
let room = '';
let actionTimeout;

// ✨ Utility Functions
function formatTime(seconds) {
  if (!isFinite(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}
function showPlayState(isPlaying) {
  playIcon.style.display = isPlaying ? 'none' : '';
  pauseIcon.style.display = isPlaying ? '' : 'none';
}
function emitCommand(command, payload = {}) {
  socket.emit('vlc-command', { room, username, command, ...payload });
}
function showAction(msg) {
  actionLogs.textContent = msg;
  actionLogs.classList.add('visible');
  clearTimeout(actionTimeout);
  actionTimeout = setTimeout(() => actionLogs.classList.remove('visible'), 2000);
}

// ✨ Video Controls
player.addEventListener('timeupdate', () => {
  const current = player.currentTime;
  const total = player.duration || 0;
  const left = total - current;
  timeDisplay.textContent = `${formatTime(current)} / ${formatTime(total)} (-${formatTime(left)})`;
  if (player.duration) progressBar.value = (player.currentTime / player.duration) * 100;
});
progressBar.addEventListener('input', () => {
  player.currentTime = (progressBar.value / 100) * player.duration;
  emitCommand('sync', { time: player.currentTime });
  //addMessage(`Seek to ${Math.floor(player.currentTime)}s`, username, true, "log");
});
playPauseButton.onclick = () => {
  if (player.paused) {
    player.play();
    emitCommand('play');
    showPlayState(true);
    addMessage('Play', username, true, "log");
  } else {
    player.pause();
    emitCommand('pause');
    showPlayState(false);
    addMessage('Pause', username, true, "log");
  }
};
document.getElementById('customSeekBackward').onclick = () => {
  player.currentTime -= 10;
  emitCommand('seek', { direction: 'backward' });
  addMessage('Seek -10s', username, true, "log");
};
document.getElementById('customSeekForward').onclick = () => {
  player.currentTime += 10;
  emitCommand('seek', { direction: 'forward' });
  addMessage('Seek +10s', username, true, "log");
};
document.getElementById('customSyncToMe').onclick = () => {
  emitCommand('sync', { time: player.currentTime });
  addMessage(`Syncing to my time (${formatTime(player.currentTime)})`, username, true, "log");
};
document.getElementById('customSyncFromThem').onclick = () => {
  const timeStr = prompt('Sync to what time (s)?');
  if (timeStr) {
    const time = Number(timeStr);
    if (!isNaN(time)) {
      player.currentTime = time;
      emitCommand('sync', { time });
      addMessage(`Synced to ${formatTime(time)}`, username, true, "log");
    } else {
      addMessage('⚠️ Invalid time entered', username, true, "log");
    }
  }
};

// ✨ Video file load
document.getElementById('videoInput').onchange = (e) => {
  const file = e.target.files[0];
  if (file) {
    player.src = URL.createObjectURL(file);
    addMessage(`Loaded video`, username, true, "log");
  }
};

// ✨ Chat
function addMessage(msg, sender, isMine = false, type = "chat") {
  if (type === "log") {
    const logDiv = document.createElement('div');
    logDiv.classList.add('message-log');
    logDiv.textContent = msg;
    messagesDiv.appendChild(logDiv);
  } else {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container');
    if (isMine) messageContainer.classList.add('mine');

    const userCircle = document.createElement('div');
    userCircle.classList.add('user-circle');
    userCircle.textContent = sender ? sender[0].toUpperCase() : '?';

    const div = document.createElement('div');
    div.classList.add('message-bubble');
    div.textContent = msg;

    if (isMine) {
      messageContainer.appendChild(div);
      messageContainer.appendChild(userCircle);
    } else {
      messageContainer.appendChild(userCircle);
      messageContainer.appendChild(div);
    }
    messagesDiv.appendChild(messageContainer);
  }
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
function sendMessage() {
  const message = chatInput.value.trim();
  if (!message) return;
  socket.emit('chat-message', { room, username, message });
  addMessage(message, username, true);
  chatInput.value = '';
}
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});
socket.on('chat-message', (data) => addMessage(data.message, data.username, false));

// ✨ Modal login & room handling
document.getElementById('createRoomButton').onclick = () => {
  username = usernameInput.value.trim();
  if (!username) {
    addMessage('⚠️ Enter your username first!', username, true, "log");
    return;
  }
  room = 'ROOM-' + Math.random().toString(36).substring(2, 7).toUpperCase();
  generatedRoomCode.textContent = room;
  generatedRoomBox.style.display = 'flex';
};
document.getElementById('copyRoomButton').onclick = () => {
  navigator.clipboard.writeText(room).then(() => showAction(`Copied code: ${room}`));
};
document.getElementById('joinRoomButton').onclick = () => {
  username = usernameInput.value.trim();
  room = joinRoomInput.value.trim();
  if (username && room) joinRoom();
  else addMessage('⚠️ Enter username and room!', username, true, "log");
};
function joinRoom() {
  socket.emit('join-room', { room, username });
  loginModal.style.display = 'none';
}

// ✨ Handle incoming sync commands
socket.on('vlc-command', (data) => {
  switch (data.command) {
    case 'play':
      player.play();
      showPlayState(true);
      addMessage(`${data.username} pressed Play`, null, false, "log");
      break;
    case 'pause':
      player.pause();
      showPlayState(false);
      addMessage(`${data.username} pressed Pause`, null, false, "log");
      break;
    case 'seek':
      player.currentTime += data.direction === 'forward' ? 10 : -10;
      addMessage(`${data.username} Seek ${data.direction}`, null, false, "log");
      break;
    case 'sync':
      player.currentTime = Number(data.time);
      addMessage(`${data.username} synced to ${Math.floor(data.time)}s`, null, false, "log");
      break;
  }
});