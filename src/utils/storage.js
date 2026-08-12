export const STORAGE_KEYS = {
  USER: "taskflow_user",
  TODOS: "taskflow_todos",
  TASKS: "taskflow_tasks",
  PROJECTS: "taskflow_projects",
  TEAM: "taskflow_team",
  MILESTONES: "taskflow_milestones",
  CHECKLISTS: "taskflow_checklists",
  THEME: "taskflow_theme",
  NOTIFICATIONS: "taskflow_notifications",
  SETTINGS: "taskflow_settings",
};

export function createId() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 9)}`;
}