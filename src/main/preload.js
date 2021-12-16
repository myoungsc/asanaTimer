const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    renderSetDeviceToken(token) {
      ipcRenderer.send('renderSetDeviceToken', token);
    },
    renderSetUserInfo(json) {
      ipcRenderer.send('renderSetUserInfo', json);
    },
    renderSetOrUpdateTaskList(json) {
      ipcRenderer.send('renderSetOrUpdateTaskList', json);
    },
    renderUpdateTaskTime(gid, taskContent) {
      ipcRenderer.send('renderUpdateTaskTime', gid, taskContent);
    },
    renderGetDeviceToken() {
      console.log('renderGetDeviceToken');
      ipcRenderer.send('getDeviceToken', '');
    },
    renderGetUserInfo() {
      ipcRenderer.send('getUserInfo', '');
    },
    renderClearDeviceToken() {
      ipcRenderer.send('celarDeviceToken', '');
    },
    renderRemoveEvent(eventName) {
      console.log('remove Render', eventName);
      ipcRenderer.removeAllListeners(eventName);
    },
    on(channel, func) {
      console.log('channel', channel);
      const validChannels = [
        'ipc-example',
        'completeSetDeviceToken',
        'completeSetUserInfo',
        'completeSetTaskList',
        'completeGetDeviceToken',
        'completeClearDeviceToken',
        'completeGetUserInfo',
      ];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        if (channel === 'ipc-example') {
          ipcRenderer.on(channel, (event, ...args) => func(...args));
        } else if (channel === 'completeSetDeviceToken') {
          ipcRenderer.on(channel, (event, ...args) => func(...args));
        } else if (channel === 'completeGetDeviceToken') {
          ipcRenderer.on(channel, (event, ...args) => func(...args));
        } else if (channel === 'completeClearDeviceToken') {
          ipcRenderer.on(channel, (event, ...args) => func(...args));
        } else if (channel === 'completeSetUserInfo') {
          ipcRenderer.on(channel, (event, ...args) => func(...args));
        } else if (channel === 'completeGetUserInfo') {
          ipcRenderer.on(channel, (event, ...args) => func(...args));
        } else if (channel === 'completeSetTaskList') {
          ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
      }
    },
  },
});
