import { message, notification } from 'antd';
import { useEffect } from 'react';
import { Route } from 'react-router-dom';
import { Routes as Rotas } from 'react-router-dom';
import CustomError from 'tato_ap-sdk/dist/CustomError';
import CashFlowExpensesView from './views/CashFlowExpenses.view';
import CashFlowRevenuesView from './views/CashFlowRevenues.view';
import Home from './views/Home.view';
import PaymentCreateView from './views/PaymentCreate.view';
import PaymentListView from './views/PaymentList.view';
import UserCreateView from './views/UserCreate.view';
import UserEditView from './views/UserEdit.view';
import UserListView from './views/UserList.view';

export default function Routes() {
  useEffect(() => {
    window.onunhandledrejection = ({ reason }) => {
      if (reason instanceof CustomError) {
        if (reason.data?.objects) {
          reason.data.objects.forEach((error) => {
            message.error(error.userMessage);
          });
        } else {
          notification.error({
            message: reason.message,
            description:
              reason.data?.detail === 'Network Error' ? 'Erro de rede' : reason.data?.detail,
          });
        }
      } else {
        notification.error({
          message: 'Houve um erro',
        });
      }
    };

    return () => {
      window.onunhandledrejection = null;
    };
  });

  return (
    <Rotas>
      <Route path={'/'} element={<Home />} />
      <Route path={'/usuarios'} element={<UserListView />} />
      <Route path={'/usuarios/cadastro'} element={<UserCreateView />} />
      <Route path={'/usuarios/edicao/:id'} element={<UserEditView />} />
      <Route path={'/pagamentos/cadastro'} element={<PaymentCreateView />} />
      <Route path={'/pagamentos'} element={<PaymentListView />} />
      <Route path={'/fluxo-de-caixa/despesas'} element={<CashFlowExpensesView />} />
      <Route path={'/fluxo-de-caixa/receitas'} element={<CashFlowRevenuesView />} />
    </Rotas>
  );
}
