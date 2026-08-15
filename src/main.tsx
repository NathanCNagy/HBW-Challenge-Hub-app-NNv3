import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { runRecommendationUnitTests } from './services/testEngine.ts';

// Run green local recommendation engine test cases on boot
runRecommendationUnitTests();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

