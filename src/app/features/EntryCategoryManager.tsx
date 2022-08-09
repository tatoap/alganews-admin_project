import { Button, Col, Form, Input, Modal, notification, Row, Table, Popconfirm } from 'antd';
import Title from 'antd/lib/typography/Title';
import {
  DeleteOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { useCallback, useEffect, useState } from 'react';
import { CashFlow } from 'tato_ap-sdk';
import useEntriesCategories from '../../core/hooks/useEntriesCategories';
import Forbidden from '../components/Forbidden';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';

export default function EntryCategoryManager(props: { type: 'EXPENSE' | 'REVENUE' }) {
  const { expenses, revenues, fetching, fetchCategories, deleteCategory } = useEntriesCategories();

  const [showCreationModal, setShowCreationModal] = useState(false);

  const openCreationModal = useCallback(() => setShowCreationModal(true), []);
  const closeCreationModal = useCallback(() => setShowCreationModal(false), []);

  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    fetchCategories().catch((err) => {
      if (err?.data?.status === 403) {
        setForbidden(true);
        return;
      }
      throw err;
    });
  }, [fetchCategories]);

  const { xs } = useBreakpoint();

  return (
    <>
      <Modal
        visible={showCreationModal}
        onCancel={closeCreationModal}
        footer={null}
        title={'Adicionar categoria'}
        destroyOnClose
      >
        <CategoryForm
          onSuccess={() => {
            closeCreationModal();
            notification.success({
              message: 'Categoria cadastrada com sucesso',
            });
          }}
        />
      </Modal>
      <Title level={4}>{'Gerenciar categorias'}</Title>
      {forbidden ? (
        <Forbidden />
      ) : (
        <>
          <Row justify={'space-between'} style={{ marginBottom: 16 }}>
            <Button type={'primary'} onClick={fetchCategories} icon={<ReloadOutlined />}>
              {xs ? 'Atualizar' : 'Atualizar categorias'}
            </Button>
            <Button type={'primary'} onClick={openCreationModal} icon={<PlusCircleOutlined />}>
              {xs ? 'Adicionar' : 'Adicionar categoria'}
            </Button>
          </Row>
          <Table<CashFlow.CategorySummary>
            dataSource={props.type === 'EXPENSE' ? expenses : revenues}
            loading={fetching}
            size={'small'}
            rowKey={'id'}
            columns={[
              {
                dataIndex: 'name',
                title: 'Descrição',
              },
              {
                dataIndex: 'totalEntries',
                title: 'Vínculos',
                align: 'right',
              },
              {
                dataIndex: 'id',
                title: 'Ações',
                align: 'center',
                render(id, record) {
                  return (
                    <>
                      <Popconfirm
                        title={'Remover categoria?'}
                        disabled={!record.canBeDeleted}
                        onConfirm={async () => {
                          await deleteCategory(id);
                          notification.success({
                            message: 'Categoria removida com sucesso',
                          });
                        }}
                      >
                        <Button
                          icon={<DeleteOutlined />}
                          size={'small'}
                          type={'text'}
                          disabled={!record.canBeDeleted}
                          danger
                        ></Button>
                      </Popconfirm>
                    </>
                  );
                },
              },
            ]}
          ></Table>
        </>
      )}
    </>
  );
}

function CategoryForm(props: { onSuccess: () => any }) {
  const { onSuccess } = props;

  const { createCategory } = useEntriesCategories();

  const handleFormSubmit = useCallback(
    async (form: CashFlow.CategoryInput) => {
      const newCategoryDTO: CashFlow.CategoryInput = {
        ...form,
        type: 'EXPENSE',
      };

      await createCategory(newCategoryDTO);
      onSuccess();
    },
    [createCategory, onSuccess]
  );

  return (
    <Form layout={'vertical'} onFinish={handleFormSubmit}>
      <Row justify='end'>
        <Col lg={24}>
          <Form.Item
            label={'Categoria'}
            name={'name'}
            rules={[{ required: true, message: 'O nome da categoria é obrigatório' }]}
          >
            <Input placeholder={'E.g.: Infra'} />
          </Form.Item>
        </Col>
        <Button type={'primary'} htmlType={'submit'} icon={<CheckCircleOutlined />}>
          {'Cadastrar categoria'}
        </Button>
      </Row>
    </Form>
  );
}
