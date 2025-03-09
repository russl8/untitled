import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/example/exampleSlice";
import displayReducer from "./features/dashboard/displaySlice";
export const store = configureStore({
  reducer: { counterReducer, displayReducer },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
