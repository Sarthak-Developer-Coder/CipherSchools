import { FiBookOpen } from 'react-icons/fi';
import './QuestionPanel.scss';

const QuestionPanel = ({ assignment }) => {
  if (!assignment) return null;

  return (
    <section className="question-panel">
      <div className="question-panel__header">
        <FiBookOpen />
        <h2 className="question-panel__title">{assignment.title}</h2>
        <span className={`question-panel__badge question-panel__badge--${assignment.difficulty}`}>
          {assignment.difficulty}
        </span>
      </div>
      <p className="question-panel__desc">{assignment.description}</p>

      <div className="question-panel__tables">
        <h4>Relevant Tables</h4>
        <div className="question-panel__chips">
          {assignment.tables.map((t) => (
            <span key={t.tableName} className="question-panel__chip">{t.tableName}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuestionPanel;
