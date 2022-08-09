import {
  Button,
  DatePicker,
  Descriptions,
  notification,
  Row,
  Space,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Payment } from 'tato_ap-sdk';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import usePayments from '../../core/hooks/usePayments';
import format from 'date-fns/format';
import { SorterResult } from 'antd/lib/table/interface';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import DoubleConfirm from '../components/DoubleConfirm';
import { Link } from 'react-router-dom';
import userPageTitle from '../../core/hooks/usePageTitle';
import Forbidden from '../components/Forbidden';
import useBreadcrumb from '../../core/hooks/useBreadcrumb';

export default function PaymentListView() {
  userPageTitle('Consulta de pagamentos');
  useBreadcrumb('Pagamentos/Consulta');

  const [forbidden, setForbidden] = useState(false);

  const {
    payments,
    fetching,
    query,
    selected,
    setQuery,
    fetchPayments,
    approvePaymentsInBatch,
    setSelected,
    removeExistingPayment,
  } = usePayments();

  const { xs } = useBreakpoint();

  useEffect(() => {
    fetchPayments().catch((err) => {
      if (err?.data?.status === 403) {
        setForbidden(true);
        return;
      }

      throw err;
    });
  }, [fetchPayments]);

  if (forbidden) {
    return <Forbidden />;
  }

  return (
    <>
      <Row justify={'space-between'} gutter={24}>
        <Space
          style={{
            width: '100%',
            ...(!xs && { justifyContent: 'space-between' }),
          }}
          direction={xs ? 'vertical' : 'horizontal'}
        >
          <DoubleConfirm
            popConfirmTitle={
              selected.length === 1
                ? 'Você deseja aprovar o agendamento selecionado?'
                : 'Você deseja aprovar os agendamentos selecionados?'
            }
            disabled={selected.length === 0}
            modalTitle={'Aprovar agendamento'}
            modalContent={
              'Esta é uma ação irreversível. Ao aprovar um agendamento, ele não poderá ser removido!'
            }
            onConfirm={async () => {
              await approvePaymentsInBatch(selected as number[]);

              notification.success(
                selected.length === 1
                  ? { message: 'Pagamento aprovado com sucesso' }
                  : { message: 'Pagamentos aprovados com sucesso' }
              );
            }}
          >
            <Button type={'primary'} disabled={selected.length === 0} block={xs} loading={fetching}>
              Aprovar agendamentos
            </Button>
          </DoubleConfirm>
          <DatePicker.MonthPicker
            style={{ width: xs ? '100%' : 240 }}
            format={'MMMM - YYYY'}
            onChange={(date) => {
              setQuery({
                scheduledToYearMonth: date ? date.format('YYYY-MM') : undefined,
              });
            }}
          />
        </Space>
      </Row>
      <Table<Payment.Summary>
        dataSource={payments?.content}
        rowKey='id'
        loading={fetching}
        onChange={(p, f, sorter) => {
          const { order } = sorter as SorterResult<Payment.Summary>;
          const direction = order?.replace('end', '');
          if (direction && direction !== query.sort![1]) {
            setQuery({
              sort: [query.sort![0], direction as 'asc' | 'desc'],
            });
          }
        }}
        pagination={{
          current: query.page ? query.page + 1 : 1,
          onChange: (page) => setQuery({ page: page - 1 }),
          pageSize: query.size,
          total: payments?.totalElements,
        }}
        rowSelection={{
          selectedRowKeys: selected,
          onChange: setSelected,
          getCheckboxProps(payment) {
            return !payment.canBeApproved ? { disabled: true } : {};
          },
        }}
        columns={[
          {
            title: 'Agendamentos',
            responsive: ['xs'],
            render(payment: Payment.Summary) {
              return (
                <Descriptions column={1} size={'small'}>
                  <Descriptions.Item label={'Nome'}>
                    {<Link to={`/usuarios/${payment.payee.id}`}>{payment.payee.name}</Link>}
                  </Descriptions.Item>
                  <Descriptions.Item label={'Agendamento'}>
                    {format(new Date(payment.scheduledTo), 'dd/MM/yyyy')}
                  </Descriptions.Item>
                  <Descriptions.Item label={'Período'}>
                    {(() => {
                      const start = moment(payment.accountingPeriod.startsOn).format('DD/MM/YYYY');
                      const end = moment(payment.accountingPeriod.endsOn).format('DD/MM/YYYY');

                      return `${start} + ${end}`;
                    })()}
                  </Descriptions.Item>
                  <Descriptions.Item label={'Status'}>
                    <Tag color={payment.approvedAt ? 'green' : 'warning'}>
                      {payment.approvedAt
                        ? `Aprovado em ${moment(payment.approvedAt).format('DD/MM/YYYY')}`
                        : 'Aguardando aprovação'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label={'Ações'}>
                    <DoubleConfirm
                      popConfirmTitle={'Remover agendamento?'}
                      disabled={!payment.canBeDeleted}
                      modalTitle={'Remover agendamento'}
                      modalContent={
                        'Esta é uma ação irreversível. Ao remover um agendamento, ele não poderá ser recuperado!'
                      }
                      onConfirm={() => {
                        removeExistingPayment(payment.id);

                        notification.success({ message: 'Agendamento removido com sucesso' });
                      }}
                    >
                      <Tooltip title={'Detalhar'} placement={xs ? 'top' : 'left'}>
                        <Link to={`/pagamentos/${payment.id}`}>
                          <Button size='small' icon={<EyeOutlined />} />
                        </Link>
                      </Tooltip>
                      <Tooltip
                        title={payment.canBeApproved ? 'Remover' : 'Agendamento já aprovado'}
                        placement={xs ? 'bottom' : 'right'}
                      >
                        <Button
                          size='small'
                          icon={<DeleteOutlined />}
                          disabled={!payment.canBeDeleted}
                        />
                      </Tooltip>
                    </DoubleConfirm>
                  </Descriptions.Item>
                </Descriptions>
              );
            },
          },
          {
            dataIndex: 'payee',
            title: 'Editor',
            responsive: ['sm'],
            width: 180,
            render(payee: Payment.Summary['payee']) {
              return <Link to={`/usuarios/${payee.id}`}>{payee.name}</Link>;
            },
          },
          {
            dataIndex: 'scheduledTo',
            title: 'Agendamento',
            align: 'center',
            responsive: ['sm'],
            ellipsis: true,
            width: 140,
            sorter(a, b) {
              return 0;
            },
            render(date: string) {
              return moment(date).format('DD/MM/YYYY');
            },
          },
          {
            dataIndex: 'accountingPeriod',
            title: 'Período',
            align: 'center',
            responsive: ['sm'],
            ellipsis: true,
            width: 240,
            render(period: Payment.Summary['accountingPeriod']) {
              const starts = moment(period.startsOn).format('DD/MM/YYYY');
              const ends = moment(period.endsOn).format('DD/MM/YYYY');

              return `${starts} - ${ends}`;
            },
          },
          {
            dataIndex: 'approvedAt',
            title: 'Status',
            align: 'center',
            responsive: ['sm'],
            ellipsis: true,
            width: 190,
            render(approvalDate: string) {
              return (
                <Tag color={approvalDate ? 'green' : 'warning'}>
                  {approvalDate
                    ? `Aprovado em ${moment(approvalDate).format('DD/MM/YYYY')}`
                    : 'Aguardando aprovação'}
                </Tag>
              );
            },
          },
          {
            dataIndex: 'id',
            title: 'Ações',
            align: 'center',
            responsive: ['sm'],
            ellipsis: true,
            width: 90,
            render(id: number, payment) {
              return (
                <Space>
                  <DoubleConfirm
                    popConfirmTitle={'Remover agendamento?'}
                    disabled={!payment.canBeDeleted}
                    modalTitle={'Remover agendamento'}
                    modalContent={
                      'Esta é uma ação irreversível. Ao remover um agendamento, ele não poderá ser recuperado!'
                    }
                    onConfirm={() => {
                      removeExistingPayment(payment.id);
                    }}
                  >
                    <Tooltip
                      title={payment.canBeDeleted ? 'Remover' : 'Agendamento já aprovado'}
                      placement={'right'}
                    >
                      <Button
                        type={'text'}
                        icon={<DeleteOutlined />}
                        size={'small'}
                        disabled={!payment.canBeDeleted}
                        danger
                      ></Button>
                    </Tooltip>
                  </DoubleConfirm>
                  <Tooltip title={'Detalhar'} placement={'left'}>
                    <Link to={`/pagamentos/${payment.id}`}>
                      <Button type={'text'} icon={<EyeOutlined />} size={'small'}></Button>
                    </Link>
                  </Tooltip>
                </Space>
              );
            },
          },
        ]}
      ></Table>
    </>
  );
}
