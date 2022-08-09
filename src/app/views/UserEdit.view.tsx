import { Card, notification, Skeleton } from 'antd';
import moment from 'moment';
import { useCallback, useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { User, UserService } from 'tato_ap-sdk';
import useBreadcrumb from '../../core/hooks/useBreadcrumb';
import userPageTitle from '../../core/hooks/usePageTitle';
import useUser from '../../core/hooks/useUser';
import NotFoundError from '../components/NotFoundError';
import UserForm from '../features/UserForm';

export default function UserEditView() {
  userPageTitle('Edição de usuário');
  useBreadcrumb('Usuário/Edição');

  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const { user, fetchUser, notFound } = useUser();

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

  if (notFound)
    return (
      <Card>
        <NotFoundError
          title={'Usuário não encontrado'}
          actionDestination='/usuarios'
          actionTitle='Voltar para lista de usuários'
        />
      </Card>
    );

  if (!user) return <Skeleton />;

  async function handleUserUpdate(user: User.Input) {
    await UserService.updateExistingUser(Number(params.id), user).then(() => {
      navigate('/usuarios', { replace: true });
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
