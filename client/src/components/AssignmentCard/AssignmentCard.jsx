import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import './AssignmentCard.scss';

const badgeClass = (d) => `assignment-card__badge assignment-card__badge--${d}`;

const AssignmentCard = ({ assignment }) => {
  const { _id, title, description, difficulty, tables } = assignment;

  return (
    <Link to={`/assignment/${_id}`} className="assignment-card">
      <div className="assignment-card__header">
        <span className={badgeClass(difficulty)}>{difficulty}</span>
        <span className="assignment-card__tables">
          {tables.length} table{tables.length !== 1 && 's'}
        </span>
      </div>

      <h3 className="assignment-card__title">{title}</h3>
      <p className="assignment-card__desc">{description}</p>

      <div className="assignment-card__footer">
        <span className="assignment-card__cta">
          Attempt <FiArrowRight />
        </span>
      </div>
    </Link>
  );
};

export default AssignmentCard;
