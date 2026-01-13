// src/components/reviews/RatingStars.jsx
import { useState } from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ rating = 0, size = 20, interactive = false, onChange }) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(rating);

  const handleClick = (value) => {
    if (interactive) {
      setCurrentRating(value);
      onChange?.(value);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const value = interactive ? (hoveredRating || currentRating) : rating;
        const filled = star <= value;
        return (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
            disabled={!interactive}
            className={interactive ? 'cursor-pointer hover:scale-110 transition' : ''}
          >
            <Star
              size={size}
              className={filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
            />
          </button>
        );
      })}
    </div>
  );
}
