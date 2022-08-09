import useBreadcrumb from '../../core/hooks/useBreadcrumb';
import userPageTitle from '../../core/hooks/usePageTitle';
import EntryCRUD from '../features/EntryCRUD';

export default function CashFlowRevenuesView() {
  userPageTitle('Receitas');
  useBreadcrumb('Fluxo de caixa/Receitas');

  return <EntryCRUD type='REVENUE' />;
}
