// src/components/reviews/ReviewList.jsx
import RatingStars from './RatingStars';
import { useState } from 'react';

export default function ReviewList({ reviews = [] }) {
  const [filter, setFilter] = useState('all');

  const filteredReviews = reviews.filter((review) => {
    if (filter === 'all') return true;
    return review.rating === parseInt(filter);
  });

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === 'all'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({reviews.length})
        </button>
        {[5, 4, 3, 2, 1].map((star) => {
          const count = reviews.filter((r) => r.rating === star).length;
          return (
            <button
              key={star}
              onClick={() => setFilter(star.toString())}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === star.toString()
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {star} Star{count !== 1 ? 's' : ''} ({count})
            </button>
          );
        })}
      </div>

      {/* Reviews */}
      <div className="space-y-6">
        {filteredReviews.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No reviews found</p>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-700 font-semibold">
                        {review.buyer_name?.[0] || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {review.buyer_name || 'Anonymous'}
                      </p>
                      {review.is_verified_purchase && (
                        <span className="text-xs text-green-600">Verified Purchase</span>
                      )}
                    </div>
                  </div>
                  <RatingStars rating={review.rating} size={16} />
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>

              {review.title && (
                <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
              )}

              <p className="text-gray-600 mb-3">{review.comment}</p>

              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mb-3">
                  {review.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt="Review"
                      className="w-20 h-20 object-cover rounded border"
                    />
                  ))}
                </div>
              )}

              {review.helpful_count > 0 && (
                <p className="text-sm text-gray-500">
                  {review.helpful_count} people found this helpful
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}


