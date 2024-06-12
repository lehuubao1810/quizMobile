import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "../../types/auth/User";
import { FulfilledAction, PendingAction, RejectedAction } from "../store";
import api, { host } from "../../utils/api";
import { getData, removeData, saveString } from "../../utils/asyncStoreage";
import * as FileSystem from "expo-file-system";
import { AxiosError } from "axios";
// import { fetchQuizs } from "../quiz/quizsSlice";
import { fetchCourses } from "../course/courseSlice";
import { fetchCategories } from "../category/categorySlice";

type AuthState = {
  user: User | undefined;
  isAuth: boolean;
  loading: boolean;
  error: string | undefined;
};

type ErrorResponse = {
  message: string;
};

const initialState: AuthState = {
  user: undefined,
  isAuth: false,
  loading: false,
  error: undefined,
};

export const login = createAsyncThunk(
  "login/auth",
  async (
    data: { email: string; password: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await api.post("auth/user/signin", data);

      const accessToken = response.data.access_token;
      const refreshToken = response.data.refresh_token;
      // console.log(accessToken);
      const userResponse = await api.post(
        "/user/get-data",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const user = userResponse.data;
      dispatch(fetchCategories(accessToken));
      dispatch(fetchCourses(accessToken));

      return {
        ...user,
        accessToken,
        refreshToken,
        id: user._id,
      };
    } catch (_err) {
      const error = _err as AxiosError;
      const data = error.response?.data as ErrorResponse;
      return rejectWithValue(data.message);
    }
  }
);

export const logout = createAsyncThunk(
  "logout/auth",
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = await getData<string>("@accessToken");
      const response = await api.post(
        "/auth/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      await removeData("@accessToken");
      await removeData("@refreshToken");

      console.log(response.data);

      return;
    } catch (_err) {
      const error = _err as AxiosError;
      const data = error.response?.data as ErrorResponse;
      return rejectWithValue(data.message);
    }
  }
);

export const register = createAsyncThunk(
  "register/auth",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/user/signup", {
        ...data,
        role: "student",
      });
      // console.log(response.data);
      return response.data;
    } catch (_err) {
      const error = _err as AxiosError;
      const data = error.response?.data as ErrorResponse;
      return rejectWithValue(data.message);
    }
  }
);

export const fetchUserByToken = createAsyncThunk(
  "fetchUserByToken/auth",
  async (accessToken: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post(
        "/user/get-data",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const user = response.data;

      dispatch(fetchCategories(accessToken));
      dispatch(fetchCourses(accessToken));
      console.log(user);
      return {
        ...user,
        id: user._id,
      };
    } catch (_err) {
      const error = _err as AxiosError;
      const data = error.response?.data as ErrorResponse;
      return rejectWithValue(data.message);
    }
  }
);

export const sendOTP = createAsyncThunk(
  "sendOTP/auth",
  async (email: string, { rejectWithValue }) => {
    try {
      await api.post("/auth/forget-password/send-otp", { email });
    } catch (_err) {
      console.log(_err);
      const error = _err as AxiosError;
      const data = error.response?.data as ErrorResponse;
      return rejectWithValue(data.message);
    }
  }
);

export const verifyOTP = createAsyncThunk(
  "verifyOTP/auth",
  async (data: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/forget-password/verify-otp", data);
      console.log(response.data);
      return response.data;
    } catch (_err) {
      const error = _err as AxiosError;
      const data = error.response?.data as ErrorResponse;
      return rejectWithValue(data.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "resetPassword/auth",
  async (
    data: {
      email: string;
      otp: string;
      newPassword: string;
      confirmNewPassword: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        "/auth/forget-password/reset-password",
        data
      );
      console.log(response.data);
      return response.data;
    } catch (_err) {
      const error = _err as AxiosError;
      const data = error.response?.data as ErrorResponse;
      return rejectWithValue(data.message);
    }
  }
);

export const changePassword = createAsyncThunk(
  "changePassword/auth",
  async (
    data: {
      accessToken: string | undefined;
      password: string;
      newPassword: string;
      confirmNewPassword: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        "/auth/change-password-user/change-password",
        {
          password: data.password,
          new_password: data.newPassword,
          confirm_new_password: data.confirmNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${data.accessToken}`,
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (_err) {
      const error = _err as AxiosError;
      const data = error.response?.data as ErrorResponse;
      return rejectWithValue(data.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "updateProfile/auth",
  async (
    data: {
      accessToken: string | undefined;
      first_name: string;
      last_name: string;
      phone_number: string;
      username?: string;
      birthday?: Date;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(
        "/user/put",
        {
          name: {
            first_name: data.first_name,
            last_name: data.last_name,
          },
          phone_number: data.phone_number,
          username: data.username,
          birthday: data.birthday,
        },
        {
          headers: {
            Authorization: `Bearer ${data.accessToken}`,
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (_err) {
      const error = _err as AxiosError;
      const data = error.response?.data as ErrorResponse;
      return rejectWithValue(data.message);
    }
  }
);

export const changeAvatar = createAsyncThunk(
  "changeAvatar/auth",
  async (imageUri: string, { rejectWithValue, dispatch }) => {
    try {
      const accessToken = await getData<string>("@accessToken");
      const filename = imageUri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename!);
      const type = match ? `image/${match[1]}` : `image`;

      const formData = new FormData();
      formData.append("file", { uri: imageUri, name: filename, type } as any);
      const response = await api.post("/user/change-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const user = await dispatch(fetchUserByToken(accessToken ?? ""));
      console.log("user", user.payload.avatar);
      return user.payload.avatar;
    } catch (_err) {
      const error = _err as AxiosError;
      console.log("error", error);
      const data = error.response?.data as ErrorResponse;
      return rejectWithValue(data.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuth = true;
        // Save user at local storage
        if (state.user) {
          saveString("@accessToken", state.user.accessToken);
          saveString("@refreshToken", state.user.refreshToken);
        }
      })
      .addCase(fetchUserByToken.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuth = true;
      })
      .addCase(changeAvatar.fulfilled, (state, action) => {
        if (state.user) {
          state.user.avatar = action.payload;
        }
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = undefined;
        state.isAuth = false;
      })
      .addMatcher<PendingAction>(
        (action) => action.type.endsWith("auth/pending"),
        (state) => {
          state.loading = true;
          state.error = undefined;
        }
      )
      .addMatcher<FulfilledAction>(
        (action) => action.type.endsWith("auth/fulfilled"),
        (state) => {
          state.loading = false;
          state.error = undefined;
        }
      )
      .addMatcher<RejectedAction>(
        (action) => action.type.endsWith("auth/rejected"),
        (state, action) => {
          state.loading = false;
          console.log(action.payload);
          state.isAuth = false;
          if (action.payload === "Token is required") {
            state.error = undefined;
            console.log("rejected auth", action.payload);
            return;
          }
          state.error = action.payload as string;
          console.log("rejected auth", action.payload);
        }
      );
  },
});

export const { clearError } = authSlice.actions;

const authReducer = authSlice.reducer;
export default authReducer;
