/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { serverGetTaskDetail } from '../../api/serverApi';
import { TaskContent } from '../../db/taskList';
import { calTimerTime } from '../../util/util';
import CustomNavigationbar from './CustomNavigationbar';
import timer_stop from '../../Resource/Image/timer_stop.png';
import timer_play from '../../Resource/Image/timer_play.png';
import timer_pause from '../../Resource/Image/timer_pause.png';
import '../css/TaskDetail.css';

interface TaskDetailParams {
  gid: string;
  token: string;
  taskDb: TaskContent;
}

interface TaskInfo {
  name: string;
  custom_fields: [CustomFields];
}

interface CustomFields {
  display_value: string;
  enabled: true;
  gid: string;
  name: string;
}

const TaskDetail = () => {
  const location = useLocation().state as TaskDetailParams;
  const [gid, setGid] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [isFirstEvent, setIsFirstEvent] = useState<boolean>(false);
  const [taskInfo, setTaskInfo] = useState<TaskInfo>();
  const [taskDb, setTaskDb] = useState<TaskContent>();
  const [startTimer, setStartTimer] = useState<NodeJS.Timer>();
  const [timerCount, setTimerCount] = useState<number>(0);
  let changeTime = 0;

  const getTaskDetail = async () => {
    const result = await serverGetTaskDetail(location.token, location.gid);
    if (result.error === '실패') {
      console.log('실패임.. 꺼지삼');
    } else {
      const temp = result.data;
      setTaskInfo(temp);
    }
  };

  const doneTaskBtn = () => {
    console.log('done btn click');
  };

  const saveTaskDb = () => {
    const temp = taskDb;
    if (temp) {
      temp.time = timerCount;
      window.electron.ipcRenderer.renderUpdateTaskTime(gid, temp);
    }
  };

  const timerStop = () => {
    console.log('디비에 저장 후.. timer stop');
    if (startTimer) {
      clearInterval(startTimer);
      saveTaskDb();
    }
    setStartTimer(undefined);
  };

  const timerPlay = () => {
    console.log('timer play');
    if (startTimer) {
      clearInterval(startTimer);
    }

    if (taskDb) {
      changeTime = timerCount;
      setStartTimer(
        setInterval(() => {
          changeTime += 1;
          setTimerCount(changeTime);
        }, 1000)
      );
    }
  };

  const timerPause = () => {
    console.log('timer pause');
    if (startTimer) {
      clearInterval(startTimer);
    }
    setStartTimer(undefined);
  };

  if (!isFirstEvent) {
    setToken(location.token);
    setGid(location.gid);
    setTaskDb(location.taskDb);
    setTimerCount(location.taskDb.time);
    setIsFirstEvent(true);

    getTaskDetail();
  }

  console.log('location info = ', gid, token, taskDb);

  return (
    <div className="TaskDetail">
      <CustomNavigationbar
        before="/taskList"
        isBackBtn
        naviTitle={taskInfo ? taskInfo.name : ''}
        isRightBtn
        isRightText="완료"
        isRightBtnMethod={doneTaskBtn}
      />
      <div className="TaskDetail-TimerView">
        <div className="TaskDetail-timer-view">
          <label className="TaskDetail-timer-text">
            {calTimerTime(timerCount)}
          </label>
          <label className="TaskDetail-timer-estimatedTime-text">
            예상 소요 시간 = {taskInfo?.custom_fields[0].display_value}
          </label>
        </div>
        <div className="TaskDetail-Timer_view_button">
          <button
            onClick={timerStop}
            className="TaskDetail-Timer_Button"
            type="button"
          >
            <img src={timer_stop} alt="a" />
          </button>
          <button
            onClick={timerPlay}
            className="TaskDetail-Timer_Button"
            type="button"
          >
            <img src={timer_play} alt="a" />
          </button>
          <button
            onClick={timerPause}
            className="TaskDetail-Timer_Button"
            type="button"
          >
            <img src={timer_pause} alt="a" />
          </button>
        </div>
      </div>
      <div className="TaskDetail-ContentView">
        <div className="TaskDetail-ContentView-TopLine" />
        <label>내용 설명 구간</label>
      </div>
    </div>
  );
};

export default TaskDetail;
