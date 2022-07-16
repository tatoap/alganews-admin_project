import {
  Button,
  Switch,
  Table,
  Tag,
  Avatar,
  Space,
  Card,
  Input,
  Descriptions,
  Tooltip,
  Row,
} from 'antd';
import { useEffect } from 'react';
import { User } from 'tato_ap-sdk';
import { EyeOutlined, EditOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import useUsers from '../../core/hooks/useUsers';
import { ColumnProps } from 'antd/lib/table';
import { Link } from 'react-router-dom';
import format from 'date-fns/format';

export default function UserList() {
  const { users, fetchUsers, toggleUserStatus, fetching } = useUsers();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
  };

  const getColumnSearchProps = (
    dataIndex: keyof User.Summary,
    displayName?: string
  ): ColumnProps<User.Summary> => ({
    filterDropdown: ({ selectedKeys, setSelectedKeys, confirm, clearFilters }) => (
      <Card>
        <Input
          style={{ marginBottom: 8, display: 'block' }}
          value={selectedKeys[0]}
          placeholder={`Buscar ${displayName || dataIndex}`}
          onChange={(e) => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
          }}
          onPressEnter={() => confirm()}
        />
        <Space>
          <Button
            type={'primary'}
            size={'small'}
            style={{ width: 90 }}
            onClick={() => confirm()}
            icon={<SearchOutlined />}
          >
            Buscar
          </Button>
          <Button
            size={'small'}
            style={{ width: 90 }}
            onClick={() => {
              clearFilters && handleReset(clearFilters);
              confirm();
            }}
          >
            Limpar
          </Button>
        </Space>
      </Card>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#0099ff' : undefined }} />
    ),
    // @ts-ignore
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes((value as string).toLowerCase())
        : '',
  });

  return (
    <>
      <Row justify={'end'}>
        <Button icon={<ReloadOutlined />} onClick={() => fetchUsers()} loading={fetching}>
          Atualizar
        </Button>
      </Row>
      <Table<User.Summary>
        loading={fetching}
        dataSource={users}
        pagination={false}
        rowKey={'id'}
        columns={[
          {
            title: 'Usuários',
            responsive: ['xs'],
            render(user: User.Summary) {
              return (
                <Descriptions column={1} size={'small'}>
                  <Descriptions.Item label={'Nome'}>{user.name}</Descriptions.Item>
                  <Descriptions.Item label={'Email'}>{user.email}</Descriptions.Item>
                  <Descriptions.Item label={'Criação'}>
                    {format(new Date(user.createdAt), 'dd/MM/yyyy')}
                  </Descriptions.Item>
                  <Descriptions.Item label={'Perfil'}>
                    <Tag color={user.role === 'MANAGER' ? 'red' : 'blue'}>
                      {user.role === 'EDITOR'
                        ? 'Editor'
                        : user.role === 'MANAGER'
                        ? 'Gerente'
                        : 'Assistente'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label={'Ações'}>
                    <Button size='small' icon={<EyeOutlined />} />
                    <Button size='small' icon={<EditOutlined />} />
                  </Descriptions.Item>
                </Descriptions>
              );
            },
          },
          {
            dataIndex: 'avatarUrls',
            title: '',
            width: 48,
            fixed: 'left',
            responsive: ['sm'],
            render(avatarUrls: User.Summary['avatarUrls']) {
              return <Avatar size={'small'} src={avatarUrls.small} />;
            },
          },
          {
            dataIndex: 'name',
            title: 'Nome',
            width: 160,
            ellipsis: true,
            responsive: ['sm'],
            ...getColumnSearchProps('name', 'nome'),
          },
          {
            dataIndex: 'email',
            title: 'Email',
            ellipsis: true,
            width: 240,
            responsive: ['sm'],
            ...getColumnSearchProps('email', 'email'),
          },
          {
            dataIndex: 'role',
            title: 'Perfil',
            align: 'center',
            width: 100,
            responsive: ['sm'],
            sorter(a, b) {
              return a.role.localeCompare(b.role);
            },
            render(role) {
              return (
                <Tag color={role === 'MANAGER' ? 'red' : 'blue'}>
                  {role === 'EDITOR' ? 'Editor' : role === 'MANAGER' ? 'Gerente' : 'Assistente'}
                </Tag>
              );
            },
          },
          {
            dataIndex: 'createdAt',
            title: 'Criação',
            align: 'center',
            width: 120,
            responsive: ['sm'],
            sorter(a, b) {
              return new Date(a.createdAt) > new Date(b.createdAt) ? 1 : -1;
            },
            render(createdAt) {
              return format(new Date(createdAt), 'dd/MM/yyyy');
            },
          },
          {
            dataIndex: 'active',
            title: 'Ativo',
            align: 'center',
            width: 100,
            responsive: ['sm'],
            render(active: boolean, user) {
              return (
                <Switch
                  onChange={() => {
                    toggleUserStatus(user);
                  }}
                  checked={active}
                />
              );
            },
          },
          {
            dataIndex: 'id',
            title: 'Ações',
            align: 'center',
            width: 100,
            responsive: ['sm'],
            render(id: number) {
              return (
                <>
                  <Tooltip title={'Visualizar usuário'} placement={'left'}>
                    <Link to={`/usuarios/${id}`}>
                      <Button size='small' icon={<EyeOutlined />} />
                    </Link>
                  </Tooltip>

                  <Tooltip title={'Editar usuário'} placement={'right'}>
                    <Link to={`/usuarios/edicao/${id}`}>
                      <Button size='small' icon={<EditOutlined />} />
                    </Link>
                  </Tooltip>
                </>
              );
            },
          },
        ]}
      />
    </>
  );
}
