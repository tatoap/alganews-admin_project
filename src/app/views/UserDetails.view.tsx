import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Popconfirm,
  Progress,
  Row,
  Skeleton,
  Space,
  Switch,
  Table,
  Tooltip,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { Link, Navigate, useParams } from 'react-router-dom';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import useUser from '../../core/hooks/useUser';
import confirm from 'antd/lib/modal/confirm';
import { WarningFilled } from '@ant-design/icons';
import usePosts from '../../core/hooks/usePosts';
import { Post } from 'tato_ap-sdk';
import userPageTitle from '../../core/hooks/usePageTitle';
import formatPhone from '../../core/utils/formatPhone';
import NotFoundError from '../components/NotFoundError';
import useBreadcrumb from '../../core/hooks/useBreadcrumb';

export default function UserDetailsView() {
  userPageTitle('Detalhes do usuário');
  useBreadcrumb('Usuário/Detalhes');

  const params = useParams<{ id: string }>();
  const { user, fetchUser, notFound, toggleUserStatus } = useUser();
  const { posts, fetchUserPosts, togglePostStatus, loadingFetch, loadingToggle } = usePosts();
  const [page, setPage] = useState(0);

  const { lg } = useBreakpoint();

  useEffect(() => {
    if (!isNaN(Number(params.id))) fetchUser(Number(params.id));
  }, [fetchUser, params.id]);

  useEffect(() => {
    if (user?.role === 'EDITOR') fetchUserPosts(user.id, page);
  }, [fetchUserPosts, user, page]);

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

  return (
    <Row gutter={24}>
      <Col xs={24} lg={4}>
        <Row justify='center'>
          <Avatar size={120} src={user.avatarUrls.small} />
        </Row>
      </Col>
      <Col xs={24} lg={20}>
        <Space style={{ width: '100% ' }} direction={'vertical'} align={lg ? 'start' : 'center'}>
          <Typography.Title level={2}>{user.name}</Typography.Title>
          <Typography.Paragraph
            style={{
              textAlign: lg ? 'left' : 'center',
            }}
            ellipsis={{
              rows: 2,
            }}
          >
            {user.bio}
          </Typography.Paragraph>
          <Space>
            <Link to={`/usuarios/edicao/${user.id}`}>
              <Button type={'primary'}>Editar perfil</Button>
            </Link>
            <Popconfirm
              title={user.active ? `Desabilitar ${user.name}?` : `Habilitar ${user.name}`}
              disabled={
                (user.active && !user.canBeDeactivated) || (!user.active && !user.canBeActivated)
              }
              onConfirm={() => {
                confirm({
                  icon: <WarningFilled style={{ color: '#09f' }} />,
                  title: `Tem certeza de que deseja ${user.active ? `desabilitar` : `habilitar`} ${
                    user.name
                  }?`,
                  onOk() {
                    toggleUserStatus(user).then(() => {
                      fetchUser(Number(params.id));
                    });
                  },
                  content: user.active
                    ? 'Desabilitar um usuário fará com que ele seja automaticamente desligado da plataforma, podendo causar prejuízos em seus ganhos.'
                    : 'Habilitar um usuário fará com que ele ganhe acesso a plataforma novamente, possibilitando criação e publicação de posts.',
                });
              }}
            >
              <Button
                type={'primary'}
                disabled={
                  (user.active && !user.canBeDeactivated) || (!user.active && !user.canBeActivated)
                }
              >
                {user.active ? 'Desabilitar' : 'Habilitar'}{' '}
              </Button>
            </Popconfirm>
          </Space>
        </Space>
      </Col>
      <Divider />
      {!!user.skills?.length && (
        <Col xs={24} lg={12}>
          <Space direction='vertical' style={{ width: '100%' }}>
            {user.skills?.map((skill) => (
              <div key={skill.name}>
                <Typography.Text>{skill.name}</Typography.Text>
                <Progress percent={skill.percentage} success={{ percent: 0 }} />
              </div>
            ))}
          </Space>
        </Col>
      )}
      <Col xs={24} lg={12}>
        <Descriptions column={1} size={'small'} bordered>
          <Descriptions.Item label={'País'}>{user.location.country}</Descriptions.Item>
          <Descriptions.Item label={'Cidade'}>{user.location.city}</Descriptions.Item>
          <Descriptions.Item label={'Estado'}>{user.location.state}</Descriptions.Item>
          <Descriptions.Item label={'Telefone'}>{formatPhone(user.phone)}</Descriptions.Item>
        </Descriptions>
      </Col>
      {user.role === 'EDITOR' && (
        <>
          <Divider />
          <Col lg={24}>
            <Table<Post.Summary>
              loading={loadingFetch}
              dataSource={posts?.content}
              pagination={{
                onChange: (page) => setPage(page - 1),
                total: posts?.totalElements,
                pageSize: 10,
              }}
              rowKey={'id'}
              columns={[
                {
                  title: 'Posts',
                  responsive: ['xs'],
                  render(element) {
                    return (
                      <Descriptions column={1} size={'small'}>
                        <Descriptions.Item label={'Título'}>{element.title}</Descriptions.Item>
                        <Descriptions.Item label={'Criação'}>
                          {moment(element.createdAt).format('DD/MM/YYYY')}
                        </Descriptions.Item>
                        <Descriptions.Item label={'Última atualização'}>
                          {moment(element.updatedAt).format('DD/MM/YYYY')}
                        </Descriptions.Item>
                        <Descriptions.Item label={'Publicado'}>
                          {element.published}
                        </Descriptions.Item>
                      </Descriptions>
                    );
                  },
                },
                {
                  dataIndex: 'title',
                  title: 'Título',
                  width: 300,
                  ellipsis: true,
                  responsive: ['sm'],
                  render: (item) => {
                    return <Tooltip title={item}>{item}</Tooltip>;
                  },
                },
                {
                  dataIndex: 'createdAt',
                  title: 'Criação',
                  width: 180,
                  ellipsis: true,
                  responsive: ['sm'],
                  render: (item) => moment(item).format('DD/MM/YYYY'),
                },
                {
                  dataIndex: 'updatedAt',
                  title: 'Última atualização',
                  width: 200,
                  ellipsis: true,
                  responsive: ['sm'],
                  render: (item) => moment(item).format('DD/MM/YYYY \\à\\s\\ HH:MM'),
                },
                {
                  dataIndex: 'published',
                  title: 'Publicado',
                  align: 'center',
                  width: 120,
                  responsive: ['sm'],
                  render(published: boolean, post) {
                    return (
                      <Switch
                        loading={loadingToggle}
                        checked={published}
                        onChange={() => {
                          togglePostStatus(post).then(() => fetchUserPosts(post.editor.id));
                        }}
                      />
                    );
                  },
                },
              ]}
            ></Table>
          </Col>
        </>
      )}
    </Row>
  );
}
