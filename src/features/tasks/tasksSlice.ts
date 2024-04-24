import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Task {
  id: number;
  name: string;
  description: string;
  checked: boolean;
  dueDate?: string;
  reminderDate?: string;
  subtasks: Task[];
}

export interface TodoState {
  tasks: Task[];
  selectedTasks: number[];
  taskName: string;
  taskDescription: string;
  dueDate?: string;
  reminderDate?: string;
}

export const initialState: TodoState = {
  tasks: [
    {
      id: 1,
      name: "task 1",
      description: "description 1",
      checked: false,
      subtasks: [
        {
          id: 2,
          name: "subtask 1.1",
          description: "description 1.1",
          checked: false,
          subtasks: [],
        },
      ],
    },
  ],
  selectedTasks: [],
  taskName: "",
  taskDescription: "",
};

export const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    toggleTask: (state, action: PayloadAction<number>) => {
      const task = state.tasks.find((task) => task.id === action.payload);
      if (task) {
        task.checked = !task.checked;
      }
    },
    setTaskName: (state, action: PayloadAction<string>) => {
      state.taskName = action.payload;
    },
    setTaskDescription: (state, action: PayloadAction<string>) => {
      state.taskDescription = action.payload;
    },
    addNewTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    addSubtask: (
      state,
      action: PayloadAction<{ parentId: number; subtask: Task }>
    ) => {
      const { parentId, subtask } = action.payload;
      const findAndAddSubtask = (tasks: Task[]) => {
        tasks.forEach((task) => {
          if (task.id === parentId) {
            task.subtasks.push(subtask);
          } else {
            findAndAddSubtask(task.subtasks);
          }
        });
      };
      findAndAddSubtask(state.tasks);
    },
    deleteTask: (state, action: PayloadAction<number>) => {
      const deleteTaskRecursive = (tasks: Task[]) =>
        tasks.filter((task) => {
          if (task.id === action.payload) {
            return false;
          }
          task.subtasks = deleteTaskRecursive(task.subtasks);
          return true;
        });
      state.tasks = deleteTaskRecursive(state.tasks);
    },

    editTask: (
      state,
      action: PayloadAction<{ id: number; name: string; description: string }>
    ) => {
      const editTaskRecursive = (tasks: Task[]) => {
        tasks.forEach((task) => {
          if (task.id === action.payload.id) {
            task.name = action.payload.name;
            task.description = action.payload.description;
          }
          editTaskRecursive(task.subtasks);
        });
      };
      editTaskRecursive(state.tasks);
    },

    toggleSelectedTask: (state, action: PayloadAction<number>) => {
      const toggleTaskRecursive = (task: Task) => {
        task.checked = !task.checked;
        task.subtasks.forEach(toggleTaskRecursive);
      };

      const findAndToggleTask = (tasks: Task[], taskId: number) => {
        tasks.forEach((task) => {
          if (task.id === taskId) {
            toggleTaskRecursive(task);
          } else {
            findAndToggleTask(task.subtasks, taskId);
          }
        });
      };

      findAndToggleTask(state.tasks, action.payload);
    },

    deleteSelectedTasks: (state) => {
      const filterTasksRecursively = (tasks: Task[]) =>
        tasks.filter((task) => {
          task.subtasks = filterTasksRecursively(task.subtasks);
          return !task.checked;
        });

      state.tasks = filterTasksRecursively(state.tasks);
    },
  },
});

export const {
  addTask,
  toggleTask,
  setTaskName,
  setTaskDescription,
  addNewTask,
  addSubtask,
  deleteTask,
  editTask,
  toggleSelectedTask,
  deleteSelectedTasks,
} = taskSlice.actions;

export default taskSlice.reducer;
