import React from "react";
import { Star } from "lucide-react";

export interface ReviewRatingStarsProps {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  showScore?: boolean;
  className?: string;
}

export const ReviewRatingStars: React.FC<ReviewRatingStarsProps> = ({
  rating,
  maxStars = 5,
  size = "sm",
  showScore = true,
  className = "",
}) => {
  const sizeMap = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const starIconSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="inline-flex items-center gap-0.5" dir="ltr">
        {Array.from({ length: maxStars }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= rating;
          return (
            <Star
              key={index}
              className={`${starIconSize} ${
                isFilled
                  ? "text-amber-400 fill-amber-400"
                  : "text-slate-600 fill-slate-800"
              } transition-colors`}
            />
          );
        })}
      </div>
      {showScore && (
        <span className="text-xs font-semibold text-amber-300 font-mono">
          {rating}.0
        </span>
      )}
    </div>
  );
};

export default ReviewRatingStars;
