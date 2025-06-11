let currentRoom= null;
function joinRoom() {
  const input = document.getElementById('roomInput').value.trim();
  if (!input) {
    alert('Please enter a valid room code.');
    return;
  }

  currentRoom = input;
  socket.emit('join-room', input);
  document.getElementById('roomStatus').textContent = `Joined room: ${input}`;
}

const socket = io('https://vlc-sync-server.onrender.com');
const VLC_URL = 'http://localhost:8080/requests/status.xml';
const AUTH = {
  auth: {
    username: '',
    password: '1234' // your VLC Lua password
  }
};

// Helper: send a command to VLC
async function sendCommand(command) {
  try {
    await axios.get(`${VLC_URL}?command=${command}`, AUTH);
    console.log(`Local VLC command sent: ${command}`);
  } catch (err) {
    console.error(`Failed VLC command '${command}':`, err);
  }
}

// Helper: emit a command to other users
function emit(command, payload = {}) {
  socket.emit('vlc-command', { command, ...payload });
}

// 🔘 Playback control functions

async function playVLC() {
  await sendCommand('pl_play');
  emit('play');
}

async function pauseVLC() {
  await sendCommand('pl_pause');
  emit('pause');
}

async function stopVLC() {
  await sendCommand('pl_stop');
  emit('stop');
}

async function seekForward() {
  await sendCommand('seek&val=%2B10');
  emit('seek', { direction: 'forward' });
}

async function seekBackward() {
  await sendCommand('seek&val=-10');
  emit('seek', { direction: 'backward' });
}

async function syncToMe() {
  try {
    const response = await axios.get(VLC_URL, AUTH);
    const parser = new DOMParser();
    const xml = parser.parseFromString(response.data, "text/xml");
    const time = xml.getElementsByTagName('time')[0]?.textContent;

    if (time) {
      console.log(`Syncing others to time: ${time}s`);
      emit('sync', { time });
    } else {
      console.error('Could not read VLC time');
    }
  } catch (err) {
    console.error('Sync fetch failed:', err);
  }
}

// 🔄 Handle incoming commands
socket.on('vlc-command', async (data) => {
  try {
    switch (data.command) {
      case 'play':
        await sendCommand('pl_play');
        console.log('Remote VLC played');
        break;
      case 'pause':
        await sendCommand('pl_pause');
        console.log('Remote VLC paused');
        break;
      case 'stop':
        await sendCommand('pl_stop');
        console.log('Remote VLC stopped');
        break;
      case 'seek':
        if (data.direction === 'forward') {
          await sendCommand('seek&val=%2B10');
          console.log('Remote VLC seeked forward');
        } else if (data.direction === 'backward') {
          await sendCommand('seek&val=-10');
          console.log('Remote VLC seeked backward');
        }
        break;
      case 'sync':
        if (data.time) {
          await sendCommand(`seek&val=${data.time}`);
          console.log(`🔁 Remote VLC synced to ${data.time}s`);
        }
        break;
      default:
        console.warn('Unknown command received:', data);
    }
  } catch (error) {
    console.error(`Failed to handle remote command '${data.command}':`, error);
  }
});

// Expose all control functions to HTML
window.vlcAPI = {
  play: playVLC,
  pause: pauseVLC,
  stop: stopVLC,
  seekForward,
  seekBackward,
  sync: syncToMe
};

// Debug: connection check
socket.on('connect', () => {
  console.log('Connected to sync server with ID:', socket.id);
});
