import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FulfilledAction, PendingAction, RejectedAction } from "../store";
import { Course } from "../../types/Course/Course";
import api from "../../utils/api";
import { getData } from "../../utils/asyncStoreage";
import { AxiosError } from "axios";
import { setQuizs } from "../quiz/quizsSlice";
import { setEssays } from "../essay/essaySlice";

type coursesState = {
  courses: Course[];
  loading: boolean;
  categoryCurrentId: string;
  error: string | undefined;
};

const initialState: coursesState = {
  courses: [],
  loading: false,
  categoryCurrentId: "",
  error: undefined,
};

type ErrorResponse = {
  message: string;
};

export const fetchCourses = createAsyncThunk(
  "fetchcourses/courses",
  async (accessToken: string, { rejectWithValue }) => {
    try {
      const response = await api.get("/course/get-course/student", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("list course", response.data.data);
      return response.data.data;
    } catch (_err) {
      const error = _err as AxiosError;
      const data = error.response?.data as ErrorResponse;
      return rejectWithValue(data.message);
    }
  }
);

export const getDetailCourse = createAsyncThunk(
  "getDetailCourse/courses",
  async (
    data: { courseId: string; accessToken?: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      console.log("courseId", data.courseId);
      const response = await api.get("/course/get-exam", {
        params: {
          course_id: data.courseId,
        },
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      });

      console.log("select course", response.data.res);
      const metadata = response.data.res;
      metadata.dataQuizNotExpire.lenght !== 0 &&
        dispatch(setQuizs(metadata.dataQuizNotExpire));

      metadata.dataEssayExamNotExpire.lenght !== 0 &&
        dispatch(setEssays(metadata.dataEssayExamNotExpire));
      return;
    } catch (_err) {
      const error = _err as AxiosError;
      const data = error.response?.data as ErrorResponse;
      return rejectWithValue(data.message);
    }
  }
);

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    changeCategory: (state, action) => {
      state.categoryCurrentId = action.payload;
    },
    filterCourse: (state, action) => {
      if (action.payload === "") {
        return;
      }
      state.courses = state.courses.filter(
        (course) => course.category_id === action.payload
      );
      // console.log("after fil", state.courses);
    },
    searchCourses: (state, action) => {
      state.courses = state.courses.filter((course) =>
        course.name.toLowerCase().includes(action.payload.toLowerCase())
      );
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.courses = action.payload;
      })
      .addMatcher<PendingAction>(
        (action) => action.type.endsWith("courses/pending"),
        (state) => {
          state.loading = true;
          state.error = undefined;
        }
      )
      .addMatcher<FulfilledAction>(
        (action) => action.type.endsWith("courses/fulfilled"),
        (state) => {
          state.loading = false;
          state.error = undefined;
        }
      )
      .addMatcher<RejectedAction>(
        (action) => action.type.endsWith("courses/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
          console.log("rejected courses", action.payload);
        }
      );
  },
});

export const { changeCategory, filterCourse, searchCourses } = coursesSlice.actions;

const coursesState = coursesSlice.reducer;
export default coursesState;
