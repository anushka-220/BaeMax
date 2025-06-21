// const { contextBridge } = require('electron');
// const axios = require('axios');
// const { io } = require('socket.io-client');

// // 🔌 Connect to the sync server
// //const socket = io('http://localhost:3000');
// const socket = io('https://vlc-sync-server.onrender.com');

// // ✅ VLC Web Interface credentials
// const VLC_URL = 'http://localhost:8080/requests/status.xml';
// const AUTH = {
//   auth: {
//     username: '',
//     password: '1234' // 🔐 your actual Lua password
//   }
// };
// // preload.js
// const { contextBridge } = require('electron');
// contextBridge.exposeInMainWorld('appAPI', {
//   resizeVLC
// });
// // 👉 Utility to send command to VLC
// async function sendCommand(command) {
//   try {
//     await axios.get(`${VLC_URL}?command=${command}`, AUTH);
//     console.log(`✅ VLC command executed: ${command}`);
//   } catch (error) {
//     console.error(`❌ Failed VLC command (${command}):`, error.message);
//   }
// }

// // 👉 Utility to emit command to other clients
// function emit(command, payload = {}) {
//   socket.emit('vlc-command', { command, ...payload });
// }

// // 🎮 Exposed VLC control functions
// async function play() {
//   await sendCommand('pl_play');
//   emit('play');
// }

// async function pause() {
//   await sendCommand('pl_pause');
//   emit('pause');
// }

// async function stop() {
//   await sendCommand('pl_stop');
//   emit('stop');
// }

// async function seekForward() {
//   await sendCommand('seek&val=%2B10'); // +10 seconds
//   emit('seek', { direction: 'forward' });
// }

// async function seekBackward() {
//   await sendCommand('seek&val=-10'); // -10 seconds
//   emit('seek', { direction: 'backward' });
// }

// async function syncToMe() {
//   try {
//     const response = await axios.get(VLC_URL, AUTH);
//     const parser = new DOMParser();
//     const xml = parser.parseFromString(response.data, "text/xml");
//     const time = xml.getElementsByTagName('time')[0]?.textContent;

//     if (time) {
//       console.log(`🔁 Sending sync command to ${time}s`);
//       emit('sync', { time });
//     } else {
//       console.error('❌ VLC time not found in XML');
//     }
//   } catch (error) {
//     console.error('❌ Sync fetch failed:', error.message);
//   }
// }

// // 🔄 Handle incoming sync commands from other clients
// socket.on('vlc-command', async (data) => {
//   console.log(`📥 Received command from other user:`, data);

//   try {
//     switch (data.command) {
//       case 'play':
//         await sendCommand('pl_play');
//         break;
//       case 'pause':
//         await sendCommand('pl_pause');
//         break;
//       case 'stop':
//         await sendCommand('pl_stop');
//         break;
//       case 'seek':
//         if (data.direction === 'forward') {
//           await sendCommand('seek&val=%2B10');
//         } else if (data.direction === 'backward') {
//           await sendCommand('seek&val=-10');
//         }
//         break;
//       case 'sync':
//         if (data.time) {
//           await sendCommand(`seek&val=${data.time}`);
//         }
//         break;
//       default:
//         console.warn(`⚠️ Unknown command received: ${data.command}`);
//     }
//   } catch (err) {
//     console.error(`❌ Failed to handle incoming '${data.command}':`, err.message);
//   }
// });

// // ✅ Expose all controls to the renderer
// contextBridge.exposeInMainWorld('vlcAPI', {
//   play,
//   pause,
//   stop,
//   seekForward,
//   seekBackward,
//   sync: syncToMe
// });

// // 🧪 Debug connection
// socket.on('connect', () => {
//   console.log('🔌 Connected to sync server with ID:', socket.id);
// });


const { contextBridge } = require('electron');
const { io } = require('socket.io-client');

// 🔌 Connect to your sync server
const socket = io('https://vlc-sync-server.onrender.com');

// 📢 Emit sync command
function emitCommand(command, payload = {}) {
  socket.emit('vlc-command', { command, ...payload });
}

// 📥 Handle incoming commands
socket.on('vlc-command', (data) => {
  window.postMessage({ type: 'sync-command', data }, '*'); // forward to renderer
});

socket.on('connect', () => {
  console.log('✅ Connected to sync server:', socket.id);
});

// ✅ Expose emitCommand
contextBridge.exposeInMainWorld('syncAPI', { emitCommand });