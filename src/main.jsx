import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import UserContext from './context/UserContext.jsx'

// Dynamically set the favicon
const setFavicon = () => {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/webp';
  link.href = '/logo.webp';
  document.head.appendChild(link);
};
setFavicon();

createRoot(document.getElementById('root')).render(
  <UserContext>
    <App />
  </UserContext>
)