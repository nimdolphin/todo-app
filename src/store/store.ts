import { configureStore, combineReducers } from "@reduxjs/toolkit";
import tasksReducer, {
  TodoState,
  initialState,
} from "../features/tasks/tasksSlice";
import { loadState } from "../utils/data";

const persistedState: Partial<{ tasks: TodoState | undefined }> = {
  tasks: {
    ...initialState,
    ...loadState()?.tasks,
  },
};

const rootReducer = combineReducers({
  tasks: tasksReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: persistedState,
});
store.subscribe(() => {
  localStorage.setItem("state", JSON.stringify(store.getState()));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
