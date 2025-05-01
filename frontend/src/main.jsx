import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Includes Popper & Bootstrap JS

import { store, persistor } from './redux/store.jsx'; // Make sure store.jsx exports persistor too
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { StrictMode } from 'react';
import { SocketProvider } from './context/SocketProvider.jsx';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SocketProvider>
        <App />
        </SocketProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
