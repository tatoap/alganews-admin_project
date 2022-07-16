import { WarningFilled } from '@ant-design/icons';
import { Button, Typography } from 'antd';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

interface NotFoundErrorProps {
  title: string;
  actionDestination: string;
  actionTitle: string;
}

export default function NotFoundError(props: NotFoundErrorProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <WarningFilled style={{ fontSize: 32 }} />
      <Title level={1} style={{ color: '#09f' }}>
        {props.title}
      </Title>
      <Paragraph>O recurso que você esta procurando não foi encontrado</Paragraph>
      <Link to={props.actionDestination}>
        <Button type='primary'>{props.actionTitle}</Button>
      </Link>
    </div>
  );
}
