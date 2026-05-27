export function buildPieData(movements) {
  const totals = movements.reduce(
    (acc, m) => {
      if (m.movementType === 'IN') acc.IN += m.quantity;
      else if (m.movementType === 'OUT') acc.OUT += m.quantity;
      return acc;
    },
    { IN: 0, OUT: 0 },
  );

  return [
    { name: 'IN', value: totals.IN },
    { name: 'OUT', value: totals.OUT },
  ].filter((d) => d.value > 0);
}

/** Daily buckets for dates present in the filtered dataset. */
export function buildTimeSeriesData(movements) {
  const byDate = new Map();

  for (const m of movements) {
    const date = m.timestamp.slice(0, 10);
    const bucket = byDate.get(date) ?? { IN: 0, OUT: 0 };
    if (m.movementType === 'IN') bucket.IN += m.quantity;
    else bucket.OUT += m.quantity;
    byDate.set(date, bucket);
  }

  return Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, values]) => ({ date, ...values }));
}
