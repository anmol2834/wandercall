import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import App from './App.jsx'
import './index.css'

// Block Sentry and console completely
if (typeof window !== 'undefined') {
  // Override Sentry object
  window.Sentry = {
    init: () => null,
    captureException: () => null,
    captureMessage: () => null
  };
  
  // Disable console
  const noop = () => {};
  Object.keys(console).forEach(key => {
    console[key] = noop;
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)