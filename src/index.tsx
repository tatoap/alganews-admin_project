import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/lib/locale/pt_BR';
import moment from 'moment';
import 'moment/locale/pt-br';
import reportWebVitals from './reportWebVitals';
import { store } from './core/store';
import Routes from './app/routes';
import DefaultLayout from './app/layouts/Default';
import './auth/httpConfig';

import 'antd/dist/antd.min.css';
import './index.less';

moment.locale('pt-br');

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <ConfigProvider locale={ptBR}>
    <Provider store={store}>
      <BrowserRouter>
        <DefaultLayout>
          <Routes />
        </DefaultLayout>
      </BrowserRouter>
    </Provider>
  </ConfigProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
