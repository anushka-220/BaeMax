// let currentRoom= null;
// function joinRoom() {
//   const input = document.getElementById('roomInput').value.trim();
//   if (!input) {
//     alert('Please enter a valid room code.');
//     return;
//   }

//   currentRoom = input;
//   socket.emit('join-room', input);
//   document.getElementById('roomStatus').textContent = `Joined room: ${input}`;
// }

// const socket = io('https://vlc-sync-server.onrender.com');
// const VLC_URL = 'http://localhost:8080/requests/status.xml';
// const AUTH = {
//   auth: {
//     username: '',
//     password: '1234' // your VLC Lua password
//   }
// };

// // Helper: send a command to VLC
// async function sendCommand(command) {
//   try {
//     await axios.get(`${VLC_URL}?command=${command}`, AUTH);
//     console.log(`Local VLC command sent: ${command}`);
//   } catch (err) {
//     console.error(`Failed VLC command '${command}':`, err);
//   }
// }

// // Helper: emit a command to other users
// function emit(command, payload = {}) {
//   socket.emit('vlc-command', { command, ...payload });
// }

// // 🔘 Playback control functions

// async function playVLC() {
//   await sendCommand('pl_play');
//   emit('play');
// }

// async function pauseVLC() {
//   await sendCommand('pl_pause');
//   emit('pause');
// }

// async function stopVLC() {
//   await sendCommand('pl_stop');
//   emit('stop');
// }

// async function seekForward() {
//   await sendCommand('seek&val=%2B10');
//   emit('seek', { direction: 'forward' });
// }

// async function seekBackward() {
//   await sendCommand('seek&val=-10');
//   emit('seek', { direction: 'backward' });
// }

// async function syncToMe() {
//   try {
//     const response = await axios.get(VLC_URL, AUTH);
//     const parser = new DOMParser();
//     const xml = parser.parseFromString(response.data, "text/xml");
//     const time = xml.getElementsByTagName('time')[0]?.textContent;

//     if (time) {
//       console.log(`Syncing others to time: ${time}s`);
//       emit('sync', { time });
//     } else {
//       console.error('Could not read VLC time');
//     }
//   } catch (err) {
//     console.error('Sync fetch failed:', err);
//   }
// }
// // renderer.js
// async function fullscreenVLC() {
//   await axios.get('http://localhost:8080/requests/status.xml?command=fullscreen', AUTH);
// }

// // 🔄 Handle incoming commands
// socket.on('vlc-command', async (data) => {
//   try {
//     switch (data.command) {
//       case 'play':
//         await sendCommand('pl_play');
//         console.log('Remote VLC played');
//         break;
//       case 'pause':
//         await sendCommand('pl_pause');
//         console.log('Remote VLC paused');
//         break;
//       case 'stop':
//         await sendCommand('pl_stop');
//         console.log('Remote VLC stopped');
//         break;
//       case 'seek':
//         if (data.direction === 'forward') {
//           await sendCommand('seek&val=%2B10');
//           console.log('Remote VLC seeked forward');
//         } else if (data.direction === 'backward') {
//           await sendCommand('seek&val=-10');
//           console.log('Remote VLC seeked backward');
//         }
//         break;
//       case 'sync':
//         if (data.time) {
//           await sendCommand(`seek&val=${data.time}`);
//           console.log(`🔁 Remote VLC synced to ${data.time}s`);
//         }
//         break;
//       default:
//         console.warn('Unknown command received:', data);
//     }
//   } catch (error) {
//     console.error(`Failed to handle remote command '${data.command}':`, error);
//   }
// });

// // Expose all control functions to HTML
// window.vlcAPI = {
//   play: playVLC,
//   pause: pauseVLC,
//   stop: stopVLC,
//   seekForward,
//   seekBackward,
//   sync: syncToMe
// };

