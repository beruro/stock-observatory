import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import Workbench from './workbench';
import './globals.css';
createRoot(document.getElementById('root')!).render(<StrictMode><Workbench/></StrictMode>);
