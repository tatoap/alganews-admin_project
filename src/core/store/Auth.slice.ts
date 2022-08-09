import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { User, UserService } from 'tato_ap-sdk';

type PA<T> = PayloadAction<T>;

interface AuthState {
  user: User.Detailed | null;
  fetching: boolean;
}

const initialState: AuthState = {
  user: null,
  fetching: false,
};

export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (userId: number, { rejectWithValue, dispatch }) => {
    try {
      const user = await UserService.getDetailedUser(userId);
      dispatch(storeUser(user));
    } catch (err: any) {
      return rejectWithValue({ ...err });
    }
  }
);

const AuthSlice = createSlice({
  initialState,
  name: 'auth',
  reducers: {
    storeUser(state, action: PA<User.Detailed>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
  },
});

export const { storeUser, clearUser } = AuthSlice.actions;

const authReducer = AuthSlice.reducer;

export default authReducer;
