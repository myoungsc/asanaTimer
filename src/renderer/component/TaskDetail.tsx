/* eslint-disable no-alert */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import moment from 'moment';
import { serverGetTaskDetail, serverPutDoneTask } from '../../api/serverApi';
import { TaskContent } from '../../db/taskList';
import { LoadingAnimation } from './LoadingAnimation';
import {
  calTimerTime,
  calStartEndTime,
  calUseTime,
  calDiffSecond,
} from '../../util/util';
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
  notes: string;
  custom_fields: [CustomField];
  followers: [Follower];
  due_on: string;
  start_on: string;
}

interface CustomField {
  display_value: string;
  enabled: true;
  gid: string;
  name: string;
  enum_options: [EnumOptions];
}

interface EnumOptions {
  gid: string;
  color: string;
  enabled: boolean;
  name: string;
  resource_type: string;
}

interface Follower {
  gid: string;
  name: string;
  resource_type: string;
}

const TaskDetail = () => {
  const history = useHistory();
  const location = useLocation().state as TaskDetailParams;
  const [gid, setGid] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [isFirstEvent, setIsFirstEvent] = useState<boolean>(false);
  const [taskInfo, setTaskInfo] = useState<TaskInfo>();
  const [taskDb, setTaskDb] = useState<TaskContent>();
  const [startTimer, setStartTimer] = useState<NodeJS.Timer>();
  const [timerCount, setTimerCount] = useState<number>(0);
  const [showDoneAlert, setShowDoneAlert] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<moment.Moment>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getTaskDetail = async () => {
    setIsLoading(true);
    const result = await serverGetTaskDetail(location.token, location.gid);
    if (result.error === '실패') {
      console.log('실패임.. 꺼지삼');
    } else {
      const temp = result.data;
      setTaskInfo(temp);
    }
    setIsLoading(false);
  };

  const doneTaskBtn = () => {
    console.log(timerCount);
    if (startTimer) {
      clearInterval(startTimer);
    }
    setShowDoneAlert(true);
  };

  const saveTaskDb = (count: number) => {
    const temp = taskDb;
    if (temp) {
      temp.time += count;
      setTimerCount(temp.time);
      window.electron.ipcRenderer.renderUpdateTaskContent(gid, temp);
    }
  };

  const startTimerInit = () => {
    if (startTimer) {
      clearInterval(startTimer);
      if (startTime) {
        const diffDuration = calDiffSecond(startTime, moment());
        saveTaskDb(diffDuration);
      }
    }
  };

  const timerStop = () => {
    console.log('디비에 저장 후.. timer stop');
    startTimerInit();
    setStartTimer(undefined);
  };

  const timerPlay = () => {
    console.log('timer play', timerCount);
    startTimerInit();

    if (taskDb) {
      const now = moment();
      setStartTime(now);
      setStartTimer(
        setInterval(() => {
          const diffDuration = calDiffSecond(now, moment());
          setTimerCount(taskDb.time + diffDuration);
        }, 1000)
      );
    }
  };

  const timerPause = () => {
    startTimerInit();
    setStartTimer(undefined);
  };

  const alertCancelBtn = () => {
    console.log('alert cancel');
    setShowDoneAlert(false);
  };

  const alertDoneBtn = async () => {
    console.log('alert done', timerCount);
    setShowDoneAlert(false);
    setIsLoading(true);
    const value = calUseTime(timerCount);
    let selectGid = '';
    let customFieldGid = '';
    if (taskInfo) {
      const customField: [CustomField] = taskInfo.custom_fields;
      for (let i = 0; i < customField.length; i += 1) {
        if (i > 0) {
          customFieldGid = customField[i].gid;
          const tempGid = customField[i].enum_options.filter(
            (temp: EnumOptions) => {
              return temp.name === value;
            }
          );
          selectGid = tempGid[0].gid;
        }
      }
    }
    const result = await serverPutDoneTask(
      token,
      gid,
      customFieldGid,
      selectGid
    );
    setIsLoading(true);
    if (result.error === '실패') {
      alert('잠시 후 다시 시도해주세요.');
    } else {
      const temp = taskDb;
      if (temp) {
        temp.completed = true;
        await window.electron.ipcRenderer.renderUpdateTaskContent(gid, temp);
      }
      history.goBack();
    }
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
      {isLoading ? <LoadingAnimation /> : null}
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
        <div className="Task-ContentView-View">
          <label className="Task-ContentView-Title">{taskInfo?.name}</label>
          <div className="TaskDetail-ContentView-MidLine" />
          <label className="Task-ContentView-Content">
            {taskInfo?.notes ? taskInfo.notes : '내용 없음'}
          </label>
          <div className="TaskDetail-ContentView-MidLine" />
          <label className="Task-ContentView-Time">
            마감일 :{' '}
            {taskInfo
              ? calStartEndTime(taskInfo?.start_on, taskInfo?.due_on)
              : ''}
          </label>
          <div className="TaskDetail-ContentView-MidLine" />

          <div className="Task-ContentView-followerView">
            <label className="Task-ContentView-followerText">
              {`협업 참여자 : `}
            </label>
            {taskInfo?.followers.map((follower: Follower, index: number) => {
              return (
                <div key={follower.gid}>
                  <label className="Task-ContentView-follower-name">{` ${
                    follower.name
                  }${
                    taskInfo.followers.length === index + 1 ? '' : ','
                  }`}</label>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {showDoneAlert ? (
        <div
          onClick={alertCancelBtn}
          aria-hidden="true"
          className="Task-AlertView"
        >
          <div className="Task-AlertView-Background">
            <div className="Task-AlertView-ContentView">
              <label className="Task-AlertView-Title">알림</label>
              <label className="Task-AlertView-Content">
                진행된 타이머 시간으로 실제 소요 시간과 Task 완료 처리를
                하시겠습니까?
              </label>
              <div className="Task-AlertView-ButtonView">
                <button
                  onClick={alertCancelBtn}
                  type="button"
                  className="Task-AlertView-Button"
                >
                  취소
                </button>
                <button
                  onClick={alertDoneBtn}
                  type="button"
                  className="Task-AlertView-Button"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TaskDetail;
