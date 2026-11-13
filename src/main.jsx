import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import '@fontsource-variable/fraunces/wght.css'
import '@fontsource-variable/dm-sans/wght.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/layout.css'
import './styles/components.css'
import './styles/forms.css'
import './styles/home.css'
import './styles/catalog.css'
import './styles/product.css'
import './styles/auth.css'
import './styles/admin.css'
import './styles/product-form.css'
import './styles/store.css'
import { AuthProvider } from './contexts/AuthProvider.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)