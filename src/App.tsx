import { useEffect, useState } from 'react';
import './App.css';
import { CRED_IT_STEPS, type Provider } from './data/mockData';
import { loadProviders, saveProviders } from './lib/storage';
import Dashboard from './components/Dashboard';
import ProvidersList from './components/ProvidersList';
import ProviderDetail from './components/ProviderDetail';
import Workflow from './components/Workflow';
import Alerts from './components/Alerts';
import Sidebar from './components/Sidebar';

type Page = 'dashboard' | 'providers' | 'workflow' | 'alerts' | 'detail';

function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [search, setSearch] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    setProviders(loadProviders());
  }, []);

  const handleSelectProvider = (p: Provider) => {
    setSelectedProvider(p);
    setPage('detail');
  };

  const handleBack = () => {
    setSelectedProvider(null);
    setPage('providers');
  };

  const handleAddProvider = (p: Provider) => {
    const next = [...providers, p];
    setProviders(next);
    saveProviders(next);
  };

  const handleUpdateProvider = (updated: Provider) => {
    const next = providers.map((p) => (p.id === updated.id ? updated : p));
    setProviders(next);
    saveProviders(next);
    setSelectedProvider(updated);
  };

  return (
    <div className={`app ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <header className="topbar">
        <div className="brand">
          <img src="/logo.svg" alt="Global Care" className="brand-logo" />
          <div className="brand-text">
            <span className="logo">e-CRED 360</span>
            <span className="tagline">Electronic Credentialing Compliance</span>
          </div>
        </div>
        <div className="topbar-right">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search providers, PRC #..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="app-body">
        <Sidebar
          current={page === 'detail' ? 'providers' : page}
          onNavigate={(p) => {
            setPage(p);
            setSelectedProvider(null);
          }}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((c) => !c)}
        />
        <main className="main">
          <div className="content">
            {page === 'dashboard' && (
              <Dashboard providers={providers} onSelect={handleSelectProvider} />
            )}
            {page === 'providers' && (
              <ProvidersList
                providers={providers}
                search={search}
                onSelect={handleSelectProvider}
                onAdd={handleAddProvider}
              />
            )}
            {page === 'detail' && selectedProvider && (
              <ProviderDetail
                provider={
                  providers.find((p) => p.id === selectedProvider.id) ?? selectedProvider
                }
                onBack={handleBack}
                onUpdate={handleUpdateProvider}
              />
            )}
            {page === 'workflow' && <Workflow steps={CRED_IT_STEPS} />}
            {page === 'alerts' && (
              <Alerts providers={providers} onSelect={handleSelectProvider} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
