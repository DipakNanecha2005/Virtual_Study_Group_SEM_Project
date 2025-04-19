import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Important: includes Popper and Bootstrap JS


createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
)