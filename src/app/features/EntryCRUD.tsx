import { Button, Divider, Modal, notification, Row, Space, Tooltip, Typography } from 'antd';
import { InfoCircleFilled, TagOutlined, PlusCircleOutlined } from '@ant-design/icons';
import EntriesList from '../features/EntriesList';
import useCashFlow from '../../core/hooks/useCashFlow';
import DoubleConfirm from '../components/DoubleConfirm';
import { useCallback, useState } from 'react';
import EntryCategoryManager from '../features/EntryCategoryManager';
import EntryForm from '../features/EntryForm';
import EntryDetails from '../features/EntryDetails';
import moment from 'moment';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';

const { Title, Text } = Typography;

interface EntryCRUDProps {
  type: 'EXPENSE' | 'REVENUE';
}

export default function EntryCRUD({ type }: EntryCRUDProps) {
  const { selected, removeEntries, fetching, query } = useCashFlow(type);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [editingEntry, setEditingEntry] = useState<number | undefined>(undefined);

  const [entryDetails, setEntryDetails] = useState<number>();

  const openCategoryModal = useCallback(() => setShowCategoryModal(true), []);
  const closeCategoryModal = useCallback(() => setShowCategoryModal(false), []);

  const openFormModal = useCallback(() => setShowFormModal(true), []);
  const closeFormModal = useCallback(() => setShowFormModal(false), []);

  const openDetailsModal = useCallback(() => setShowDetailsModal(true), []);
  const closeDetailsModal = useCallback(() => setShowDetailsModal(false), []);

  const { xs } = useBreakpoint();

  return (
    <>
      <Modal visible={showCategoryModal} onCancel={closeCategoryModal} footer={null} destroyOnClose>
        <EntryCategoryManager type={type} />
      </Modal>
      <Modal
        visible={showFormModal}
        onCancel={() => {
          closeFormModal();
          setEditingEntry(undefined);
        }}
        footer={null}
        destroyOnClose
      >
        <EntryForm
          editingEntry={editingEntry}
          type={type}
          onSuccess={() => {
            closeFormModal();
            notification.success({
              message: `${type === 'EXPENSE' ? 'Despesa' : 'Receita'} ${
                editingEntry ? 'atualizada' : 'cadastrada'
              } com sucesso`,
            });
            setEditingEntry(undefined);
          }}
        />
      </Modal>
      <Modal
        visible={showDetailsModal}
        onCancel={() => {
          closeDetailsModal();
        }}
        footer={null}
        destroyOnClose
      >
        {entryDetails && <EntryDetails entryId={entryDetails} />}
      </Modal>
      <Space direction='vertical'>
        <Title level={3}>
          {`Exibindo os resultados de ${type === 'EXPENSE' ? 'despesas' : 'receitas'} do mês de `}
          {moment(query.yearMonth).format('MMMM \\d\\e YYYY')}
        </Title>
        <Space>
          <Text>{`É possível filtrar as ${
            type === 'EXPENSE' ? 'despesas' : 'receitas'
          } por mês`}</Text>
          <Tooltip placement={'right'} title={'Use a coluna data para filtrar'}>
            <InfoCircleFilled />
          </Tooltip>
        </Space>
      </Space>
      <Divider />
      <Row
        justify={'space-between'}
        style={{ marginBottom: 16, flexDirection: xs ? 'column-reverse' : 'row' }}
      >
        <Space style={{ ...(xs && { marginTop: 16 }) }}>
          <DoubleConfirm
            popConfirmTitle={`Remover ${
              selected.length === 1
                ? `${type === 'EXPENSE' ? 'despesa selecionada?' : 'receita selecionada?'}`
                : `${type === 'EXPENSE' ? 'despesas selecionadas?' : 'receitas selecionadas?'}`
            }`}
            modalTitle={`Remover ${type === 'EXPENSE' ? 'despesa' : 'receita'}`}
            modalContent={`Remover uma ou mais ${
              type === 'EXPENSE' ? 'despesas' : 'receitas'
            } pode gerar impacto negativo no gráfico de receitas e despesas da empresa. Esta é uma ação irreversível.`}
            onConfirm={() => removeEntries(selected as number[])}
            disabled={!selected.length}
          >
            <Button type={'primary'} disabled={!selected.length} loading={fetching} danger={xs}>
              Remover
            </Button>
          </DoubleConfirm>
        </Space>

        <Space>
          <Button type={'primary'} icon={<TagOutlined />} onClick={openCategoryModal}>
            {'Categorias'}
          </Button>
          <Button type={'primary'} icon={<PlusCircleOutlined />} onClick={openFormModal}>
            {`Cadastrar ${type === 'EXPENSE' ? 'despesa' : 'receita'}`}
          </Button>
        </Space>
      </Row>
      <EntriesList
        type={type}
        onEdit={(id) => {
          setEditingEntry(id);
          openFormModal();
        }}
        onDetail={(id) => {
          setEntryDetails(id);
          openDetailsModal();
        }}
      />
    </>
  );
}