// // Debug: connection check
// socket.on('connect', () => {
//   console.log('Connected to sync server with ID:', socket.id);
// });
// // Sync to Them - manually enter the time you want to jump to
// function syncFromThem() {
//   const time = prompt('Enter time in seconds to sync to (e.g. 120):');
//   if (time) {
//     sendCommand(`seek&val=${time}`);
//     emit('sync', { time }); // also emit so everyone stays in sync
//     console.log(`🔄 Syncing to ${time}s as requested`);
//   }
// }

// // Attach to global scope
// window.vlcAPI.syncFromThem = syncFromThem;

// // Chat functions
// function sendMessage() {
//   const input = document.getElementById('chatInput');
//   const message = input.value.trim();
//   if (!message) return;

//   socket.emit('chat-message', { message }); // emit to server
//   addMessage(`You: ${message}`); // show my own message immediately
//   input.value = '';
// }

// // Append a message to the chat container
// function addMessage(msg) {
//   const messagesDiv = document.getElementById('messages');
//   const div = document.createElement('div');
//   div.textContent = msg;
//   messagesDiv.appendChild(div);
//   messagesDiv.scrollTop = messagesDiv.scrollHeight;
// }
// window.sendMessage = sendMessage;
// window.vlcAPI.fullscreen = fullscreenVLC;
// // Listen for incoming messages
// socket.on('chat-message', (data) => {
//   addMessage(`Friend: ${data.message}`);
// });



// const socket = io('https://vlc-sync-server.onrender.com');
// const player = document.getElementById('player');

// // Video file loader
// const videoInput = document.getElementById('videoInput');
// videoInput.addEventListener('change', () => {
//   const file = videoInput.files[0];
//   if (file) {
//     player.src = URL.createObjectURL(file);
//     videoInput.classList.add('hidden'); // hide file chooser after selection
//     addMessage(`Loaded video: ${file.name}`);
//   }
// });

// // Chat handling
// function addMessage(msg) {
//   const div = document.createElement('div');
//   div.textContent = msg;
//   document.getElementById('messages').appendChild(div);
//   div.scrollIntoView();
// }
// function sendMessage() {
//   const input = document.getElementById('chatInput');
//   const message = input.value.trim();
//   if (!message) return;
//   socket.emit('chat-message', { message });
//   addMessage(`You: ${message}`);
//   input.value = '';
// }
// socket.on('chat-message', (data) => addMessage(`Friend: ${data.message}`));
// window.sendMessage = sendMessage;

// // Sync & seek commands
// function emitCommand(command, payload={}) {
//   socket.emit('vlc-command', { command, ...payload });
// }
// function syncToMe() {
//   emitCommand('sync', { time: player.currentTime });
//   addMessage(`Syncing to my time (${Math.round(player.currentTime)}s)`);
// }
// function syncFromThem() {
//   const time = prompt('Sync to what time (s)?');
//   if (time) {
//     player.currentTime = Number(time);
//     emitCommand('sync', { time });
//     addMessage(`Synced to ${time}s`);
//   }
// }
// function seekForward() {
//   player.currentTime += 10;
//   emitCommand('seek', { direction: 'forward' });
//   addMessage('Seek +10s');
// }
// function seekBackward() {
//   player.currentTime -= 10;
//   emitCommand('seek', { direction: 'backward' });
//   addMessage('Seek -10s');
// }
// function playVideo() {
//   player.play();
//   emitCommand('play');
//   addMessage('Play');
// }
// function pauseVideo() {
//   player.pause();
//   emitCommand('pause');
//   addMessage('Pause');
// }
// function stopVideo() {
//   player.pause();
//   player.currentTime = 0;
//   emitCommand('stop');
//   addMessage('Stop');
// }

// // Expose them globally if you want to call them from HTML
// window.playVideo = playVideo;
// window.pauseVideo = pauseVideo;
// window.stopVideo = stopVideo;

