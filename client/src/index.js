import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { IntlProvider, addLocaleData } from 'react-intl';
import locale_en from 'react-intl/locale-data/en';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import store from './store';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import './App.css';
import messages_en from './translations/en.json';

addLocaleData([...locale_en]);

const LFCommerce = () => (
  // TODO: language setting should be dynamic
  <Provider store={store}>
    <IntlProvider locale="en" messages={messages_en}>
      <App />
    </IntlProvider>
  </Provider>
);
ReactDOM.render(<LFCommerce />, document.getElementById('root'));
registerServiceWorker();
