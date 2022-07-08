import { Menu, Layout } from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  TableOutlined,
  PlusCircleOutlined,
  LaptopOutlined,
  DiffOutlined,
  FallOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const { Sider } = Layout;

export default function DefaultLayoutSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItens = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to={'/'}>Home</Link>,
      onClick: () => navigate('/', { replace: true }),
    },
    {
      key: 'usuarios',
      icon: <UserOutlined />,
      label: 'Usuários',
      children: [
        {
          key: '/usuarios',
          label: <Link to={'/usuarios'}>Consulta</Link>,
          icon: <TableOutlined />,
          onClick: () => navigate('/usuarios', { replace: true }),
        },
        {
          key: '/usuarios/cadastro',
          label: <Link to={'/usuarios/cadastro'}>Cadastro</Link>,
          icon: <PlusCircleOutlined />,
          onClick: () => navigate('/usuarios/cadastro', { replace: true }),
        },
      ],
    },
    {
      key: 'pagamentos',
      label: 'Pagamentos',
      icon: <LaptopOutlined />,
      children: [
        {
          key: '/pagamentos',
          label: <Link to={'/pagamentos'}>Consulta</Link>,
          icon: <TableOutlined />,
          onClick: () => navigate('/pagamentos', { replace: true }),
        },
        {
          key: '/pagamentos/cadastro',
          label: <Link to={'/pagamentos/cadastro'}>Cadastro</Link>,
          icon: <PlusCircleOutlined />,
          onClick: () => navigate('/pagamentos/cadastro', { replace: true }),
        },
      ],
    },
    {
      key: 'fluxo-de-caixa',
      label: 'Fluxo de caixa',
      icon: <DiffOutlined />,
      children: [
        {
          key: '/fluxo-de-caixa/despesas',
          label: <Link to={'/fluxo-de-caixa/despesas'}>Despesas</Link>,
          icon: <FallOutlined />,
          onClick: () => navigate('/fluxo-de-caixa/despesas', { replace: true }),
        },
        {
          key: '/fluxo-de-caixa/receitas',
          label: <Link to={'/fluxo-de-caixa/receitas'}>Receitas</Link>,
          icon: <RiseOutlined />,
          onClick: () => navigate('/fluxo-de-caixa/receitas', { replace: true }),
        },
      ],
    },
  ];

  return (
    <Sider width={200} className='site-layout-background' breakpoint='lg' collapsedWidth='0'>
      <Menu
        items={menuItens}
        mode='inline'
        defaultSelectedKeys={[location.pathname]}
        defaultOpenKeys={[location.pathname.split('/')[1]]}
        style={{ height: '100%', borderRight: 0 }}
      ></Menu>
    </Sider>
  );
}
