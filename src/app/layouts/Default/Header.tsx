import { Layout, Row, Avatar, Dropdown, Menu, Card, Tag, Divider } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import logo from '../../../assets/logo.svg';
import useAuth from '../../../core/hooks/useAuth';
import Meta from 'antd/lib/card/Meta';
import { Link } from 'react-router-dom';
import confirm from 'antd/lib/modal/confirm';
import AuthService from '../../../auth/Authorization.service';

const { Header } = Layout;

export default function DefaultLayoutHeader() {
  const { user } = useAuth();

  return (
    <Header className='header no-print'>
      <Row
        justify='space-between'
        style={{ height: '100%', maxWidth: 1190, margin: '0 auto' }}
        align='middle'
      >
        <img src={logo} alt={'AlgaNews Admin'} />
        <Dropdown
          placement={'bottomRight'}
          overlay={
            <Menu style={{ width: 200 }}>
              <Card bordered={false}>
                <Meta
                  title={user?.name}
                  description={
                    <Tag color={user?.role === 'MANAGER' ? 'red' : 'blue'}>
                      {user?.role === 'EDITOR'
                        ? 'Editor'
                        : user?.role === 'MANAGER'
                        ? 'Gerente'
                        : 'Assistente'}
                    </Tag>
                  }
                />
              </Card>
              <Divider style={{ margin: 0 }} />
              <Menu.Item key={1} icon={<UserOutlined />}>
                <Link to={`/usuarios/${user?.id}`}>Meu perfil</Link>
              </Menu.Item>
              <Menu.Item
                key={2}
                icon={<LogoutOutlined />}
                onClick={() =>
                  confirm({
                    title: 'Sair do sistema',
                    content:
                      'Deseja realmente sair do sistema? Será necessário inserir as credenciais para acessá-lo novamente.',
                    onOk() {
                      AuthService.imperativelySendToLogout();
                    },
                    closable: true,
                    okButtonProps: { danger: true },
                    okText: 'Sair',
                    cancelText: 'Permanecer logado',
                  })
                }
                danger
              >
                Sair do sistema
              </Menu.Item>
            </Menu>
          }
        >
          <Avatar src={user?.avatarUrls.small} />
        </Dropdown>
      </Row>
    </Header>
  );
}
