import { memo } from 'react';
import './SkeletonLoader.css';

function SkeletonLoader() {
  const placeholders = Array.from({ length: 6 }, (_, index) => index);

  return (
    <div className="skeleton-container">
      <div className="skeleton-header">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-subtitle"></div>
      </div>
      <div className="skeleton skeleton-search"></div>
      <div className="skeleton-grid">
        {placeholders.map((index) => (
          <div key={index} className="skeleton-card">
            <div className="skeleton skeleton-card-title"></div>
            <div className="skeleton skeleton-card-code"></div>
            <div className="skeleton skeleton-card-price"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(SkeletonLoader);
