import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {fileURLToPath, URL} from 'node:url';
export default defineConfig({base:'/stock-observatory/',plugins:[react()],resolve:{alias:{'@':fileURLToPath(new URL('.',import.meta.url))}},build:{chunkSizeWarningLimit:400}});
