import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const sizeMap = { sm: 'w-3.5 h-3.5', md: 'w-4.5 h-4.5', lg: 'w-6 h-6' };

const StarRating: React.FC<StarRatingProps> = ({ rating, maxStars = 5, size = 'sm', interactive = false, onChange }) => {
  const starSize = sizeMap[size];

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxStars }, (_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= Math.floor(rating);
        const isHalf = !isFilled && starValue <= Math.ceil(rating) && rating % 1 >= 0.3;

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(starValue)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          >
            <Star
              className={`${starSize} ${
                isFilled ? 'fill-amber-400 text-amber-400' :
                isHalf ? 'fill-amber-400/50 text-amber-400' :
                'fill-none text-muted-foreground/30'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
