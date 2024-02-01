import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CookiesProvider } from 'react-cookie';

const cookieOptions = import.meta.env.PROD ? {
  path: "/",
  secure: true,
  sameSite: "None",
  partitioned: true
} : {
  path: "/"
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <CookiesProvider defaultSetOptions={cookieOptions}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    <ToastContainer theme="light" autoClose={2000} position="top-right"/>
  </ CookiesProvider>
);
