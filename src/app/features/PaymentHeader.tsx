import { Descriptions, Divider, Skeleton, Space, Tag, Typography } from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import Paragraph from 'antd/lib/typography/Paragraph';
import Title from 'antd/lib/typography/Title';
import moment from 'moment';
import transformIntoBrl from '../../core/utils/transformIntoBrl';

interface PaymentHeaderProps {
  loading?: boolean;
  editorId?: number;
  editorName?: string;
  periodStart?: string;
  periodEnd?: string;
  postsEarnings?: number;
  totalEarnings?: number;
}

export default function PaymentHeader(props: PaymentHeaderProps) {
  const { xs } = useBreakpoint();

  if (props.loading) return <Skeleton />;

  return (
    <>
      <Title>
        <Typography>Pagamento</Typography>
      </Title>
      <Paragraph>A base do pagamento é calculada pela quantidade de palavras escritas</Paragraph>
      <Divider />
      <Descriptions column={xs ? 1 : 2} size={xs ? 'small' : 'default'}>
        <Descriptions.Item label={'Editor'}>{props.editorName}</Descriptions.Item>
        <Descriptions.Item label={'Período'}>
          <Space size={8}>
            <Tag style={{ margin: 0 }}>{moment(props.periodStart).format('DD/MM/YYYY')}</Tag>
            {'à'}
            <Tag>{moment(props.periodEnd).format('DD/MM/YYYY')}</Tag>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label={'Ganhos por posts'}>
          <Tag>{transformIntoBrl(props.postsEarnings)}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label={'Total'}>
          <Tag>{transformIntoBrl(props.totalEarnings)}</Tag>
        </Descriptions.Item>
      </Descriptions>
    </>
  );
}
