import { Descriptions, Skeleton, Typography } from 'antd';
import Title from 'antd/lib/typography/Title';
import { Payment } from 'tato_ap-sdk';
import transformIntoBrl from '../../core/utils/transformIntoBrl';

interface PaymentBonusesProps {
  loading?: boolean;
  bonuses?: Payment.Detailed['bonuses'];
}

export default function PaymentBonuses(props: PaymentBonusesProps) {
  if (props.loading) return <Skeleton />;

  return (
    <>
      <Title level={2}>
        <Typography>Bônus</Typography>
      </Title>
      <Descriptions column={1} size={'small'} bordered>
        {props.bonuses?.map((bonus, index) => {
          return (
            <Descriptions.Item key={index} label={bonus.title}>
              {transformIntoBrl(bonus.amount)}
            </Descriptions.Item>
          );
        })}
      </Descriptions>
    </>
  );
}