// // 🔄 Listen for incoming play/pause/stop
// socket.on('vlc-command', (data) => {
//   switch(data.command) {
//     case 'play':
//       player.play();
//       addMessage('Remote play');
//       break;
//     case 'pause':
//       player.pause();
//       addMessage('Remote pause');
//       break;
//     case 'stop':
//       player.pause();
//       player.currentTime = 0;
//       addMessage('Remote stop');
//       break;
//     case 'sync':
//       player.currentTime = Number(data.time);
//       addMessage(`Remote synced to ${data.time}s`);
//       break;
//     case 'seek':
//       player.currentTime += data.direction === 'forward' ? 10 : -10;
//       addMessage(`Remote seek ${data.direction}`);
//       break;
//   }
// });
// window.syncToMe = syncToMe;
// window.syncFromThem = syncFromThem;
// window.seekForward = seekForward;
// window.seekBackward = seekBackward;

// // Handle incoming commands
// socket.on('vlc-command', (data) => {
//   switch (data.command) {
//     case 'sync':
//       player.currentTime = Number(data.time);
//       addMessage(`Remote synced to ${data.time}s`);
//       break;
//     case 'seek':
//       player.currentTime += data.direction === 'forward' ? 10 : -10;
//       addMessage(`Remote seek ${data.direction}`);
//       break;
//   }
// });





// const socket = io('https://vlc-sync-server.onrender.com');

// // Elements
// const player = document.getElementById('player');
// const progressBar = document.getElementById('progressBar');
// const playPauseButton = document.getElementById('customPlayPause');
// const playIcon = document.getElementById('playIcon');
// const pauseIcon = document.getElementById('pauseIcon');
// const timeDisplay = document.getElementById('timeDisplay');
// const chatInput = document.getElementById('chatInput');
// const messagesDiv = document.getElementById('messages');

// // --- Utility Functions ---

// function formatTime(seconds) {
//   if (!isFinite(seconds)) return "00:00";
//   const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
//   const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
//   return `${mins}:${secs}`;
// }

// function emitCommand(command, payload = {}) {
//   socket.emit('vlc-command', { command, ...payload });
// }

// // --- Video Player Events ---

// player.addEventListener('timeupdate', () => {
//   const current = player.currentTime;
//   const total = player.duration || 0;
//   const left = total - current;
//   timeDisplay.textContent = `${formatTime(current)} / ${formatTime(total)} (-${formatTime(left)})`;

//   if (player.duration) {
//     progressBar.value = (player.currentTime / player.duration) * 100;
//   }
// });

// progressBar.addEventListener('input', () => {
//   player.currentTime = (progressBar.value / 100) * player.duration;
//   emitCommand('sync', { time: player.currentTime });
//   addMessage(`Seek to ${Math.floor(player.currentTime)}s`, null, true);
// });

// playPauseButton.addEventListener('click', () => {
//   if (player.paused) {
//     player.play();
//     emitCommand('play');
//     showPlayState(true);
//     addMessage('Play', null, true);
//   } else {
//     player.pause();
//     emitCommand('pause');
//     showPlayState(false);
//     addMessage('Pause', null, true);
//   }
// });

// function showPlayState(isPlaying) {
//   playIcon.style.display = isPlaying ? 'none' : '';
//   pauseIcon.style.display = isPlaying ? '' : 'none';
// }

// document.getElementById('customSeekForward').addEventListener('click', () => {
//   player.currentTime += 10;
//   emitCommand('seek', { direction: 'forward' });
//   addMessage('Seek +10s', null, true);
// });

// document.getElementById('customSeekBackward').addEventListener('click', () => {
//   player.currentTime -= 10;
//   emitCommand('seek', { direction: 'backward' });
//   addMessage('Seek -10s', null, true);
// });

// document.getElementById('customSyncToMe').addEventListener('click', () => {
//   emitCommand('sync', { time: player.currentTime });
//   addMessage(`Syncing to my time (${Math.floor(player.currentTime)}s)`, null, true);
// });

