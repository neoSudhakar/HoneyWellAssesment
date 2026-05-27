const PAGE_SIZE = 10;

export default function MovementsTable({ movements, page, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(movements.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const rows = movements.slice(start, start + PAGE_SIZE);

  const formatDateTime = (iso) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  return (
    <section className="panel">
      <h2>Stock Movements</h2>
      {movements.length === 0 ? (
        <p className="empty">No movements match the current filters.</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Date/Time</th>
                <th>SKU</th>
                <th>Movement Type</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => (
                <tr key={m.id}>
                  <td>{formatDateTime(m.timestamp)}</td>
                  <td>{m.sku}</td>
                  <td>{m.movementType}</td>
                  <td>{m.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <span>
              Page {safePage} of {totalPages} ({movements.length} rows)
            </span>
            <div>
              <button
                type="button"
                className="secondary"
                disabled={safePage <= 1}
                onClick={() => onPageChange(safePage - 1)}
              >
                Previous
              </button>{' '}
              <button
                type="button"
                className="secondary"
                disabled={safePage >= totalPages}
                onClick={() => onPageChange(safePage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
