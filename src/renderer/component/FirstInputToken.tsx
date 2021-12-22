/* eslint-disable no-alert */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useHistory } from 'react-router-dom';
import { LoadingAnimation } from './LoadingAnimation';
import { useState } from 'react';
import '../css/FirstInputToken.css';
import { version } from '../../../release/app/package.json';

declare global {
  interface Window {
    electron: any;
  }
}

const FirstInputToken = () => {
  const history = useHistory();
  const [isFirstEvent, setIsFirstEvent] = useState<boolean>(false);
  const [deviceToken, setDeviceToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const authToken = async (token: string) => {
    setIsLoading(true);
    const response = await fetch('https://app.asana.com/api/1.0/users/me', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    setIsLoading(false);
    if (response.status === 200) {
      const data = await response.json();
      const userInfo = { userInfo: data.data };
      window.electron.ipcRenderer.renderSetDeviceToken(token);
      window.electron.ipcRenderer.renderSetUserInfo(userInfo);
      window.electron.ipcRenderer.renderRemoveEvent('completeGetDeviceToken');
      history.push('/taskList');
    } else {
      alert('올바른 토큰을 입력해주세요.');
    }
  };

  const moveToTaskList = () => {
    authToken(deviceToken);
  };

  const moveToHelp = () => {};

  const inputToken = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeviceToken(e.target.value);
  };

  if (!isFirstEvent) {
    setTimeout(() => {
      window.electron.ipcRenderer.on(
        'completeGetDeviceToken',
        (arg: string) => {
          if (!(arg === null || arg === 'undefined')) {
            authToken(arg);
          }
        }
      );

      window.electron.ipcRenderer.renderGetDeviceToken();
    }, 100);
    setIsFirstEvent(true);
  }

  return (
    <div className="FirstInputToken">
      {isLoading ? <LoadingAnimation /> : null}
      <input
        className="FirstInputToken-inputBox"
        name="name"
        placeholder="디바이스 토큰"
        value={deviceToken}
        onChange={inputToken}
      />
      <button
        className="FirstInputToken-inputButton"
        type="button"
        onClick={moveToTaskList}
      >
        디바이스토큰 등록
      </button>
      <label className="label-version">v{version}</label>
      <button
        className="FirstInputToken-help"
        type="button"
        onClick={moveToHelp}
      >
        설명
      </button>
    </div>
  );
};

export default FirstInputToken;
