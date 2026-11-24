import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import '../src/styles/index.css';
import { StudioProvider } from '../src';
import { Gallery } from './Gallery';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StudioProvider storageKey="studio-ui-gallery">
      <Gallery />
    </StudioProvider>
  </StrictMode>,
);
