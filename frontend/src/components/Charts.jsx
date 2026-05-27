import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { buildPieData, buildTimeSeriesData } from '../utils/charts';

const COLORS = { IN: '#2563eb', OUT: '#dc2626' };
const PIE_COLORS = ['#2563eb', '#dc2626'];

export default function Charts({ movements }) {
  const pieData = buildPieData(movements);
  const timeSeries = buildTimeSeriesData(movements);

  if (movements.length === 0) {
    return (
      <section className="panel">
        <h2>Charts</h2>
        <p className="empty">Apply filters to view charts for the filtered dataset.</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <h2>Charts (filtered dataset)</h2>
      <div className="charts">
        <div className="chart-box">
          <h3>Quantity: IN vs OUT</h3>
          {pieData.length === 0 ? (
            <p className="empty">No quantity data</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="chart-box">
          <h3>Daily quantity moved</h3>
          {timeSeries.length === 0 ? (
            <p className="empty">No time-series data</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={timeSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="IN" stroke={COLORS.IN} dot={false} />
                <Line type="monotone" dataKey="OUT" stroke={COLORS.OUT} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </section>
  );
}
