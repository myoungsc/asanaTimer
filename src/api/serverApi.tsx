export const serverGetTaskDetail = async (token: string, gid: string) => {
  const apiUrl = `https://app.asana.com/api/1.0/tasks/${gid}`;
  const response = await fetch(apiUrl, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  let result;
  if (response.status === 200) {
    result = await response.json();
  } else {
    result = JSON.parse('{ "error": "실패" }');
  }
  return result;
};

export const serverGetTaskList = async (
  token: string,
  userGid: string,
  workspacesGid: string
) => {
  const apiUrl = `https://app.asana.com/api/1.0/workspaces/${workspacesGid}/tasks/search?assignee.any=${userGid}&completed=false&sort_by=due_date&sort_ascending=true&opt_fields=[gid, name, resource_type, start_on, due_on, created_on.before]`;
  const response = await fetch(apiUrl, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  let result;
  if (response.status === 200) {
    result = await response.json();
  } else {
    result = JSON.parse('{ "error": "실패" }');
  }
  return result;
};

export const a = 'a';
