import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Answer, Quiz, ResultQuiz } from "../../types/Exam/Quiz";
import { FulfilledAction, PendingAction, RejectedAction } from "../store";
import api from "../../utils/api";
import { AxiosError } from "axios";
import { getData } from "../../utils/asyncStoreage";
import { socket } from "../../constants/socket";

type quizRealTimeState = {
  quizRealTime: Quiz;
  answerSelected: Answer;
  loading: boolean;
  error?: string;
  result?: ResultQuiz;
};

const initialState: quizRealTimeState = {
  quizRealTime: {} as Quiz,
  answerSelected: {} as Answer,
  loading: false,
  error: undefined,
  result: {} as ResultQuiz,
};

export type ErrorResponse = {
  message: string;
};
export type AnswerRequest = {
  question?: {
    _id?: string;
  };
  answer_select: number;
};

// use socket.io
export const joinRoom = createAsyncThunk(
  "joinRoom/quizRealTime",
  async (data: { roomId: string; username: string }) => {
    socket.emit("joinRoom", data);
  }
);

export const sendAnswer = createAsyncThunk(
  "sendAnswer/quizRealTime",
  async (data: { roomId: string; answerIndex: number }) => {
    socket.emit("sendAnswer", data);
  }
);

const quizRealTimeSlice = createSlice({
  name: "quizRealTime",
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      .addMatcher<PendingAction>(
        (action) => action.type.endsWith("quizRealTime/pending"),
        (state) => {
          state.loading = true;
          state.error = undefined;
        }
      )
      .addMatcher<FulfilledAction>(
        (action) => action.type.endsWith("quizRealTime/fulfilled"),
        (state) => {
          state.loading = false;
          state.error = undefined;
        }
      )
      .addMatcher<RejectedAction>(
        (action) => action.type.endsWith("quizRealTime/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
          console.log("rejected quizRealTime", action.payload);
        }
      );
  },
});

export const { setError } = quizRealTimeSlice.actions;

const quizRealTimeState = quizRealTimeSlice.reducer;
export default quizRealTimeState;
