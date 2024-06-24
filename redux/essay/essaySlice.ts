import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FulfilledAction, PendingAction, RejectedAction } from "../store";
import { Essay } from "../../types/Exam/Essay";
import api from "../../utils/api";
import { AxiosError } from "axios";
import { ErrorResponse } from "../quiz/quizsSlice";

type EssayAnswer = {
  _id: string;
  content_answers: string;
  file_upload: string[];
};

type essaysState = {
  essays: Essay[];
  essayCurrent: Essay;
  essayAnswerCurrent: EssayAnswer;
  loading: boolean;
  error: string | undefined;
};

const initialState: essaysState = {
  essays: [],
  essayCurrent: {} as Essay,
  essayAnswerCurrent: {
    _id: "",
    content_answers: "",
    file_upload: [],
  } as EssayAnswer,
  loading: false,
  error: undefined,
};

export const getEssayByID = createAsyncThunk(
  "getEssay/essays",
  async (
    data: { essayId: string; courseId: string; accessToken?: string },
    { rejectWithValue }
  ) => {
    try {
      console.log("essay id: ", data.essayId);
      const response = await api.post(
        `/essay-exam-answer/join-essay-exam`,
        {
          idEssayExam: data.essayId,
          idCourse: data.courseId,
        },
        {
          headers: {
            Authorization: `Bearer ${data.accessToken}`,
          },
        }
      );
      console.log("essay by id", response.data);

      const payload = {
        ...response.data,
        total_time_left: response.data.total_time_left.toFixed(0),
      };

      if (!response.data.isFirst) {
        const essayAnswerCurrent = {
          _id: response.data.data_answer._id,
          content_answers: response.data.data_answer.content_answers,
        };
        return { ...payload, essayAnswerCurrent: essayAnswerCurrent };
      }

      return payload;
    } catch (_err) {
      const error = _err as AxiosError;
      const data = error.response?.data as ErrorResponse;
      return rejectWithValue(data.message);
    }
  }
);

export const postAnswerEssay = createAsyncThunk(
  "postAnswer/essays",
  async (
    data: { answer: string; id: string; accessToken?: string; uri?: string },
    { rejectWithValue }
  ) => {
    try {
      const answerForm = new FormData();

      answerForm.append("content_answers", data.answer);
      if (data.uri) {
        const filename = data.uri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename!);
        const type = match
          ? `application/${match[1]}`
          : `application/octet-stream`;
        answerForm.append("file_essay_answer", {
          uri: data.uri,
          name: filename,
          type,
        } as any);
      }
      console.log("form answer", answerForm);
      const response = await api.post(
        `/essay-exam-answer/submit-essay-exam-answer/${data.id}`,
        answerForm,
        {
          headers: {
            Authorization: `Bearer ${data.accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("submit ok", response);
    } catch (_err) {
      console.log(_err);
      const error = _err as AxiosError;
      console.log(error);
      const data = error.response?.data as ErrorResponse;
      return rejectWithValue(data);
    }
  }
);

export const updateAnswerEssay = createAsyncThunk(
  "updateAnswer/essays",
  async (
    data: { answer: string; id: string; accessToken?: string; uri?: string },
    { rejectWithValue }
  ) => {
    try {
      const answerForm = new FormData();
      console.log("data file", data.uri);
      answerForm.append("content_answers", data.answer);
      if (data.uri) {
        const filename = data.uri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename!);
        const type = match
          ? `application/${match[1]}`
          : `application/octet-stream`;
        answerForm.append("file_essay_answer", {
          uri: data.uri,
          name: filename,
          type,
        } as any);
      }
      console.log("form answer", answerForm);
      const response = await api.put(
        `/essay-exam-answer/update-essay-exam-answer/${data.id}`,
        answerForm,
        {
          headers: {
            Authorization: `Bearer ${data.accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("submit ok", response);
    } catch (_err) {
      console.log(_err);
      const error = _err as AxiosError;
      console.log(error);
      const data = error.response?.data as ErrorResponse;
      return rejectWithValue(data);
    }
  }
);

const essaysSlice = createSlice({
  name: "essays",
  initialState,
  reducers: {
    setEssays: (state, action) => {
      state.essays = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEssayByID.fulfilled, (state, action) => {
        state.essayCurrent = action.payload.data_test;
        state.essayCurrent.total_time_left = action.payload.total_time_left;
        if (action.payload.isFirst) {
          state.essayAnswerCurrent._id = action.payload._id;
        } else {
          state.essayAnswerCurrent = action.payload.data_answer;
        }
      })
      .addMatcher<PendingAction>(
        (action) => action.type.endsWith("essays/pending"),
        (state) => {
          state.loading = true;
          state.error = undefined;
        }
      )
      .addMatcher<FulfilledAction>(
        (action) => action.type.endsWith("essays/fulfilled"),
        (state) => {
          state.loading = false;
          state.error = undefined;
        }
      )
      .addMatcher<RejectedAction>(
        (action) => action.type.endsWith("essays/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
          console.log("rejected essays", action.payload);
        }
      );
  },
});

export const { setEssays } = essaysSlice.actions;

const essaysState = essaysSlice.reducer;
export default essaysState;
