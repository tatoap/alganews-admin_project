import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './../store/index';
import * as CategoryActions from '../store/EntriesCategory.slice';
import { useCallback } from 'react';
import { CashFlow } from 'tato_ap-sdk';

export default function useEntriesCategories() {
  const dispatch = useDispatch<AppDispatch>();

  const expenses = useSelector((s: RootState) => s.cashFlow.categories.expenses);
  const revenues = useSelector((s: RootState) => s.cashFlow.categories.revenues);
  const fetching = useSelector((s: RootState) => s.cashFlow.categories.fetching);

  const fetchCategories = useCallback(
    () => dispatch(CategoryActions.getCategories()).unwrap(),
    [dispatch]
  );

  const createCategory = useCallback(
    (category: CashFlow.CategoryInput) =>
      dispatch(CategoryActions.createCategory(category)).unwrap(),
    [dispatch]
  );

  const deleteCategory = useCallback(
    (categoryId: number) => dispatch(CategoryActions.deleteCategory(categoryId)).unwrap(),
    [dispatch]
  );

  return {
    expenses,
    revenues,
    fetching,
    fetchCategories,
    createCategory,
    deleteCategory,
  };
}
