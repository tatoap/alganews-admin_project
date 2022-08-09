import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';
import { Key } from 'react';
import { CashFlow, CashFlowService } from 'tato_ap-sdk';
import { RootState } from '.';
import getThunkStatus from '../utils/getThunkStatus';

interface ExpenseState {
  list: CashFlow.EntrySummary[];
  fetching: boolean;
  query: CashFlow.Query;
  selected: Key[];
}

const params = new URLSearchParams(window.location.search);
const yearMonth = params.get('yearMonth');

const initialState: ExpenseState = {
  list: [],
  fetching: false,
  query: {
    type: 'EXPENSE',
    sort: ['transactedOn', 'desc'],
    yearMonth: yearMonth || moment().format('YYYY-MM'),
  },
  selected: [],
};

const expenseSlice = createSlice({
  initialState,
  name: 'cash-flow/expenses',
  reducers: {
    storeList(state, action: PayloadAction<CashFlow.EntrySummary[]>) {
      state.list = action.payload;
    },
    setSelectedExpenses(state, action: PayloadAction<Key[]>) {
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
      getExpenses,
      createExpense,
      removeExpensesInBatch,
      updateExpense,
      removeExistingExpense,
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

export const getExpenses = createAsyncThunk(
  'cash-flow/expenses/getExpenses',
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const { query } = (getState() as RootState).cashFlow.expense;
      const expenses = await CashFlowService.getAllEntries(query);
      await dispatch(storeList(expenses));
    } catch (err: any) {
      return rejectWithValue({ ...err });
    }
  }
);

export const removeExpensesInBatch = createAsyncThunk(
  'cash-flow/expenses/removeExpensesInBatch',
  async (ids: number[], { dispatch }) => {
    await CashFlowService.removeEntriesBatch(ids);
    await dispatch(getExpenses());
  }
);

export const removeExistingExpense = createAsyncThunk(
  'cash-flow/expenses/removeExistingExpense',
  async (id: number, { dispatch }) => {
    await CashFlowService.removeExistingEntry(id);
    await dispatch(getExpenses());
  }
);

export const setQuery = createAsyncThunk(
  'cash-flow/expenses/setQuery',
  async (query: Partial<CashFlow.Query>, { dispatch }) => {
    await dispatch(_setQuery(query));
    await dispatch(getExpenses());
  }
);

export const createExpense = createAsyncThunk(
  'cash-flow/expenses/createExpense',
  async (expense: CashFlow.EntryInput, { dispatch, rejectWithValue }) => {
    try {
      await CashFlowService.insertNewEntry(expense);
      await dispatch(getExpenses());
    } catch (err) {
      if (typeof err === 'object') return rejectWithValue({ ...err });
    }
  }
);

export const updateExpense = createAsyncThunk(
  'cash-flow/expenses/updateExpense',
  async (
    { entryId, entry }: { entryId: number; entry: CashFlow.EntryInput },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await CashFlowService.updateExistingEntry(entryId, entry);
      await dispatch(getExpenses());
    } catch (err) {
      if (typeof err === 'object') return rejectWithValue({ ...err });
    }
  }
);

export const {
  storeList,
  setSelectedExpenses,
  setQuery: _setQuery,
  setFetching,
} = expenseSlice.actions;

const expenseReducer = expenseSlice.reducer;

export default expenseReducer;
