export default function FiltersPanel({
  from,
  to,
  type,
  warehouse,
  warehouses,
  onFromChange,
  onToChange,
  onTypeChange,
  onWarehouseChange,
  onApply,
  loading,
}) {
  return (
    <section className="panel">
      <h2>Filters</h2>
      <div className="filters">
        <label>
          From (required)
          <input type="date" value={from} onChange={(e) => onFromChange(e.target.value)} required />
        </label>
        <label>
          To (required)
          <input type="date" value={to} onChange={(e) => onToChange(e.target.value)} required />
        </label>
        <label>
          Movement type
          <select value={type} onChange={(e) => onTypeChange(e.target.value)}>
            <option value="ALL">All</option>
            <option value="IN">IN</option>
            <option value="OUT">OUT</option>
          </select>
        </label>
        <label>
          Warehouse (bonus)
          <select value={warehouse} onChange={(e) => onWarehouseChange(e.target.value)}>
            <option value="">All warehouses</option>
            {warehouses.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </label>
        <button type="button" onClick={onApply} disabled={loading || !from || !to}>
          {loading ? 'Loading…' : 'Apply filters'}
        </button>
      </div>
    </section>
  );
}
