import { useState } from 'react';
import { fetchSampleData } from '../../api';
import { FiTable, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import './SampleDataViewer.scss';

const SampleDataViewer = ({ tables = [] }) => {
  const [expanded, setExpanded] = useState(null);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState('');

  const toggle = async (tableName) => {
    if (expanded === tableName) { setExpanded(null); return; }
    setExpanded(tableName);

    if (data[tableName]) return; // already loaded
    setLoading(tableName);
    try {
      const res = await fetchSampleData(tableName);
      setData((prev) => ({ ...prev, [tableName]: res.data }));
    } catch {
      setData((prev) => ({ ...prev, [tableName]: { error: 'Failed to load data.' } }));
    } finally {
      setLoading('');
    }
  };

  return (
    <section className="sample-viewer">
      <h3 className="sample-viewer__heading"><FiTable /> Sample Data</h3>

      {tables.map((t) => (
        <div key={t.tableName} className="sample-viewer__table">
          <button className="sample-viewer__toggle" onClick={() => toggle(t.tableName)}>
            <span className="sample-viewer__name">{t.tableName}</span>
            <span className="sample-viewer__cols">
              {t.columns.map((c) => `${c.name} (${c.dataType})`).join(', ')}
            </span>
            {expanded === t.tableName ? <FiChevronUp /> : <FiChevronDown />}
          </button>

          {expanded === t.tableName && (
            <div className="sample-viewer__body">
              {loading === t.tableName && <p className="sample-viewer__loading">Loading…</p>}
              {data[t.tableName]?.error && (
                <p className="sample-viewer__error">{data[t.tableName].error}</p>
              )}
              {data[t.tableName]?.rows && (
                <div className="sample-viewer__scroll">
                  <table className="sample-viewer__data">
                    <thead>
                      <tr>
                        {data[t.tableName].columns.map((col) => (
                          <th key={col}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data[t.tableName].rows.map((row, i) => (
                        <tr key={i}>
                          {data[t.tableName].columns.map((col) => (
                            <td key={col}>{String(row[col] ?? '')}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </section>
  );
};

export default SampleDataViewer;
