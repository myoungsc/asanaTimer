import { BrowserWindow } from 'electron';

const Bluebird = require('bluebird');
const storage = Bluebird.promisifyAll(require('electron-json-storage'));

export const getToken = () => {
  const data = storage.getSync('token');
  return `${data.deviceToken}`;
};

export const getAsyncToken = () => {
  storage.get('token', function (error: Error, data: any) {
    if (error) throw error;

    const msgTemplate = (token: string) => `${token}`;
    BrowserWindow.getFocusedWindow()?.webContents.send(
      'completeGetDeviceToken',
      msgTemplate(data.deviceToken)
    );
  });
};

export const getUserInfo = () => {
  const userInfo = storage.getSync('userInfo');
  const strUserInfo = JSON.stringify(userInfo);
  const msgTemplate = (data: string) => `${data}`;
  BrowserWindow.getFocusedWindow()?.webContents.send(
    'completeGetUserInfo',
    msgTemplate(strUserInfo)
  );
};

export const setUserToken = (token: string) => {
  storage.set('token', { deviceToken: token }, function (error: Error) {
    if (error) {
      throw error;
    }
  });
};

export const clearDeviceTokenInfo = () => {
  storage.clear(function (error: Error) {
    if (error) throw error;
    const msgTemplate = (data: string) => `${data}`;
    BrowserWindow.getFocusedWindow()?.webContents.send(
      'completeClearDeviceToken',
      msgTemplate('')
    );
  });
};

export const setUserInfo = (userInfo: JSON) => {
  storage.set('userInfo', userInfo, function (error: Error) {
    if (error) {
      throw error;
    }
    const msgTemplate = (data: string) => `${data}`;
    BrowserWindow.getFocusedWindow()?.webContents.send(
      'completeSetUserInfo',
      msgTemplate('')
    );
  });
};
