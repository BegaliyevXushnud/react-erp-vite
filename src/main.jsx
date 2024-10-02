import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Root from "./router/index"
import './index.css'


import "../i18n.js"

createRoot(document.getElementById('root')).render(
  <Root />
)
