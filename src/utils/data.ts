import { TodoState, initialState } from "../features/tasks/tasksSlice";

export const loadState = (): TodoState | undefined => {
  try {
    const serializedState = localStorage.getItem("state");
    if (serializedState === null) {
      return initialState;
    }
    const loadedState: TodoState = JSON.parse(serializedState);
    return {
      ...initialState,
      ...loadedState,
    };
  } catch (err) {
    console.error("Failed to load state:", err);
    return initialState;
  }
};
