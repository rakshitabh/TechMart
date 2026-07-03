import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
console.log("API URL:", import.meta.env.VITE_API_URL);
import { GoogleOAuthProvider } from '@react-oauth/google';

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <GoogleOAuthProvider clientId="230645475238-8nsa56389phaooi0ffuqio9p5g1or305.apps.googleusercontent.com">
//       <App />
//     </GoogleOAuthProvider>
//   </React.StrictMode>
// );

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);

