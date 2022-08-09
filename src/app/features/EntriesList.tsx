import { Button, Card, DatePicker, Descriptions, Space, Table, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { CashFlow } from 'tato_ap-sdk';
import useCashFlow from '../../core/hooks/useCashFlow';
import transformIntoBrl from '../../core/utils/transformIntoBrl';
import { EyeOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import DoubleConfirm from '../components/DoubleConfirm';
import { useLocation, useNavigate } from 'react-router-dom';
import Forbidden from '../components/Forbidden';

interface EntriesListProps {
  onEdit: (entryId: number) => any;
  onDetail: (entryId: number) => any;
  type: 'EXPENSE' | 'REVENUE';
}

export default function EntriesList(props: EntriesListProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const [forbidden, setForbidden] = useState(false);

  const { entries, fetchEntries, fetching, setQuery, selected, setSelected, removeExistingEntry } =
    useCashFlow(props.type);

  const didMount = useRef(false);

  useEffect(() => {
    fetchEntries().catch((err) => {
      if (err?.data?.status === 403) {
        setForbidden(true);
        return;
      }
      throw err;
    });
  }, [fetchEntries]);

  useEffect(() => {
    if (didMount.current) {
      const params = new URLSearchParams(location.search);
      const yearMonth = params.get('yearMonth');

      if (yearMonth) setQuery({ yearMonth });
    } else {
      didMount.current = true;
    }
  }, [location.search, setQuery]);

  if (forbidden) {
    return <Forbidden />;
  }

  return (
    <Table<CashFlow.EntrySummary>
      loading={fetching}
      dataSource={entries}
      pagination={false}
      rowKey={'id'}
      rowSelection={{
        selectedRowKeys: selected,
        onChange: setSelected,
        getCheckboxProps(record) {
          return !record.canBeDeleted ? { disabled: true } : {};
        },
      }}
      columns={[
        {
          title: `${props.type === 'EXPENSE' ? 'Despesas' : 'Receitas'}`,
          responsive: ['xs'],
          render(entry: CashFlow.EntrySummary) {
            return (
              <Descriptions column={1} size={'small'}>
                <Descriptions.Item label={'Descrição'}>
                  <Tooltip title={entry.description}>{entry.description}</Tooltip>
                </Descriptions.Item>
                <Descriptions.Item label={'Categoria'}>
                  <Tag>{entry.category.name}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label={'Data'}>
                  {moment(entry.transactedOn).format('DD/MM/YYYY')}
                </Descriptions.Item>
                <Descriptions.Item label={'Valor'}>
                  {transformIntoBrl(entry.amount)}
                </Descriptions.Item>
                <Descriptions.Item label={'Ações'}>
                  <DoubleConfirm
                    popConfirmTitle={`Remover ${props.type === 'EXPENSE' ? 'despesa' : 'receita'}?`}
                    modalTitle={`Remover ${props.type === 'EXPENSE' ? 'despesa' : 'receita'}`}
                    modalContent={`Remover uma ${
                      props.type === 'EXPENSE' ? 'despesa' : 'receita'
                    } pode gerar impacto negativo no gráfico de receitas e despesas da empresa. Esta é uma ação irreversível.`}
                    onConfirm={() => removeExistingEntry(entry.id)}
                  >
                    <Button
                      type={'text'}
                      icon={<DeleteOutlined />}
                      size={'small'}
                      style={{ border: 'none' }}
                      disabled={entry.systemGenerated}
                      danger
                    ></Button>
                  </DoubleConfirm>

                  <Button
                    type={'text'}
                    icon={<EditOutlined />}
                    size={'small'}
                    style={{ border: 'none' }}
                    onClick={() => props.onEdit(entry.id)}
                    disabled={entry.systemGenerated}
                  ></Button>
                  <Button
                    type={'text'}
                    icon={<EyeOutlined />}
                    size={'small'}
                    onClick={() => props.onDetail(entry.id)}
                  ></Button>
                </Descriptions.Item>
              </Descriptions>
            );
          },
        },
        {
          dataIndex: 'description',
          title: 'Descrição',
          responsive: ['sm'],
          align: 'left',
          width: 300,
          ellipsis: true,
          render(description: CashFlow.EntrySummary['description']) {
            return <Tooltip title={description}>{description}</Tooltip>;
          },
        },
        {
          dataIndex: 'category',
          title: 'Categoria',
          responsive: ['sm'],
          width: 120,
          align: 'center',
          render(category: CashFlow.EntrySummary['category']) {
            return <Tag>{category.name}</Tag>;
          },
        },
        {
          dataIndex: 'transactedOn',
          title: 'Data',
          responsive: ['sm'],
          width: 120,
          align: 'center',
          filterDropdown() {
            return (
              <Card>
                <DatePicker.MonthPicker
                  format={'YYYY - MMMM'}
                  onChange={(date) => {
                    navigate({
                      search: `yearMonth=${date?.format('YYYY-MM') || moment().format('YYYY-MM')}`,
                    });
                  }}
                />
              </Card>
            );
          },
          render(transactedOn) {
            return moment(transactedOn).format('DD/MM/YYYY');
          },
        },
        {
          dataIndex: 'amount',
          title: 'Valor',
          responsive: ['sm'],
          width: 120,
          align: 'right',
          render(amount) {
            return transformIntoBrl(amount);
          },
        },
        {
          dataIndex: 'id',
          title: 'Ações',
          responsive: ['sm'],
          width: 120,
          align: 'center',
          render(id: number, entry: CashFlow.EntrySummary) {
            return (
              <Space>
                <DoubleConfirm
                  popConfirmTitle={`Remover ${props.type === 'EXPENSE' ? 'despesa' : 'receita'}?`}
                  modalTitle={`Remover ${props.type === 'EXPENSE' ? 'despesa' : 'receita'}`}
                  modalContent={`Remover uma ${
                    props.type === 'EXPENSE' ? 'despesa' : 'receita'
                  } pode gerar impacto negativo no gráfico de receitas e despesas da empresa. Esta é uma ação irreversível.`}
                  onConfirm={() => removeExistingEntry(id)}
                >
                  <Tooltip title={'Remover'}>
                    <Button
                      type={'text'}
                      icon={<DeleteOutlined />}
                      size={'small'}
                      style={{ border: 'none' }}
                      disabled={entry.systemGenerated}
                      danger
                    ></Button>
                  </Tooltip>
                </DoubleConfirm>

                <Tooltip title={'Editar'}>
                  <Button
                    type={'text'}
                    icon={<EditOutlined />}
                    size={'small'}
                    style={{ border: 'none' }}
                    disabled={entry.systemGenerated}
                    onClick={() => props.onEdit(id)}
                  ></Button>
                </Tooltip>
                <Tooltip title={'Detalhar'}>
                  <Button
                    type={'text'}
                    icon={<EyeOutlined />}
                    size={'small'}
                    onClick={() => props.onDetail(id)}
                  ></Button>
                </Tooltip>
              </Space>
            );
          },
        },
      ]}
    ></Table>
  );
}
