import { LockFilled } from '@ant-design/icons';
import { Card, Space, Typography } from 'antd';

interface ForbiddenErrorProps {
  minHeight?: number;
}

export default function Forbidden(props: ForbiddenErrorProps) {
  return (
    <Card
      style={{
        minHeight: props.minHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Space direction={'vertical'}>
        <Space align={'center'}>
          <LockFilled style={{ fontSize: 32 }} />
          <Typography.Title style={{ margin: 0 }}>Acesso negado</Typography.Title>
        </Space>
        <Typography.Paragraph>
          Você não tem permissão para visualizar estes dados
        </Typography.Paragraph>
      </Space>
    </Card>
  );
}
