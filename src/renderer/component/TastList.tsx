/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { serverGetTaskList } from '../../api/serverApi';
import { TaskContent } from '../../db/taskList';
import CustomNavigationbar from './CustomNavigationbar';
import { calTimerTime, calStartEndTime } from '../../util/util';
import '../css/TaskList.css';

interface WorkspacesInfo {
  gid: string;
  name: string;
  resource_type: string;
}

interface UserInfoInterFase {
  gid: string;
  email: string;
  name: string;
  photo: string;
  resource_type: string;
  workspaces: [WorkspacesInfo];
}

const TaskList = () => {
  const history = useHistory();
  const [isFirstEvent, setIsFirstEvent] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfoInterFase>();
  const [naviTitle, setNaviTitle] = useState<string>('');
  const [taskList, setTaskList] = useState<{ [key: string]: TaskContent }>({});
  const [taskListKeys, setTaskKeys] = useState<string[]>();
  const [token, setToken] = useState<string>();
  let tempToken = '';

  console.log('isFirstEvent', isFirstEvent);

  const getTaskList = async (object: UserInfoInterFase) => {
    if (userInfo !== null) {
      console.log('network get task list');
      const result = await serverGetTaskList(
        tempToken,
        object.gid,
        object.workspaces[0].gid
      );
      console.log(result);
      window.electron.ipcRenderer.renderSetOrUpdateTaskList(result);
    }
  };

  if (!isFirstEvent) {
    window.electron.ipcRenderer.on('completeGetDeviceToken', (arg: string) => {
      tempToken = arg;
      setToken(arg);
      window.electron.ipcRenderer.renderGetUserInfo();
    });

    window.electron.ipcRenderer.on('completeGetUserInfo', (arg: string) => {
      const userJson: UserInfoInterFase = JSON.parse(arg).userInfo;
      setUserInfo(userJson);
      setNaviTitle(`${userJson?.name}님의 작업 목록`);
      getTaskList(userJson);
    });

    window.electron.ipcRenderer.on(
      'completeClearDeviceToken',
      (arg: string) => {
        console.log('토큰 삭제', arg);
        window.electron.ipcRenderer.renderRemoveEvent('completeGetDeviceToken');
        window.electron.ipcRenderer.renderRemoveEvent(
          'completeClearDeviceToken'
        );
        window.electron.ipcRenderer.renderRemoveEvent('completeGetUserInfo');
        window.electron.ipcRenderer.renderRemoveEvent('completeSetUserInfo');
        history.goBack();
      }
    );

    window.electron.ipcRenderer.on('completeSetUserInfo', (arg: string) => {
      const temp: { [key: string]: TaskContent } = JSON.parse(arg);
      setTaskKeys(Object.keys(temp));
      setTaskList(temp);
    });

    window.electron.ipcRenderer.renderGetDeviceToken();
    setIsFirstEvent(true);
  }

  // const clearDeviceToken = () => {
  //   window.electron.ipcRenderer.renderClearDeviceToken();
  // };

  const moveToTaskDetail = (gid: string) => {
    window.electron.ipcRenderer.renderRemoveEvent('completeGetDeviceToken');
    window.electron.ipcRenderer.renderRemoveEvent('completeClearDeviceToken');
    window.electron.ipcRenderer.renderRemoveEvent('completeGetUserInfo');
    window.electron.ipcRenderer.renderRemoveEvent('completeSetUserInfo');

    console.log(taskList, taskList[gid]);

    history.push({
      pathname: '/taskList/Detail',
      state: { gid, token, taskDb: taskList[gid] },
    });
  };

  return (
    <div className="TaskList">
      {console.log(userInfo, taskList)}
      <CustomNavigationbar before="/" isBackBtn={false} naviTitle={naviTitle} />
      {taskListKeys?.map((keyValue: string, index: number) => {
        const task = taskList[`${keyValue}`];
        return task ? (
          <div
            key={keyValue}
            className="TaskList-item"
            onClick={() => moveToTaskDetail(keyValue)}
            onKeyUp={() => {}}
          >
            {console.log(keyValue, index, task)}
            <div className="Tasklist-Item-View">
              <label className="TaskList-Item-Name">{task.name}</label>
              <label className="Tasklist-Item-Timer">
                {calTimerTime(task.time)}
              </label>
            </div>
            <div className="TaskList-Item-Day-View">
              <label className="TaskLIst-Item-Day">
                {calStartEndTime(task.start_on, task.due_on)}
              </label>
            </div>
            <div className="TaskList-Item-Line" />
          </div>
        ) : (
          <div key={1 + keyValue} />
        );
      })}
      {/* <button type="button" onClick={clearDeviceToken}>
        클리어
      </button> */}
    </div>
  );
};

export default TaskList;
