import { Button, Col, DatePicker, Divider, Form, Input, Row, Select, Skeleton, Space } from 'antd';
import Title from 'antd/lib/typography/Title';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CashFlow, CashFlowService } from 'tato_ap-sdk';
import CurrencyInput from '../components/CurrencyInput';
import moment, { Moment } from 'moment';
import { useForm } from 'antd/lib/form/Form';
import useEntriesCategories from '../../core/hooks/useEntriesCategories';
import useCashFlow from '../../core/hooks/useCashFlow';
import Forbidden from '../components/Forbidden';

interface EntryFormProps {
  type: 'EXPENSE' | 'REVENUE';
  onSuccess: () => any;
  editingEntry?: number | undefined;
}

type EntryFormSubmit = Omit<CashFlow.EntryInput, 'transactedOn'> & {
  transactedOn: Moment;
};

export default function EntryForm({ type, onSuccess, editingEntry }: EntryFormProps) {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const { expenses, revenues, fetching, fetchCategories } = useEntriesCategories();
  const { createEntry, fetching: fetchingEntries, updateEntry } = useCashFlow(type);

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

  useEffect(() => {
    if (editingEntry) {
      setLoading(true);
      CashFlowService.getExistingEntry(editingEntry)
        .then((entry) => ({
          ...entry,
          transactedOn: moment(entry.transactedOn),
        }))
        .then(form.setFieldsValue)
        .finally(() => setLoading(false));
    }
  }, [editingEntry, form]);

  const categories = useMemo(
    () => (type === 'EXPENSE' ? expenses : revenues),
    [expenses, revenues, type]
  );

  const handleFormSubmit = useCallback(
    async (form: EntryFormSubmit) => {
      const newEntryDTO: CashFlow.EntryInput = {
        ...form,
        transactedOn: form.transactedOn.format('YYYY-MM-DD'),
        type,
      };

      editingEntry ? await updateEntry(editingEntry, newEntryDTO) : await createEntry(newEntryDTO);
      onSuccess();
    },
    [type, createEntry, updateEntry, editingEntry, onSuccess]
  );

  return loading ? (
    <>
      <Skeleton />
      <Skeleton title={false} />
      <Skeleton title={false} />
    </>
  ) : (
    <>
      <Title level={4} style={{ marginBottom: 16 }}>
        {editingEntry
          ? `Atualizar ${type === 'EXPENSE' ? 'despesa' : 'receita'}`
          : `Cadastrar ${type === 'EXPENSE' ? 'despesa' : 'receita'}`}
      </Title>
      {forbidden ? (
        <Forbidden />
      ) : (
        <>
          <Form autoComplete={'false'} form={form} layout={'vertical'} onFinish={handleFormSubmit}>
            <Row gutter={16}>
              <Col xs={24}>
                <Form.Item
                  name={'description'}
                  label={'Descrição'}
                  rules={[{ required: true, message: 'Campo obrigatório' }]}
                >
                  <Input placeholder={'E.g.: Pagamento mensal AWS'} />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name={['category', 'id']}
                  label={'Categoria'}
                  rules={[{ required: true, message: 'Campo obrigatório' }]}
                >
                  <Select
                    loading={fetching}
                    placeholder={fetching ? 'Carregando categorias...' : 'Selecione uma categoria'}
                  >
                    {categories.map((expense) => (
                      <Select.Option key={expense.id} value={expense.id}>
                        {expense.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  name={'amount'}
                  label={'Montante'}
                  initialValue={0}
                  rules={[{ required: true, message: 'Campo obrigatório' }]}
                >
                  <CurrencyInput onChange={(a, value) => form.setFieldsValue({ amount: value })} />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  name={'transactedOn'}
                  label={`Data da ${type === 'EXPENSE' ? 'saída' : 'entrada'}`}
                  rules={[{ required: true, message: 'Campo obrigatório' }]}
                >
                  <DatePicker
                    format={'DD/MM/YYYY'}
                    style={{ width: '100%' }}
                    disabledDate={(date) => {
                      return date.isAfter(moment());
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Divider style={{ marginTop: 0 }} />
            <Row justify='end'>
              <Space>
                <Button>{'Cancelar'}</Button>
                <Button type={'primary'} htmlType={'submit'} loading={fetchingEntries}>
                  {editingEntry ? 'Atualizar' : 'Cadastrar'}
                  {type === 'EXPENSE' ? ' despesa' : ' receita'}
                </Button>
              </Space>
            </Row>
          </Form>
        </>
      )}
    </>
  );
}