// document.getElementById('customSyncFromThem').addEventListener('click', () => {
//   const timeStr = prompt('Sync to what time (s)?');
//   if (timeStr) {
//     const time = Number(timeStr);
//     if (!isNaN(time)) {
//       player.currentTime = time;
//       emitCommand('sync', { time });
//       addMessage(`Synced to ${formatTime(time)}`, null, true);
//     } else {
//       addMessage(`⚠️ Invalid time entered`, null, true);
//     }
//   }
// });

// // --- Video File Loader ---

// document.getElementById('videoInput').addEventListener('change', (e) => {
//   const file = e.target.files[0];
//   if (file) {
//     player.src = URL.createObjectURL(file);
//     addMessage(`Loaded video: ${file.name}`, null, true);
//   }
// });

// // --- Chat ---

// function addMessage(msg, userId = null, isMine = false, type = "chat") {
//   if (type === "log") {
//     const logDiv = document.createElement('div');
//     const initial = senderName ? senderName[0].toUpperCase() : '?';

//     logDiv.classList.add('message-log');
//     logDiv.textContent = msg;
//     messagesDiv.appendChild(logDiv);
//   } else {
//     const messageContainer = document.createElement('div');
//     messageContainer.classList.add('message-container');
//     if (isMine) messageContainer.classList.add('mine');

//     const userCircle = document.createElement('div');
//     userCircle.classList.add('user-circle');
//     userCircle.textContent = isMine ? 'Y' : (userId ? userId[0].toUpperCase() : 'F');

//     const div = document.createElement('div');
//     div.classList.add('message-bubble');
//     div.textContent = msg;

//     if (isMine) {
//       messageContainer.appendChild(div);
//       messageContainer.appendChild(userCircle);
//     } else {
//       messageContainer.appendChild(userCircle);
//       messageContainer.appendChild(div);
//     }

//     messagesDiv.appendChild(messageContainer);
//   }
//   messagesDiv.scrollTop = messagesDiv.scrollHeight;
// }

// // Sending chat
// function sendMessage() {
//   const message = chatInput.value.trim();
//   if (!message) return;
//   socket.emit('chat-message', { room, username, message });
//   addMessage(message, username, true); // local
//   chatInput.value = '';
// }

// chatInput.addEventListener('keydown', (e) => {
//   if (e.key === 'Enter') sendMessage();
// });

// socket.on('chat-message', data => {
//   addMessage(data.message, data.username, false); 
// });
// // ---HANDLE ROOM AND USER INPUT---
// let username = '';
// let room = '';

// const loginModal = document.getElementById('loginModal');
// document.getElementById('createRoomButton').onclick = () => {
//   username = document.getElementById('usernameInput').value.trim();
//   room = document.getElementById('createRoomInput').value.trim();
//   if (username && room) {
//     joinRoom();
//   }
// };

// document.getElementById('joinRoomButton').onclick = () => {
//   username = document.getElementById('usernameInput').value.trim();
//   room = document.getElementById('joinRoomInput').value.trim();
//   if (username && room) {
//     joinRoom();
//   }
// };

// function joinRoom() {
//   socket.emit('join-room', { room, username });
//   loginModal.style.display = 'none'; // hide modal
// }

// // --- Socket Events ---

// socket.on('vlc-command', (data) => {
//   switch (data.command) {
//     case 'play':
//       player.play();
//       showPlayState(true);
//       addMessage('Remote Play', null, false);
//       break;
//     case 'pause':
//       player.pause();
//       showPlayState(false);
//       addMessage('Remote Pause', null, false);
//       break;
//     case 'stop':
//       player.pause();
//       player.currentTime = 0;
//       showPlayState(false);
//       addMessage('Remote Stop', null, false);
//       break;
//     case 'seek':
//       player.currentTime += data.direction === 'forward' ? 10 : -10;
//       addMessage(`Remote Seek ${data.direction}`, null, false);
//       break;
//     case 'sync':
//       player.currentTime = Number(data.time);
//       addMessage(`Remote Sync to ${Math.floor(data.time)}s`, null, false, "log");
//       break;
//   }
// });
// const socket = io('https://vlc-sync-server.onrender.com');

