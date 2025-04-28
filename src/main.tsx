
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

createRoot(document.getElementById("root")!).render(<App />);

// If you want your app to work offline and load faster, register the service worker
serviceWorkerRegistration.register();
