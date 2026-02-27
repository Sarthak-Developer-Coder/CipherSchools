import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import './ResultsPanel.scss';

const ResultsPanel = ({ result, error }) => {
  if (!result && !error) {
    return (
      <section className="results-panel results-panel--empty">
        <p>Run a query to see results here</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="results-panel results-panel--error">
        <div className="results-panel__header results-panel__header--error">
          <FiAlertCircle /> Error
        </div>
        <pre className="results-panel__pre">{error}</pre>
      </section>
    );
  }

  return (
    <section className="results-panel">
      <div className="results-panel__header">
        <FiCheckCircle /> Results
        <span className="results-panel__count">{result.rowCount} row{result.rowCount !== 1 && 's'}</span>
      </div>
      <div className="results-panel__scroll">
        <table className="results-panel__table">
          <thead>
            <tr>
              {result.columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row, i) => (
              <tr key={i}>
                {result.columns.map((col) => (
                  <td key={col}>{String(row[col] ?? 'NULL')}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ResultsPanel;
