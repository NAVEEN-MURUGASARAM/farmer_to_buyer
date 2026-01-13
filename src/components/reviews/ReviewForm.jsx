// src/components/reviews/ReviewForm.jsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RatingStars from './RatingStars';
import ImageUpload from '@/components/common/ImageUpload';

export default function ReviewForm({ productId, onSubmit, onCancel }) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    if (!comment.trim()) {
      alert('Please write a review comment');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        productId,
        rating,
        title: title.trim(),
        comment: comment.trim(),
        images,
      });
      // Reset form
      setRating(0);
      setTitle('');
      setComment('');
      setImages([]);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
        <RatingStars rating={rating} interactive={true} onChange={setRating} size={28} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Review Title</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience (optional)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Review *</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Share your experience with this product..."
          required
        />
      </div>

      <div>
        <ImageUpload
          images={images}
          onChange={setImages}
          maxImages={3}
          label="Add Photos (Optional)"
        />
      </div>

      <div className="flex gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </div>
    </form>
  );
}

