import useBreadcrumb from '../../core/hooks/useBreadcrumb';
import userPageTitle from '../../core/hooks/usePageTitle';
import UserForm from '../features/UserForm';

export default function UserCreateView() {
  userPageTitle('Cadastro de usuário');
  useBreadcrumb('Usuários/Cadastro');

  return <UserForm></UserForm>;
}
