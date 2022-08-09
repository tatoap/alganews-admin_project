import { Col, Row } from 'antd';
import useBreadcrumb from '../../core/hooks/useBreadcrumb';
import userPageTitle from '../../core/hooks/usePageTitle';
import UserList from '../features/UserList';

export default function UserListView() {
  userPageTitle('Consulta de usuários');
  useBreadcrumb('Usuários/Consulta');

  return (
    <Row>
      <Col xs={24}>
        <UserList />
      </Col>
    </Row>
  );
}
