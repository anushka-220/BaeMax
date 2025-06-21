# VLC Sync Remote

VLC Sync Remote is a lightweight desktop application that allows two users to control and synchronize VLC Media Player playback over the internet using a shared Socket.IO server.

## Features

- Play, pause, stop VLC playback remotely  
- Seek forward and backward in sync (+10s, -10s)  
- "Sync to Me" button to align all connected users to the same timestamp  
- Designed for long-distance use between friends, couples, or collaborators  
- Simple and modern interface built with Electron  

## Requirements

- Node.js (v18 or newer)  
- VLC Media Player (with the HTTP interface enabled)  
- macOS, Windows, or Linux  
- Internet access to connect to the shared sync server  

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/anushka-220/vlc-sync-app.git
cd vlc-sync-app
```

### 2. Install Dependencies

```bash
npm install
```

This installs Electron, Socket.IO client, Axios, and all required libraries.

### 3. Enable VLC HTTP Interface

1. Open VLC.  
2. Go to Preferences > Show All > Interface > Main Interfaces.  
3. Enable the checkbox: Web.  
4. Go to Main Interfaces > Lua.  
5. Set password as 1234.  
6. Save and restart VLC.

Note: The app connects to VLC via http://localhost:8080, so ensure no firewall or permission blocks are in place.

### 4. Run the App

```bash
npx electron .
```

This will open the VLC Sync Remote interface.

## Configuration

If your VLC Lua password is something other than `1234`, update the following line in both `preload.js` and `renderer.js`:

```js
password: 'your-password-here'
```

## Socket.IO Sync Server

This app connects to a shared sync server (hosted on Render by default). 


If you'd like to self-host the server (dont do it rn pls): 

1. Copy `server.js` from the project.  
2. Install dependencies:

```bash
npm install express socket.io
```

3. Run the server:

```bash
node server.js
```

Update the client `renderer.js` and `preload.js` with your own server URL:

```js
const socket = io('http://your-server-ip:3000');
```

## License

This project is released under the MIT License.

## Author

Originally developed by Anushka Singh. Forks and contributions welcome.
