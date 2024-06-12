import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { getData } from "../../utils/asyncStoreage";
import { ErrorResponse } from "../quiz/quizsSlice";
import api from "../../utils/api";
import { Exam } from "../../types/Exam/Exam";
import { FulfilledAction, PendingAction, RejectedAction } from "../store";
import { ChartItem } from "../../types/Stat/Chart";

type StatState = {
  exams: Exam[];
  exam: Exam;
  chart: ChartItem[];
  loading: boolean;
  error?: string;
};

const initialState: StatState = {
  exams: [],
  exam: {} as Exam,
  chart: [],
  loading: false,
  error: undefined,
};

export const getExamDone = createAsyncThunk(
  "getExamDone/stat",
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = await getData<string>("@accessToken");

      const response = await api.get("/course/get-exam-done", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log(response.data.res);
      const data = response.data.res.map((item: any) => {
        return {
          title: item.title,
          _id: item.id,
        };
      });
      return data as Exam[];
    } catch (_err) {
      const error = _err as AxiosError;
      const data = error.response?.data as ErrorResponse;
      return rejectWithValue(data.message);
    }
  }
);

export const getChartByExamID = createAsyncThunk(
  "getChartByExamID/stat",
  async (examId: string, { rejectWithValue }) => {
    try {
      const accessToken = await getData<string>("@accessToken");

      const response = await api.post(
        `/chart/get-quiz-score-student`,
        {
          quiz_id: examId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("chart", response.data.response.res);
      return response.data.response.res;
    } catch (_err) {
      const error = _err as AxiosError;
      console.log(error);
      const data = error.response?.data as ErrorResponse;
      return rejectWithValue(data.message);
    }
  }
);

const statSlice = createSlice({
  name: "stat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getExamDone.fulfilled, (state, action) => {
        state.exams = action.payload;
      })
      .addCase(getChartByExamID.fulfilled, (state, action) => {
        state.chart = action.payload.chart;
        state.exam = {
          title: action.payload.name,
          score: action.payload.score,
        } as Exam;
      })
      .addMatcher<PendingAction>(
        (action) => action.type.endsWith("stat/pending"),
        (state) => {
          state.loading = true;
          state.error = undefined;
        }
      )
      .addMatcher<FulfilledAction>(
        (action) => action.type.endsWith("stat/fulfilled"),
        (state) => {
          state.loading = false;
          state.error = undefined;
        }
      )
      .addMatcher<RejectedAction>(
        (action) => action.type.endsWith("stat/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
          console.log("rejected stat", action.payload);
        }
      );
  },
});

const statState = statSlice.reducer;
export default statState;
