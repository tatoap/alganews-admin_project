import { Button, Card, Divider, notification, Tag } from 'antd';
import { PrinterOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import userPageTitle from '../../core/hooks/usePageTitle';
import usePayment from '../../core/hooks/usePayment';
import NotFoundError from '../components/NotFoundError';
import PaymentBonuses from '../features/PaymentBonuses';
import PaymentHeader from '../features/PaymentHeader';
import PaymentPosts from '../features/PaymentPosts';
import DoubleConfirm from '../components/DoubleConfirm';
import moment from 'moment';
import useBreadcrumb from '../../core/hooks/useBreadcrumb';

export default function PaymentDetailsView() {
  userPageTitle('Detalhes do pagamento');
  useBreadcrumb('Pagamento/Detalhes');

  const {
    posts,
    payment,
    fetchingPosts,
    fetchingPayment,
    approvingPayment,
    notFound,
    fetchPosts,
    fetchPayment,
    approvePayment,
  } = usePayment();
  const params = useParams<{ id: string }>();

  useEffect(() => {
    if (!isNaN(Number(params.id))) {
      fetchPayment(Number(params.id));
      fetchPosts(Number(params.id));
    }
  }, [fetchPayment, fetchPosts, params.id]);

  console.log(payment);

  if (isNaN(Number(params.id))) {
    return <Navigate to={'/pagamentos'} />;
  }

  if (notFound)
    return (
      <Card>
        <NotFoundError
          title={'Pagamento não encontrado'}
          actionDestination='/pagamentos'
          actionTitle='Voltar para lista de pagamentos'
        />
      </Card>
    );

  return (
    <>
      <Button
        className='no-print'
        icon={<PrinterOutlined />}
        type={'primary'}
        style={{ marginBottom: 16 }}
        onClick={window.print}
      >
        {'Imprimir'}
      </Button>
      {payment?.approvedAt === null ? (
        <DoubleConfirm
          popConfirmTitle={'Deseja aprovar este agendamento?'}
          modalTitle={'Ação irreversível'}
          modalContent={
            'Aprovar um agendamento de pagamento gera uma despesa que não pode ser removida do fluxo de caixa. Essa ação não poderá ser desfeita.'
          }
          onConfirm={async () => {
            await approvePayment(payment.id);
            fetchPayment(payment.id);

            notification.success({
              message: 'Pagamento aprovado com sucesso',
            });
          }}
          disabled={!payment.canBeApproved}
        >
          <Button
            className='no-print'
            icon={<CheckCircleOutlined />}
            loading={approvingPayment}
            type={'primary'}
            danger
            style={{ marginBottom: 16, marginLeft: 5 }}
            disabled={!payment.canBeApproved}
          >
            {'Aprovar agendamento'}
          </Button>
        </DoubleConfirm>
      ) : (
        <Tag style={{ marginLeft: 5 }} className='no-print'>{`Pagamento aprovado em ${moment(
          payment?.approvedAt
        ).format('DD/MM/YYYY')}`}</Tag>
      )}

      <Card>
        <PaymentHeader
          loading={fetchingPayment}
          editorId={payment?.payee.id}
          editorName={payment?.payee.name}
          periodStart={payment?.accountingPeriod.startsOn}
          periodEnd={payment?.accountingPeriod.endsOn}
          postsEarnings={payment?.earnings.totalAmount}
          totalEarnings={payment?.grandTotalAmount}
        />
        <Divider />
        <PaymentBonuses bonuses={payment?.bonuses} loading={fetchingPayment} />
        <Divider />
        <PaymentPosts posts={posts} loading={fetchingPosts} />
      </Card>
    </>
  );
}
