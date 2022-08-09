import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';
import { Key } from 'react';
import { CashFlow, CashFlowService } from 'tato_ap-sdk';
import { RootState } from '.';
import getThunkStatus from '../utils/getThunkStatus';

interface RevenueState {
  list: CashFlow.EntrySummary[];
  fetching: boolean;
  query: CashFlow.Query;
  selected: Key[];
}

const params = new URLSearchParams(window.location.search);
const yearMonth = params.get('yearMonth');

const initialState: RevenueState = {
  list: [],
  fetching: false,
  query: {
    type: 'REVENUE',
    sort: ['transactedOn', 'desc'],
    yearMonth: yearMonth || moment().format('YYYY-MM'),
  },
  selected: [],
};

const revenueSlice = createSlice({
  initialState,
  name: 'cash-flow/revenues',
  reducers: {
    storeList(state, action: PayloadAction<CashFlow.EntrySummary[]>) {
      state.list = action.payload;
    },
    setSelectedRevenues(state, action: PayloadAction<Key[]>) {
      state.selected = action.payload;
    },
    setQuery(state, action: PayloadAction<Partial<CashFlow.Query>>) {
      state.query = {
        ...state.query,
        ...action.payload,
      };
    },
    setFetching(state, action: PayloadAction<boolean>) {
      state.fetching = action.payload;
    },
  },
  extraReducers(builder) {
    const { error, loading, success } = getThunkStatus([
      getRevenues,
      createRevenue,
      removeRevenuesInBatch,
      updateRevenue,
      removeExistingRevenue,
    ]);

    builder
      .addMatcher(error, (state) => {
        state.fetching = false;
      })
      .addMatcher(success, (state) => {
        state.fetching = false;
      })
      .addMatcher(loading, (state) => {
        state.fetching = true;
      });
  },
});

export const getRevenues = createAsyncThunk(
  'cash-flow/revenues/getRevenues',
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const { query } = (getState() as RootState).cashFlow.revenue;
      const revenues = await CashFlowService.getAllEntries(query);
      await dispatch(storeList(revenues));
    } catch (err: any) {
      return rejectWithValue({ ...err });
    }
  }
);

export const removeRevenuesInBatch = createAsyncThunk(
  'cash-flow/revenues/removeRevenuesInBatch',
  async (ids: number[], { dispatch }) => {
    await CashFlowService.removeEntriesBatch(ids);
    await dispatch(getRevenues());
  }
);

export const removeExistingRevenue = createAsyncThunk(
  'cash-flow/revenues/removeExistingRevenue',
  async (id: number, { dispatch }) => {
    await CashFlowService.removeExistingEntry(id);
    await dispatch(getRevenues());
  }
);

export const setQuery = createAsyncThunk(
  'cash-flow/expenses/setQuery',
  async (query: Partial<CashFlow.Query>, { dispatch }) => {
    await dispatch(_setQuery(query));
    await dispatch(getRevenues());
  }
);

export const createRevenue = createAsyncThunk(
  'cash-flow/revenues/createExpense',
  async (revenue: CashFlow.EntryInput, { dispatch, rejectWithValue }) => {
    try {
      await CashFlowService.insertNewEntry(revenue);
      await dispatch(getRevenues());
    } catch (err) {
      if (typeof err === 'object') return rejectWithValue({ ...err });
    }
  }
);

export const updateRevenue = createAsyncThunk(
  'cash-flow/revenues/updateRevenue',
  async (
    { entryId, entry }: { entryId: number; entry: CashFlow.EntryInput },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await CashFlowService.updateExistingEntry(entryId, entry);
      await dispatch(getRevenues());
    } catch (err) {
      if (typeof err === 'object') return rejectWithValue({ ...err });
    }
  }
);

export const {
  storeList,
  setSelectedRevenues,
  setQuery: _setQuery,
  setFetching,
} = revenueSlice.actions;

const revenueReducer = revenueSlice.reducer;

export default revenueReducer;
