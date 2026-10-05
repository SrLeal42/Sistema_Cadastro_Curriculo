import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { CandidateForm } from './components/CandidateForm';
import { CandidateList } from './components/CandidateList';
import { CandidateModal } from './components/CandidateModal';

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
          <main>
            <CandidateForm />
            <CandidateList />
          </main>
        </div>

        <Routes>
          <Route path="/candidatos/:id" element={<CandidateModal />} />
          <Route path="*" element={null} />
        </Routes>

      </BrowserRouter>

    </QueryClientProvider>

  )
}

export default App
