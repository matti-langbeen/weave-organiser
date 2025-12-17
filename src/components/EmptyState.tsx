import './EmptyState.css';

interface EmptyStateProps {
  message: string;
  description?: string;
}

const EmptyState = ({ message, description }: EmptyStateProps) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">📭</div>
      <h3>{message}</h3>
      {description && <p>{description}</p>}
    </div>
  );
};

export default EmptyState;
