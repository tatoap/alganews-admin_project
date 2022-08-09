import { AppDispatch } from './../store/index';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { RootState } from '../store';
import * as PaymentActions from '../store/Payment.slice';
import { Payment } from 'tato_ap-sdk';
import { Key } from 'antd/lib/table/interface';

export default function usePayments() {
  const dispatch = useDispatch<AppDispatch>();

  const fetching = useSelector((s: RootState) => s.payment.fetching);
  const payments = useSelector((s: RootState) => s.payment.paginated);
  const query = useSelector((s: RootState) => s.payment.query);
  const selected = useSelector((s: RootState) => s.payment.selected);

  const approvePaymentsInBatch = useCallback(
    (ids: number[]) => {
      dispatch(PaymentActions.approvePaymentsInBatch(ids));
    },
    [dispatch]
  );

  const fetchPayments = useCallback(
    () => dispatch(PaymentActions.getAllPayments()).unwrap(),
    [dispatch]
  );

  const setQuery = useCallback(
    (query: Payment.Query) => {
      dispatch(PaymentActions.setQuery(query));
    },
    [dispatch]
  );

  const setSelected = useCallback(
    (keys: Key[]) => {
      dispatch(PaymentActions.storeSelectedKeys(keys));
    },
    [dispatch]
  );

  const removeExistingPayment = useCallback(
    (paymentId: number) => {
      dispatch(PaymentActions.removeExistingPayment(paymentId));
    },
    [dispatch]
  );

  return {
    payments,
    fetching,
    query,
    selected,
    setQuery,
    fetchPayments,
    approvePaymentsInBatch,
    setSelected,
    removeExistingPayment,
  };
}
