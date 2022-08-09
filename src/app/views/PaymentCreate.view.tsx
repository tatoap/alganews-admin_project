import useBreadcrumb from '../../core/hooks/useBreadcrumb';
import userPageTitle from '../../core/hooks/usePageTitle';
import PaymentForm from '../features/PaymentForm';

export default function PaymentCreateView() {
  userPageTitle('Cadastro de pagamento');
  useBreadcrumb('Pagamentos/Cadastro');

  return (
    <>
      <PaymentForm />
    </>
  );
}
