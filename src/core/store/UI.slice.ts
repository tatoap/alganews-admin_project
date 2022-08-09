import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  breadcrumb: string[];
}

const initialState: UIState = {
  breadcrumb: [],
};

const UISlice = createSlice({
  initialState,
  name: 'ui',
  reducers: {
    setBreadcrumb(state, action: PayloadAction<string[]>) {
      state.breadcrumb = action.payload;
    },
  },
});

export const { setBreadcrumb } = UISlice.actions;

const UIReducer = UISlice.reducer;

export default UIReducer;
