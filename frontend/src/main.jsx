import axios from 'axios';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' //  1. Importamos el navegador
import './styles/global.css' // 2. Importamos TU css global
import App from './App.jsx'


// Se ejecuta antes de CADA petición de axios, en toda la app
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/*  3. Envolvemos la App con el Router */}
      <App />
    </BrowserRouter>
  </StrictMode>,
)