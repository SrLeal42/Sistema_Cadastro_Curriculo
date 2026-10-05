import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

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

        <div className="app-container" style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>

          <header style={{ marginBottom: "2rem" }}>
            <h1 style={{ color: "var(--accent-primary)" }}>Talent Hub</h1>
            <p style={{ color: "var(--text-secondary)" }}>Portal de recrutamento e cadastro de candidatos</p>
          </header>

          <main>

            <div className="glass-panel" style={{ padding: "2rem", textAlign: "center" }}>

              <h2>O ambiente e os serviços estão prontos!</h2>
              <p style={{ marginTop: "1rem", color: "var(--text-secondary)" }}>
                React Query configurado. Preparando os componentes...
              </p>

            </div>

          </main>
        </div>

      </BrowserRouter>

    </QueryClientProvider>

  )
}

export default App
