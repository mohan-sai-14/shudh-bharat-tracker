
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

createRoot(document.getElementById("root")!).render(<App />);

// Service worker registration temporarily disabled
// serviceWorkerRegistration.register();
