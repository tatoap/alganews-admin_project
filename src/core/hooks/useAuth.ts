import { AppDispatch } from './../store/index';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { useCallback } from 'react';
import * as AuthActions from '../store/Auth.slice';

export default function useAuth() {
  const user = useSelector((s: RootState) => s.auth.user);
  const fetching = useSelector((s: RootState) => s.auth.fetching);

  const dispatch = useDispatch<AppDispatch>();

  const fetchUser = useCallback(
    (userId: number) => {
      return dispatch(AuthActions.fetchUser(userId)).unwrap();
    },
    [dispatch]
  );

  return {
    user,
    fetching,
    fetchUser,
  };
}
