import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { CashFlow, CashFlowService } from 'tato_ap-sdk';
import getThunkStatus from '../utils/getThunkStatus';

interface EntriesCategoryState {
  fetching: boolean;
  expenses: CashFlow.CategorySummary[];
  revenues: CashFlow.CategorySummary[];
}

const initialState: EntriesCategoryState = {
  fetching: false,
  expenses: [],
  revenues: [],
};

const entriesCategorySlice = createSlice({
  initialState,
  name: 'cash-flow/categories',
  reducers: {
    storeExpenses(state, action: PayloadAction<CashFlow.CategorySummary[]>) {
      state.expenses = action.payload;
    },
    storeRevenues(state, action: PayloadAction<CashFlow.CategorySummary[]>) {
      state.revenues = action.payload;
    },
    storeFetching(state, action: PayloadAction<boolean>) {
      state.fetching = action.payload;
    },
  },
  extraReducers(builder) {
    const { error, loading, success } = getThunkStatus([
      getCategories,
      createCategory,
      deleteCategory,
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

export const getCategories = createAsyncThunk(
  'cash-flow/categories/getCategories',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const categories = await CashFlowService.getAllCategories({
        sort: ['id', 'desc'],
      });

      /**
       * utilizando filtro local porque a API não provê uma forma
       * de recuperar as categorias separadamente por tipo
       * @todo: melhorar isso assim que a API prover um endpoint
       */

      const expensesCategories = categories.filter((c) => c.type === 'EXPENSE');
      const revenuesCategories = categories.filter((c) => c.type === 'REVENUE');

      await dispatch(storeExpenses(expensesCategories));
      await dispatch(storeRevenues(revenuesCategories));
    } catch (err: any) {
      return rejectWithValue({ ...err });
    }
  }
);

export const createCategory = createAsyncThunk(
  'cash-flow/categories/createCategory',
  async (category: CashFlow.CategoryInput, { dispatch }) => {
    await CashFlowService.insertNewCategory(category);
    await dispatch(getCategories());
  }
);

export const deleteCategory = createAsyncThunk(
  'cash-flow/categories/deleteCategory',
  async (categoryId: number, { dispatch }) => {
    await CashFlowService.removeExistingCategory(categoryId);
    await dispatch(getCategories());
  }
);

export const { storeExpenses, storeRevenues, storeFetching } = entriesCategorySlice.actions;

const entriesCategoryReducers = entriesCategorySlice.reducer;

export default entriesCategoryReducers;
