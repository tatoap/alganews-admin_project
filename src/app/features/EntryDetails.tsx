import { Descriptions, Skeleton } from 'antd';
import Title from 'antd/lib/typography/Title';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { CashFlow, CashFlowService } from 'tato_ap-sdk';
import transformIntoBrl from '../../core/utils/transformIntoBrl';

interface EntryDetailsProps {
  entryId: number;
}

export default function EntryDetails({ entryId }: EntryDetailsProps) {
  const [entry, setEntry] = useState<CashFlow.EntryDetailed>();
  const [loading, setLoading] = useState(false);

  const fetchEntry = useCallback(
    (id: number) => {
      setLoading(true);
      CashFlowService.getExistingEntry(id)
        .then(setEntry)
        .finally(() => setLoading(false));
    },
    [setLoading, setEntry]
  );

  useEffect(() => {
    fetchEntry(entryId);
  }, [fetchEntry, entryId]);

  return loading ? (
    <>
      <Skeleton />
      <Skeleton title={false} />
      <Skeleton title={false} />
    </>
  ) : (
    <>
      <Title level={4} style={{ marginBottom: 16 }}>
        {`Detalhes da ${entry?.type === 'EXPENSE' ? 'despesa' : 'receita'}`}
      </Title>
      <Descriptions column={1} size={'small'} bordered>
        <Descriptions.Item label={'Descrição'}>{entry?.description}</Descriptions.Item>
        <Descriptions.Item label={'Categoria'}>{entry?.category.name}</Descriptions.Item>
        <Descriptions.Item label={`Data da ${entry?.type === 'EXPENSE' ? 'saída' : 'entrada'}`}>
          {moment(entry?.transactedOn).format('DD/MM/YYYY')}
        </Descriptions.Item>
        <Descriptions.Item label={'Valor'}>{transformIntoBrl(entry?.amount)}</Descriptions.Item>
        <Descriptions.Item label={'Data de criação'}>
          {moment(entry?.createdAt).format('DD/MM/YYYY \\à\\s HH:mm')}
        </Descriptions.Item>
        <Descriptions.Item label={'Criado por'}>{entry?.createdBy.name}</Descriptions.Item>
        {entry?.createdAt !== entry?.updatedAt && (
          <>
            <Descriptions.Item label={'Alterado em'}>
              {moment(entry?.updatedAt).format('DD/MM/YYYY \\à\\s HH:mm')}
            </Descriptions.Item>
            <Descriptions.Item label={'Alterado por'}>{entry?.updatedBy.name}</Descriptions.Item>
          </>
        )}
      </Descriptions>
    </>
  );
}
