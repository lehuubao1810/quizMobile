import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Answer, Quiz, ResultQuiz } from "../../types/Exam/Quiz";
import { FulfilledAction, PendingAction, RejectedAction } from "../store";
import { quizs } from "../../constants/quizs";
import api from "../../utils/api";
import { AxiosError } from "axios";
import { getData } from "../../utils/asyncStoreage";

type quizsState = {
  quizs: Quiz[];
  quizCurrent: Quiz;
  answerSelected: Answer[];
  loading: boolean;
  error?: string;
  result?: ResultQuiz;
};

const initialState: quizsState = {
  quizs: [],
  quizCurrent: {} as Quiz,
  answerSelected: [],
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

// export const fetchQuizs = createAsyncThunk(
//   "fetchQuizs/quizs",
//   async (accessToken: string, { rejectWithValue }) => {
//     try {
//       const response = await api.get("/quiz/get-all", {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });
//       console.log("quizs", response.data);
//       return response.data;
//     } catch (_err) {
//       const error = _err as AxiosError;
//       const data = error.response?.data as ErrorResponse;
//       return rejectWithValue(data.message);
//     }
//   }
// );

export const getQuizByID = createAsyncThunk(
  "getQuiz/quizs",
  async (
    data: { quizId: string; accessToken?: string },
    { rejectWithValue }
  ) => {
    try {
      console.log("quiz id: ");
      const response = await api.post(
        "/quiz-exam/get/quiz-exam",
        {
          quiz_id: data.quizId,
        },
        {
          headers: {
            Authorization: `Bearer ${data.accessToken}`,
          },
        }
      );
      console.log("quiz by id", response.data.res);
      if (response.data.res.isFirst) {
        return {
          isFirst: true,
          data: response.data.res,
        };
      }
      const dataExam = response.data.res.dataExam.map(
        (item: any) => item.question
      );
      const answerSelected = response.data.res.dataExam.map((item: any) => {
        return {
          question_id: item.question._id,
          answer: item.answer_select,
        };
      });
      const metaData = {
        ...response.data.res,
        dataExam,
        answerSelected,
      };
      console.log("data quiz not first", metaData);
      return {
        isFirst: false,
        data: metaData,
        answerSelected,
      };
    } catch (_err) {
      const error = _err as AxiosError;
      const data = error.response?.data as ErrorResponse;
      return rejectWithValue(data.message);
    }
  }
);

export const submitQuiz = createAsyncThunk(
  "submit/quizs",
  async (data: { id: string; quizId: string }, { rejectWithValue }) => {
    try {
      const accessToken = await getData<string>("@accessToken");

      const response = await api.post(
        "/quiz-answer/update-final",
        {
          id: data.id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log(response.data);
      console.log("result", {
        quizId: data.quizId,
        ...response.data,
      });
      return {
        quizId: data.quizId,
        ...response.data,
      };
    } catch (_err) {
      const error = _err as AxiosError;
      const data = error.response?.data as ErrorResponse;
      return rejectWithValue(data.message);
    }
  }
);

export const postAnswer = createAsyncThunk(
  "postAnswer/quizs",
  async (
    data: {
      answers: AnswerRequest[];
      quiz_answer_id: string;
      quiz_exam_id: string;
      quizId: string;
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const accessToken = await getData<string>("@accessToken");

      const response = await api.post(
        "/quiz-answer/update-quiz-answer",
        {
          quiz_exam_id: data.quiz_exam_id,
          answers: data.answers,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log(response.data);
      // dispatch(submitQuiz({ id: data.quiz_answer_id, quizId: data.quizId }));
      return response.data;
    } catch (_err) {
      const error = _err as AxiosError;
      const data = error.response?.data as ErrorResponse;
      return rejectWithValue(data.message);
    }
  }
);

const quizsSlice = createSlice({
  name: "quizs",
  initialState,
  reducers: {
    setQuizs: (state, action) => {
      console.log("quizs", action.payload);
      state.quizs = action.payload;
    },
    resetAnswerSelected: (state) => {
      state.answerSelected = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // .addCase(fetchQuizs.fulfilled, (state, action) => {
      //   state.quizs = action.payload;
      // })
      .addCase(getQuizByID.fulfilled, (state, action) => {
        state.quizCurrent = action.payload.data;
        if (!action.payload?.isFirst) {
          state.answerSelected = action.payload.answerSelected;
        } else {
          state.answerSelected = [];
        }
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.result = action.payload;
      })
      .addMatcher<PendingAction>(
        (action) => action.type.endsWith("quizs/pending"),
        (state) => {
          state.loading = true;
          state.error = undefined;
        }
      )
      .addMatcher<FulfilledAction>(
        (action) => action.type.endsWith("quizs/fulfilled"),
        (state) => {
          state.loading = false;
          state.error = undefined;
        }
      )
      .addMatcher<RejectedAction>(
        (action) => action.type.endsWith("quizs/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
          console.log("rejected quizs", action.payload);
        }
      );
  },
});

export const { setQuizs, resetAnswerSelected } = quizsSlice.actions;

const quizsState = quizsSlice.reducer;
export default quizsState;
