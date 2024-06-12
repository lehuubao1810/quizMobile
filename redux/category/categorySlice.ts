import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FulfilledAction, PendingAction, RejectedAction } from "../store";
import { Course } from "../../types/Course/Course";
import api from "../../utils/api";
import { getData } from "../../utils/asyncStoreage";
import { AxiosError } from "axios";
import { Category } from "../../types/Category/Category";

type categoriesState = {
  categories: Category[];
  loading: boolean;
  error: string | undefined;
};

const initialState: categoriesState = {
  categories: [
  ],
  loading: false,
  error: undefined,
};

type ErrorResponse = {
  message: string;
};

export const fetchCategories = createAsyncThunk(
  "fetchcategories/categories",
  async (accessToken: string, { rejectWithValue }) => {
    try {
      // console.log("RUN FETCH");
      const response = await api.get("/category/get-all");
      // console.log("list category", response.data);
      return response.data;
    } catch (_err) {
      const error = _err as AxiosError;
      const data = error.response?.data as ErrorResponse;
      return rejectWithValue(data.message);
    }
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        const categoryAll = {
          _id: "",
          name: "All",
          icon: "",
        }
        state.categories = [categoryAll, ...action.payload];
      })
      .addMatcher<PendingAction>( 
        (action) => action.type.endsWith("categories/pending"),
        (state) => {
          state.loading = true;
          state.error = undefined;
        }
      )
      .addMatcher<FulfilledAction>(
        (action) => action.type.endsWith("categories/fulfilled"),
        (state) => {
          state.loading = false;
          state.error = undefined;
        }
      )
      .addMatcher<RejectedAction>(
        (action) => action.type.endsWith("categories/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
          console.log("rejected categories", action.payload);
        }
      );
  },
});

const categoriesState = categoriesSlice.reducer;
export default categoriesState;
