import { BrowserRouter } from 'react-router-dom';
import { Providers } from './Providers';
import { AppRoutes } from '@/routes';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';

export default function App() {
  return (
    <BrowserRouter>
      <Providers>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </Providers>
    </BrowserRouter>
  );
}
