import { notification, Skeleton } from 'antd';
import moment from 'moment';
import { useCallback, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { User, UserService } from 'tato_ap-sdk';
import useUser from '../../core/hooks/useUser';
import UserForm from '../features/UserForm';

export default function UserEditView() {
  const params = useParams<{ id: string }>();
  const { user, fetchUser } = useUser();

  useEffect(() => {
    if (!isNaN(Number(params.id))) fetchUser(Number(params.id));
  }, [fetchUser, params.id]);

  const transformUserData = useCallback((user: User.Detailed) => {
    return {
      ...user,
      createdAt: moment(user.createdAt),
      updatedAt: moment(user.updatedAt),
      birthdate: moment(user.birthdate),
    };
  }, []);

  if (isNaN(Number(params.id))) {
    return <Navigate to={'/usuarios'} />;
  }

  if (!user) return <Skeleton />;

  function handleUserUpdate(user: User.Input) {
    UserService.updateExistingUser(Number(params.id), user).then(() => {
      notification.success({
        message: 'Usuário foi atualizado com sucesso',
      });
    });
  }

  return (
    <>
      <UserForm onUpdate={handleUserUpdate} user={transformUserData(user)} />
    </>
  );
}
