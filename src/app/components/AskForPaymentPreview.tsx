import { Card, Row, Typography } from 'antd';
import CustomError from 'tato_ap-sdk/dist/CustomError';
import tax from '../../assets/tax-picture.svg';
import confusing from '../../assets/confusing.svg';

interface AskForPaymentPreviewProps {
  error?: CustomError;
}

export default function AskForPaymentPreview(props: AskForPaymentPreviewProps) {
  return (
    <Card bordered={false}>
      <Row justify='center' style={{ textAlign: 'center' }}>
        <img
          key={props.error ? 'errorImg' : 'img'}
          src={props.error ? confusing : tax}
          alt={'tax'}
          width={240}
        ></img>
        <Typography.Title level={3} style={{ maxWidth: 360 }}>
          {props.error ? props.error.message : 'Selecione um editor e um período'}
        </Typography.Title>
        <Typography.Paragraph style={{ textAlign: 'center' }}>
          {
            'Para podermos gerar uma prévia do pagamento, por favor, selecione e preencha os campos "Editor" e "Período"'
          }
        </Typography.Paragraph>
      </Row>
    </Card>
  );
}
