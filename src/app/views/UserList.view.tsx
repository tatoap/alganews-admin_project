import { Col, Row } from 'antd';
import userPageTitle from '../../core/hooks/usePageTitle';
import UserList from '../features/UserList';

export default function UserListView() {
  userPageTitle('Consulta de usuários');

  return (
    <Row>
      <Col xs={24}>
        <UserList />
      </Col>
    </Row>
  );
}