// // Elements
// const player = document.getElementById('player');
// const progressBar = document.getElementById('progressBar');
// const playPauseButton = document.getElementById('customPlayPause');
// const playIcon = document.getElementById('playIcon');
// const pauseIcon = document.getElementById('pauseIcon');
// const timeDisplay = document.getElementById('timeDisplay');
// const chatInput = document.getElementById('chatInput');
// const messagesDiv = document.getElementById('messages');
// const generatedRoomBox = document.getElementById('generatedRoomBox');
// const generatedRoomCode = document.getElementById('generatedRoomCode');
// const copyRoomButton = document.getElementById('copyRoomButton');


// // Room & User
// let username = '';
// let room = '';

// // Modal login overlay
// const loginModal = document.getElementById('loginModal');

// // Utility
// function formatTime(seconds) {
//   if (!isFinite(seconds)) return "00:00";
//   const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
//   const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
//   return `${mins}:${secs}`;
// }

// // Emit VLC command to the room
// function emitCommand(command, payload = {}) {
//   socket.emit('vlc-command', { room, username, command, ...payload });
// }

// // Message helper
// function addMessage(msg, sender, isMine = false, type = "chat") {
//   if (type === "log") {
//     const logDiv = document.createElement('div');
//     logDiv.classList.add('message-log');
//     logDiv.textContent = msg;
//     messagesDiv.appendChild(logDiv);
//   } else {
//     const messageContainer = document.createElement('div');
//     messageContainer.classList.add('message-container');
//     if (isMine) messageContainer.classList.add('mine');

//     const userCircle = document.createElement('div');
//     userCircle.classList.add('user-circle');
//     userCircle.textContent = sender ? sender[0].toUpperCase() : '?';

//     const div = document.createElement('div');
//     div.classList.add('message-bubble');
//     div.textContent = msg;

//     if (isMine) {
//       messageContainer.appendChild(div);
//       messageContainer.appendChild(userCircle);
//     } else {
//       messageContainer.appendChild(userCircle);
//       messageContainer.appendChild(div);
//     }

//     messagesDiv.appendChild(messageContainer);
//   }
//   messagesDiv.scrollTop = messagesDiv.scrollHeight;
// }

// // Video player event handling
// player.addEventListener('timeupdate', () => {
//   const current = player.currentTime;
//   const total = player.duration || 0;
//   const left = total - current;
//   timeDisplay.textContent = `${formatTime(current)} / ${formatTime(total)} (-${formatTime(left)})`;
//   if (player.duration) {
//     progressBar.value = (player.currentTime / player.duration) * 100;
//   }
// });

// progressBar.addEventListener('input', () => {
//   player.currentTime = (progressBar.value / 100) * player.duration;
//   emitCommand('sync', { time: player.currentTime });
//   addMessage(`Seek to ${Math.floor(player.currentTime)}s`, username, true, "log");
// });

// playPauseButton.addEventListener('click', () => {
//   if (player.paused) {
//     player.play();
//     emitCommand('play');
//     showPlayState(true);
//     addMessage('Play', username, true, "log");
//   } else {
//     player.pause();
//     emitCommand('pause');
//     showPlayState(false);
//     addMessage('Pause', username, true, "log");
//   }
// });

// function showPlayState(isPlaying) {
//   playIcon.style.display = isPlaying ? 'none' : '';
//   pauseIcon.style.display = isPlaying ? '' : 'none';
// }

