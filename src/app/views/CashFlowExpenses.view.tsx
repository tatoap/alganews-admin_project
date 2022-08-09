import useBreadcrumb from '../../core/hooks/useBreadcrumb';
import userPageTitle from '../../core/hooks/usePageTitle';
import EntryCRUD from '../features/EntryCRUD';

export default function CashFlowExpensesView() {
  userPageTitle('Despesas');
  useBreadcrumb('Fluxo de caixa/Despesas');

  return <EntryCRUD type='EXPENSE' />;
}
