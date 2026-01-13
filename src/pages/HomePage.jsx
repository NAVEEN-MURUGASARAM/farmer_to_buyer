// src/pages/HomePage.jsx
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Shield, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import Stats from '@/components/home/Stats';
import CallToAction from '@/components/home/CallToAction';

export default function HomePage() {
  return (
    <div className="w-full">
      <Hero />
      <Features />
      <Stats />
      <CallToAction />
    </div>
  );
}