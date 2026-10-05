import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

import { CandidateForm } from './components/CandidateForm';

import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {

  return (

    <QueryClientProvider client={queryClient}>

      <BrowserRouter>

        <div className="app-container">

          <header className="app-header">
            <h1 className="app-title">Talent Hub</h1>
            <p className="app-subtitle">Portal de recrutamento e cadastro de candidatos</p>
          </header>

          <main>

            <CandidateForm />

          </main>
        </div>

      </BrowserRouter>

    </QueryClientProvider>

  )
}

export default App
