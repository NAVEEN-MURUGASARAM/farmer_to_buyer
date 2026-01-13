// src/components/products/SearchBar.jsx
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function SearchBar() {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 text-gray-400" size={20} />
      <Input
        placeholder="Search for products, farmers, categories..."
        className="pl-10 py-2 border-gray-300"
      />
    </div>
  );
}