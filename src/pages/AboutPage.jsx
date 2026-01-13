// src/pages/AboutPage.jsx
import { Card, CardContent } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About FarmerToBuyer</h1>
        
        <div className="space-y-8">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600">
                To revolutionize the agriculture industry by connecting farmers directly with buyers,
                ensuring fair prices, quality produce, and sustainable farming practices.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600">
                A world where farmers thrive, consumers get fresh and healthy food, and the supply chain
                is transparent and fair.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h2>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Transparency in all transactions</li>
                <li>✓ Fair pricing for farmers</li>
                <li>✓ Quality assurance for buyers</li>
                <li>✓ Sustainability and organic farming</li>
                <li>✓ Community-driven growth</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}