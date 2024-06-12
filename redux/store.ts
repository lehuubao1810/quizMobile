import { AsyncThunk, configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import quizsState from "./quiz/quizsSlice";
import essaysState from "./essay/essaySlice";
import coursesState from "./course/courseSlice";
import categoriesState from "./category/categorySlice";
import statState from "./stat/statSlice";

export const store = configureStore({
  reducer: {
    authReducer,
    quizsState,
    essaysState,
    coursesState,
    categoriesState,
    statState
  },
});

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;
export type PendingAction = ReturnType<GenericAsyncThunk["pending"]>;
export type RejectedAction = ReturnType<GenericAsyncThunk["rejected"]>;
export type FulfilledAction = ReturnType<GenericAsyncThunk["fulfilled"]>;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
