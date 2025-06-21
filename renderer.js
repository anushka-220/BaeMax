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


const socket = io('https://vlc-sync-server.onrender.com');
const player = document.getElementById('player');
const messages = document.getElementById('messages');
const actionLogs = document.getElementById('actionLogs');

// Helper to generate a consistent color based on a string (e.g., user ID)
function stringToHslColor(str, s, l) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = hash % 360;
    return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
}

// File picker
document.getElementById('videoInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    player.src = URL.createObjectURL(file);
    showLog(`Loaded: ${file.name}`);
  }
});

// Chat
// This function now accepts 'userId' and 'isMine' to differentiate messages
function addMessage(msg, userId, isMine = false) {
  const messageContainer = document.createElement('div');
  messageContainer.classList.add('message-container');
  if (isMine) {
    messageContainer.classList.add('mine');
  }

  // Create user circle
  const userCircle = document.createElement('div');
  userCircle.classList.add('user-circle');

  let initial = 'F'; // Default for friend
  let color = stringToHslColor('friend-default', 70, 40); // Default color for friends

  if (isMine) {
    initial = 'Y'; // You
    // Use the actual socket ID for your own color to make it unique across sessions
    color = stringToHslColor(socket.id, 85, 55); // Brighter and more saturated for "You"
  } else if (userId) {
    // If a userId is provided by the server, use it to generate the color
    initial = userId.substring(0, 1).toUpperCase();
    color = stringToHslColor(userId, 70, 40);
  }

  userCircle.style.backgroundColor = color;
  userCircle.textContent = initial;

  // Create message bubble
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

  messages.appendChild(messageContainer);
  messages.scrollTop = messages.scrollHeight;
}

// Action log display
function showLog(text) {
  actionLogs.textContent = text;
  actionLogs.classList.add('visible');
  // Add a slight animation for the pop-up
  setTimeout(() => actionLogs.classList.remove('visible'), 2000); // hide after 2s
}

// Send chat message
function sendMessage() {
  const msgInput = document.getElementById('chatInput');
  const message = msgInput.value.trim();
  if (!message) return;
  // When sending, use your own socket.id (or a consistent identifier) for your message
  addMessage(message, socket.id, true);
  socket.emit('chat-message', { message });
  msgInput.value = '';
}

// Send message on Enter key
document.getElementById('chatInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

// Receive chat message
socket.on('chat-message', data => {
    // The server currently doesn't send the sender's ID.
    // For a real multi-user app, 'data' would ideally contain 'senderId'
    // For now, we'll just show a generic "Friend" message.
    addMessage(`${data.message}`, 'some-other-user-id', false); // Placeholder user ID for friends
});


// VLC commands emit helper
function emitCommand(command, payload = {}) {
  socket.emit('vlc-command', { command, ...payload });
}

// Player controls
function playVideo() {
  player.play();
  emitCommand('play');
  showLog('Play Video');
}
function pauseVideo() {
  player.pause();
  emitCommand('pause');
  showLog('Pause Video');
}
function stopVideo() {
  player.pause();
  player.currentTime = 0;
  emitCommand('stop');
  showLog('Stop Video');
}
function syncToMe() {
  emitCommand('sync', { time: player.currentTime });
  showLog(`Syncing to my time (${Math.floor(player.currentTime)}s)`);
}
function syncFromThem() {
  const timeStr = prompt('Sync to what time (seconds)?');
  if (timeStr === null || timeStr.trim() === '') {
      return; // User cancelled or entered empty
  }
  const time = Number(timeStr);
  if (!isNaN(time) && time >= 0) {
    player.currentTime = time;
    emitCommand('sync', { time });
    showLog(`Syncing to ${Math.floor(time)}s`);
  } else {
    showLog('Invalid time entered!');
  }
}
function seekForward() {
  player.currentTime += 10;
  emitCommand('seek', { direction: 'forward' });
  showLog('Seek Forward (+10s)');
}
function seekBackward() {
  player.currentTime -= 10;
  emitCommand('seek', { direction: 'backward' });
  showLog('Seek Backward (-10s)');
}
// Chat functions — make sure this matches your client HTML
function addMessage(msg, isMine = false) {
  const div = document.createElement('div');
  div.classList.add('message');
  if (isMine) div.classList.add('mine'); // align to right
  div.textContent = msg;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

// Send message handler
function sendMessage() {
  const chatInput = document.getElementById('chatInput');
  const text = chatInput.value.trim();
  if (!text) return;
  addMessage(`You: ${text}`, true);      // show your message locally
  socket.emit('chat-message', { message: text }); // emit to server
  chatInput.value = '';
}

// Listen for incoming chat messages
socket.on('chat-message', (data) => {
  addMessage(`Friend: ${data.message}`); // show remote user’s message
});

// Allow Enter key to send
document.getElementById('chatInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// Expose the sendMessage to the global scope so the `onclick` works
window.sendMessage = sendMessage;
// Listen to remote commands
socket.on('vlc-command', data => {
  switch (data.command) {
    case 'play':
      player.play();
      showLog('Remote Play Received');
      break;
    case 'pause':
      player.pause();
      showLog('Remote Pause Received');
      break;
    case 'stop':
      player.pause();
      player.currentTime = 0;
      showLog('Remote Stop Received');
      break;
    case 'sync':
      const syncTime = Number(data.time);
      if (!isNaN(syncTime) && syncTime >= 0) {
        player.currentTime = syncTime;
        showLog(`Remote Sync to ${Math.floor(syncTime)}s`);
      }
      break;
    case 'seek':
      const seekAmount = data.direction === 'forward' ? 10 : -10;
      player.currentTime += seekAmount;
      showLog(`Remote Seek ${data.direction === 'forward' ? '+' : ''}${seekAmount}s`);
      break;
  }
});
