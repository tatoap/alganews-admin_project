import { Menu, Layout, Drawer, DrawerProps, Button } from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  TableOutlined,
  PlusCircleOutlined,
  LaptopOutlined,
  DiffOutlined,
  FallOutlined,
  RiseOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import logo from '../../../assets/logo.svg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { useMemo, useState } from 'react';
import { SiderProps } from 'antd/lib/layout';

const { Sider } = Layout;

export default function DefaultLayoutSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { lg } = useBreakpoint();

  const [show, setShow] = useState(false);

  interface Props {
    children?: React.ReactNode;
  }

  const SidebarWrapper: React.FC<Props> = useMemo(() => (lg ? Sider : Drawer), [lg]);

  const siderProps = useMemo((): SiderProps => {
    return {
      width: 200,
      className: 'site-layout-background no-print',
    };
  }, []);

  const drawerProps = useMemo((): DrawerProps => {
    return {
      visible: show,
      closable: true,
      width: '60%',
      title: (
        <>
          <img src={logo} alt={'logo alganews'} />
        </>
      ),
      headerStyle: {
        height: 64,
      },
      bodyStyle: {
        padding: 0,
      },
      onClose() {
        setShow(false);
      },
      placement: 'left',
    };
  }, [show]);

  const sidebarProps = useMemo(() => {
    return lg ? siderProps : drawerProps;
  }, [lg, siderProps, drawerProps]);

  const menuItens = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to={'/'}>Home</Link>,
      onClick: () => {
        navigate('/', { replace: true });
        setShow(false);
      },
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
          onClick: () => {
            navigate('/usuarios', { replace: true });
            setShow(false);
          },
        },
        {
          key: '/usuarios/cadastro',
          label: <Link to={'/usuarios/cadastro'}>Cadastro</Link>,
          icon: <PlusCircleOutlined />,
          onClick: () => {
            navigate('/usuarios/cadastro', { replace: true });
            setShow(false);
          },
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
          onClick: () => {
            navigate('/pagamentos', { replace: true });
            setShow(false);
          },
        },
        {
          key: '/pagamentos/cadastro',
          label: <Link to={'/pagamentos/cadastro'}>Cadastro</Link>,
          icon: <PlusCircleOutlined />,
          onClick: () => {
            navigate('/pagamentos/cadastro', { replace: true });
            setShow(false);
          },
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
          onClick: () => {
            navigate('/fluxo-de-caixa/despesas', { replace: true });
            setShow(false);
          },
        },
        {
          key: '/fluxo-de-caixa/receitas',
          label: <Link to={'/fluxo-de-caixa/receitas'}>Receitas</Link>,
          icon: <RiseOutlined />,
          onClick: () => {
            navigate('/fluxo-de-caixa/receitas', { replace: true });
            setShow(false);
          },
        },
      ],
    },
  ];

  return (
    <>
      {!lg && (
        <Button
          icon={<MenuOutlined />}
          onClick={() => setShow(true)}
          type={'text'}
          style={{ position: 'fixed', top: 0, left: 0, height: 64, zIndex: 99 }}
        />
      )}
      <SidebarWrapper {...sidebarProps}>
        <Menu
          items={menuItens}
          mode='inline'
          defaultSelectedKeys={[location.pathname]}
          defaultOpenKeys={[location.pathname.split('/')[1]]}
          style={{ height: '100%', width: '50%', borderRight: 0 }}
        ></Menu>
      </SidebarWrapper>
    </>
  );
}
