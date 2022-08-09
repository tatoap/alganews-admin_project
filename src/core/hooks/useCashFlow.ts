import { AppDispatch } from './../store/index';
import { useSelector, useDispatch } from 'react-redux';
import { Key, useCallback } from 'react';
import { CashFlow } from 'tato_ap-sdk';
import { RootState } from '../store';
import * as ExpensesActions from '../store/Expense.slice';
import * as RevenuesActions from '../store/Revenue.slice';

type CashFlowEntryType = CashFlow.EntrySummary['type'];

export default function useCashFlow(type: CashFlowEntryType) {
  const dispatch = useDispatch<AppDispatch>();

  const query = useSelector((s: RootState) =>
    type === 'EXPENSE' ? s.cashFlow.expense.query : s.cashFlow.revenue.query
  );
  const entries = useSelector((s: RootState) =>
    type === 'EXPENSE' ? s.cashFlow.expense.list : s.cashFlow.revenue.list
  );
  const fetching = useSelector((s: RootState) =>
    type === 'EXPENSE' ? s.cashFlow.expense.fetching : s.cashFlow.revenue.fetching
  );
  const selected = useSelector((s: RootState) =>
    type === 'EXPENSE' ? s.cashFlow.expense.selected : s.cashFlow.revenue.selected
  );

  const fetchEntries = useCallback(
    () =>
      dispatch(
        type === 'EXPENSE' ? ExpensesActions.getExpenses() : RevenuesActions.getRevenues()
      ).unwrap(),
    [dispatch, type]
  );

  const removeEntries = useCallback(
    (ids: number[]) =>
      dispatch(
        type === 'EXPENSE'
          ? ExpensesActions.removeExpensesInBatch(ids)
          : RevenuesActions.removeRevenuesInBatch(ids)
      ),
    [dispatch, type]
  );

  const removeExistingEntry = useCallback(
    (id: number) =>
      dispatch(
        type === 'EXPENSE'
          ? ExpensesActions.removeExistingExpense(id)
          : RevenuesActions.removeExistingRevenue(id)
      ),
    [dispatch, type]
  );

  const setSelected = useCallback(
    (keys: Key[]) =>
      dispatch(
        type === 'EXPENSE'
          ? ExpensesActions.setSelectedExpenses(keys)
          : RevenuesActions.setSelectedRevenues(keys)
      ),
    [dispatch, type]
  );

  const setQuery = useCallback(
    (query: Partial<CashFlow.Query>) =>
      dispatch(
        type === 'EXPENSE' ? ExpensesActions.setQuery(query) : RevenuesActions.setQuery(query)
      ),
    [dispatch, type]
  );

  const createEntry = useCallback(
    (entry: CashFlow.EntryInput) =>
      dispatch(
        type === 'EXPENSE'
          ? ExpensesActions.createExpense(entry)
          : RevenuesActions.createRevenue(entry)
      ).unwrap(),
    [dispatch, type]
  );

  const updateEntry = useCallback(
    (entryId: number, entry: CashFlow.EntryInput) =>
      dispatch(
        type === 'EXPENSE'
          ? ExpensesActions.updateExpense({ entryId, entry })
          : RevenuesActions.updateRevenue({ entryId, entry })
      ).unwrap(),
    [dispatch, type]
  );

  return {
    entries,
    fetchEntries,
    query,
    fetching,
    setQuery,
    selected,
    setSelected,
    removeEntries,
    createEntry,
    updateEntry,
    removeExistingEntry,
  };
}
