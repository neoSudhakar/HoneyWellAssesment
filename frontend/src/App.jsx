import { useCallback, useEffect, useState } from 'react';
import { fetchMovements } from './api';
import Charts from './components/Charts';
import FileUpload from './components/FileUpload';
import FiltersPanel from './components/FiltersPanel';
import MovementsTable from './components/MovementsTable';

const DEFAULT_FROM = '2026-01-01';
const DEFAULT_TO = '2026-12-31';

export default function App() {
  const [from, setFrom] = useState(DEFAULT_FROM);
  const [to, setTo] = useState(DEFAULT_TO);
  const [type, setType] = useState('ALL');
  const [warehouse, setWarehouse] = useState('');
  const [warehouses, setWarehouses] = useState([]);
  const [movements, setMovements] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadMovements = useCallback(async () => {
    if (!from || !to) return;
    setLoading(true);
    setError('');
    try {
      const data = await fetchMovements({
        from,
        to,
        type,
        warehouse: warehouse || undefined,
      });
      setMovements(data.movements);
      setWarehouses(data.warehouses);
      setPage(1);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load data');
      setMovements([]);
    } finally {
      setLoading(false);
    }
  }, [from, to, type, warehouse]);

  useEffect(() => {
    loadMovements();
  }, [loadMovements]);

  return (
    <>
      <header>
        <h1>Inventory Movement Dashboard</h1>
        <p className="subtitle">
          Validate uploaded stock movement JSON with SHA-256, then explore filtered tables and charts.
        </p>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <FileUpload onVerified={loadMovements} />

      <FiltersPanel
        from={from}
        to={to}
        type={type}
        warehouse={warehouse}
        warehouses={warehouses}
        onFromChange={setFrom}
        onToChange={setTo}
        onTypeChange={setType}
        onWarehouseChange={setWarehouse}
        onApply={loadMovements}
        loading={loading}
      />

      <MovementsTable movements={movements} page={page} onPageChange={setPage} />
      <Charts movements={movements} />
    </>
  );
}
