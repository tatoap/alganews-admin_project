import userPageTitle from '../../core/hooks/usePageTitle';
import UserForm from '../features/UserForm';

export default function UserCreateView() {
  userPageTitle('Cadastro de usuário');

  return <UserForm></UserForm>;
}
