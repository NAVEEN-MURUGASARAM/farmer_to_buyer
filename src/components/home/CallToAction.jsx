// src/components/home/CallToAction.jsx
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CallToAction() {
  return (
    <section className="py-20 sm:py-28 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Whether you're a farmer looking to sell or a buyer seeking fresh produce, 
          FarmerToBuyer is your one-stop platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register">
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
            >
              Create Account
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
          <Link to="/products">
            <Button 
              size="lg" 
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50 w-full sm:w-auto"
            >
              Browse Products
            </Button>
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          Free to join • No credit card required • Same-day setup
        </p>
      </div>
    </section>
  );
}

export default CallToAction;