import { memo } from 'react';

interface Props {
  label: string;
  rating: number;
  max?: number;
}

export const RatingStars = memo(function RatingStars({ label, rating, max = 5 }: Props) {
  return (
    <span className="text-gray-300" aria-label={`${label} ${rating}/${max}`}>
      {label} {'★'.repeat(rating)}{'☆'.repeat(max - rating)}
    </span>
  );
});
