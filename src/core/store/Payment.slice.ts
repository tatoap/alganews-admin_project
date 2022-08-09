import { RootState } from './index';
import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  PayloadAction,
  isRejected,
  isPending,
} from '@reduxjs/toolkit';
import PaymentService from 'tato_ap-sdk/dist/services/Payment.service';
import { Payment } from 'tato_ap-sdk';
import { Key } from 'antd/lib/table/interface';

interface PaymentState {
  paginated: Payment.Paginated;
  fetching: boolean;
  query: Payment.Query;
  selected: Key[];
}

const initialState: PaymentState = {
  fetching: false,
  selected: [],
  query: {
    sort: ['scheduledTo', 'desc'],
    page: 0,
    size: 7,
  },
  paginated: {
    page: 0,
    size: 7,
    totalPages: 1,
    totalElements: 0,
    content: [],
  },
};

export const getAllPayments = createAsyncThunk(
  'payment/getAllPayments',
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const {
        payment: { query },
      } = getState() as RootState;
      const paymentPaginated = await PaymentService.getAllPayments(query);
      await dispatch(storeList(paymentPaginated));
    } catch (err: any) {
      return rejectWithValue({ ...err });
    }
  }
);

export const approvePaymentsInBatch = createAsyncThunk(
  'payment/approvePaymentsInBatch',
  async (paymentIds: number[], { dispatch }) => {
    await PaymentService.approvePaymentsBatch(paymentIds);
    await dispatch(getAllPayments());
    await dispatch(storeSelectedKeys([]));
  }
);

export const removeExistingPayment = createAsyncThunk(
  'payment/removeExistingPayment',
  async (paymentId: number, { dispatch }) => {
    await PaymentService.removeExistingPayment(paymentId);
    await dispatch(getAllPayments());
    await dispatch(storeSelectedKeys([]));
  }
);

export const setQuery = createAsyncThunk(
  'payment/setQuery',
  async (query: Payment.Query, { dispatch }) => {
    await dispatch(storeQuery(query));
    await dispatch(getAllPayments());
  }
);

const PaymentSlice = createSlice({
  initialState,
  name: 'payment',
  reducers: {
    storeList(state, action: PayloadAction<Payment.Paginated>) {
      state.paginated = action.payload;
    },
    storeQuery(state, action: PayloadAction<Payment.Query>) {
      state.query = {
        ...state.query,
        ...action.payload,
      };
    },
    storeSelectedKeys(state, action: PayloadAction<Key[]>) {
      state.selected = action.payload;
    },
  },
  extraReducers(builder) {
    const success = isFulfilled(getAllPayments, approvePaymentsInBatch);
    const error = isRejected(getAllPayments, approvePaymentsInBatch);
    const pending = isPending(getAllPayments, approvePaymentsInBatch);

    builder
      .addMatcher(success, (state) => {
        state.fetching = false;
      })
      .addMatcher(error, (state, action) => {
        state.fetching = false;
      })
      .addMatcher(pending, (state) => {
        state.fetching = true;
      });
  },
});

export const { storeQuery, storeList, storeSelectedKeys } = PaymentSlice.actions;

const PaymentReducer = PaymentSlice.reducer;

export default PaymentReducer;
