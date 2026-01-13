// src/components/common/LoadingSpinner.jsx
import { Loader } from 'lucide-react';

export default function LoadingSpinner({ size = 24, className = '' }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader size={size} className="animate-spin text-green-600" />
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size={48} />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

