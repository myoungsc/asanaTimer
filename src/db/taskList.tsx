/* eslint-disable func-names */
/* eslint-disable array-callback-return */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { BrowserWindow } from 'electron';

const Bluebird = require('bluebird');
const storage = Bluebird.promisifyAll(require('electron-json-storage'));

interface ServerTaskList {
  gid: string;
  name: string;
  resource_type: string;
  due_on: string;
  completed: boolean;
  start_on: string;
}

interface DataJSON {
  data: [ServerTaskList];
}

export interface TastLists {
  taskLists: { [key: string]: TaskContent };
}

export interface TaskContent {
  name: string;
  resource_type: string;
  time: number;
  start_on: string;
  due_on: string;
  completed: boolean;
}

export const tempTastlist = () => {};

export function updateTaskContent(taskContent: TaskContent, gid: string) {
  const beforeTask = getTaskList();
  const tempTask: { [key: string]: TaskContent } = beforeTask.taskLists;
  tempTask[`${gid}`] = taskContent;
  beforeTask.taskLists = tempTask;
  setTaskList(beforeTask);
}

export function setOrUpdateTaskList(taskList: DataJSON) {
  let beforeTask: TastLists = getTaskList();
  if (Object.keys(beforeTask).length === 0) {
    beforeTask = { taskLists: {} };
  }

  const tempTask: { [key: string]: TaskContent } = beforeTask.taskLists;
  const afterTask: [ServerTaskList] = taskList.data;

  Object.keys(tempTask).map((value: string): void => {
    let isDone = false;
    afterTask.map((task: ServerTaskList): void => {
      if (task.gid === value) {
        isDone = true;
      }
    });
    if (!isDone) {
      delete tempTask[value];
    }
  });

  afterTask.map((value: ServerTaskList): void => {
    const taskGid = value.gid;

    if (Object.keys(tempTask).includes(taskGid)) {
      console.log('존재함');
      const info = tempTask[`${taskGid}`];
      info.name = value.name;
      info.start_on = value.start_on;
      info.due_on = value.due_on;
      info.completed = value.completed;
      tempTask[`${taskGid}`] = info;
    } else {
      console.log('존재안함');
      const newTask: TaskContent = {
        name: value.name,
        time: 0,
        resource_type: value.resource_type,
        start_on: value.start_on,
        due_on: value.due_on,
        completed: value.completed,
      };
      tempTask[`${value.gid}`] = newTask;
    }
  });

  beforeTask.taskLists = tempTask;
  console.log(beforeTask);
  setTaskList(beforeTask);
}

const getTaskList = () => {
  const data: TastLists = storage.getSync('taskList');
  return data;
};

const setTaskList = (taskList: TastLists) => {
  storage.set('taskList', taskList, function (error: Error) {
    if (error) {
      throw error;
    }
    const msgTemplate = (data: string) => `${data}`;
    BrowserWindow.getFocusedWindow()?.webContents.send(
      'completeSetUserInfo',
      msgTemplate(JSON.stringify(taskList.taskLists))
    );
  });
};
