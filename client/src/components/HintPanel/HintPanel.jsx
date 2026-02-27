import { useState } from 'react';
import { getHint } from '../../api';
import { FiZap } from 'react-icons/fi';
import './HintPanel.scss';

const HintPanel = ({ question, userQuery, tables }) => {
  const [hint, setHint] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetHint = async () => {
    setLoading(true);
    setError('');
    try {
      const tableNames = (tables || []).map((t) => t.tableName);
      const res = await getHint(question, userQuery, tableNames);
      setHint(res.data.hint);
    } catch {
      setError('Could not generate hint. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="hint-panel">
      <div className="hint-panel__header">
        <button
          className="hint-panel__btn"
          onClick={handleGetHint}
          disabled={loading}
        >
          <FiZap />
          {loading ? 'Thinking…' : 'Get Hint'}
        </button>
        <span className="hint-panel__note">Hints guide you — they won't reveal the answer</span>
      </div>

      {error && <p className="hint-panel__error">{error}</p>}
      {hint && (
        <div className="hint-panel__body">
          <p className="hint-panel__text">{hint}</p>
        </div>
      )}
    </section>
  );
};

export default HintPanel;
