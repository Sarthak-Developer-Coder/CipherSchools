import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchAssignment, executeQuery } from '../../api';
import QuestionPanel from '../../components/QuestionPanel/QuestionPanel';
import SampleDataViewer from '../../components/SampleDataViewer/SampleDataViewer';
import SQLEditor from '../../components/SQLEditor/SQLEditor';
import ResultsPanel from '../../components/ResultsPanel/ResultsPanel';
import HintPanel from '../../components/HintPanel/HintPanel';
import { FiArrowLeft } from 'react-icons/fi';
import './Assignment.scss';

const Assignment = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [sql, setSql] = useState('-- Write your SQL query here\nSELECT ');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [running, setRunning] = useState(false);

  useEffect(() => {
    fetchAssignment(id)
      .then((res) => setAssignment(res.data))
      .catch(() => setError('Could not load assignment.'));
  }, [id]);

  const handleExecute = async () => {
    setRunning(true);
    setResult(null);
    setError('');
    try {
      const res = await executeQuery(sql, id);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Query execution failed.');
    } finally {
      setRunning(false);
    }
  };

  if (!assignment && !error) {
    return <div className="assignment__loading">Loading assignment…</div>;
  }

  return (
    <main className="assignment container">
      <Link to="/" className="assignment__back"><FiArrowLeft /> Back to Assignments</Link>

      {assignment && (
        <div className="assignment__layout">
          {/* Left / top column */}
          <div className="assignment__sidebar">
            <QuestionPanel assignment={assignment} />
            <SampleDataViewer tables={assignment.tables} />
            <HintPanel
              question={assignment.description}
              userQuery={sql}
              tables={assignment.tables}
            />
          </div>

          {/* Right / bottom column */}
          <div className="assignment__main">
            <SQLEditor
              value={sql}
              onChange={(val) => setSql(val || '')}
              onExecute={handleExecute}
              loading={running}
            />
            <ResultsPanel result={result} error={error} />
          </div>
        </div>
      )}
    </main>
  );
};

export default Assignment;