// // Seek Controls
// document.getElementById('customSeekForward').onclick = () => {
//   player.currentTime += 10;
//   emitCommand('seek', { direction: 'forward' });
//   addMessage('Seek +10s', username, true, "log");
// };
// document.getElementById('customSeekBackward').onclick = () => {
//   player.currentTime -= 10;
//   emitCommand('seek', { direction: 'backward' });
//   addMessage('Seek -10s', username, true, "log");
// };

// // Sync Controls
// document.getElementById('customSyncToMe').onclick = () => {
//   emitCommand('sync', { time: player.currentTime });
//   addMessage(`Syncing to my time (${Math.floor(player.currentTime)}s)`, username, true, "log");
// };
// document.getElementById('customSyncFromThem').onclick = () => {
//   const timeStr = prompt('Sync to what time (s)?');
//   if (timeStr) {
//     const time = Number(timeStr);
//     if (!isNaN(time)) {
//       player.currentTime = time;
//       emitCommand('sync', { time });
//       addMessage(`Synced to ${formatTime(time)}`, username, true, "log");
//     } else {
//       addMessage('⚠️ Invalid time entered', username, true, "log");
//     }
//   }
// };

// // Chat
// function sendMessage() {
//   const message = chatInput.value.trim();
//   if (!message) return;
//   socket.emit('chat-message', { room, username, message });
//   addMessage(message, username, true);
//   chatInput.value = '';
// }
// chatInput.addEventListener('keydown', (e) => {
//   if (e.key === 'Enter') sendMessage();
// });

// socket.on('chat-message', data => {
//   addMessage(data.message, data.username, false); 
// });

// // Login/Room selection
// document.getElementById('createRoomButton').onclick = () => {
//   username = document.getElementById('usernameInput').value.trim();
//   if (!username) {
//     addMessage('⚠️ Enter a username first!', username, true, "log");
//     return;
//   }
//   // Generate a short alphanumeric room code
//   room = 'ROOM-' + Math.random().toString(36).substring(2, 7).toUpperCase();
//   generatedRoomCode.textContent = room;
//   generatedRoomBox.style.display = 'flex';
// };

// // Copy Room
// copyRoomButton.onclick = () => {
//   navigator.clipboard.writeText(room).then(() => {
//     addMessage(`Copied room code: ${room}`, username, true, "log");
//   });
// };
// document.getElementById('joinRoomButton').onclick = () => {
//   username = document.getElementById('usernameInput').value.trim();
//   room = document.getElementById('joinRoomInput').value.trim();
//   if (username && room) joinRoom();
// };
// document.getElementById('videoInput').addEventListener('change', (e) => {
//   const file = e.target.files[0];
//   if (file) {
//     player.src = URL.createObjectURL(file);  // set source
//     player.load();
//     player.play().catch(() => {
//       addMessage('Video loaded. Click Play to begin.', username, true, "log");
//     });
//   }
// });

// function joinRoom() {
//   socket.emit('join-room', { room, username });
//   loginModal.style.display = 'none';
// }

// // Incoming VLC commands
// socket.on('vlc-command', (data) => {
//   switch (data.command) {
//     case 'play':
//       player.play();
//       showPlayState(true);
//       addMessage(`${data.username} pressed Play`, null, false, "log");
//       break;
//     case 'pause':
//       player.pause();
//       showPlayState(false);
//       addMessage(`${data.username} pressed Pause`, null, false, "log");
//       break;
//     case 'stop':
//       player.pause();
//       player.currentTime = 0;
//       showPlayState(false);
//       addMessage(`${data.username} pressed Stop`, null, false, "log");
//       break;
//     case 'seek':
//       player.currentTime += data.direction === 'forward' ? 10 : -10;
//       addMessage(`${data.username} Seek ${data.direction}`, null, false, "log");
//       break;
//     case 'sync':
//       player.currentTime = Number(data.time);
//       addMessage(`${data.username} synced to ${Math.floor(data.time)}s`, null, false, "log");
//       break;
//   }
// });