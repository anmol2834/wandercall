import './CardSkeleton.css';

const CardSkeleton = () => {
  return (
    <div className="card-skeleton">
      <div className="skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-location"></div>
        <div className="skeleton-description"></div>
        <div className="skeleton-description short"></div>
        <div className="skeleton-footer">
          <div className="skeleton-rating"></div>
          <div className="skeleton-price"></div>
        </div>
      </div>
    </div>
  );
};

export default CardSkeleton;