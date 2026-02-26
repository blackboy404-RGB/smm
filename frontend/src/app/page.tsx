'use client';

import Link from 'next/link';
import { 
  Sparkles, 
  Calendar, 
  Image, 
  CreditCard, 
  Zap, 
  Users, 
  ArrowRight, 
  CheckCircle,
  Star,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: Sparkles,
      title: 'AI Content Generation',
      description: 'Generate engaging posts, captions, and tweets instantly with our AI-powered engine tailored to your brand voice.'
    },
    {
      icon: Calendar,
      title: 'Smart Content Calendar',
      description: 'Plan your entire month with an intelligent calendar that suggests optimal posting times.'
    },
    {
      icon: Image,
      title: 'AI Image Generation',
      description: 'Create stunning visuals for your social media with text-to-image generation.'
    },
    {
      icon: CreditCard,
      title: 'Easy M-Pesa Payments',
      description: 'Pay seamlessly via M-Pesa STK Push. Simple, secure, and Kenyan-friendly.'
    },
    {
      icon: Zap,
      title: 'Auto-Posting (Premium)',
      description: 'Automatically post your scheduled content across all platforms with one click.'
    },
    {
      icon: Users,
      title: 'Brand Voice Customization',
      description: 'Define your unique brand voice and let AI create content that sounds exactly like you.'
    }
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: 'KSh 0',
      period: '/month',
      description: 'Perfect for getting started',
      features: [
        '10 AI-generated posts/month',
        'Basic content calendar',
        'Brand voice setup',
        'Email support'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Pro',
      price: 'KSh 2,500',
      period: '/month',
      description: 'Best for growing businesses',
      features: [
        'Unlimited AI-generated posts',
        'Advanced content calendar',
        'AI image generation',
        'Basic scheduling',
        'Priority support'
      ],
      cta: 'Go Pro',
      popular: true
    },
    {
      name: 'Premium',
      price: 'KSh 5,000',
      period: '/month',
      description: 'For serious marketers',
      features: [
        'Everything in Pro',
        'Auto-posting automation',
        'Analytics dashboard',
        'Multi-platform management',
        'Dedicated account manager'
      ],
      cta: 'Go Premium',
      popular: false
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Wanjiku',
      role: 'Fashion Boutique Owner',
      content: 'SocialFlow AI has transformed how I manage my boutique\'s social media. I save 10+ hours every week!',
      rating: 5
    },
    {
      name: 'James Otieno',
      role: 'Tech Startup Founder',
      content: 'The AI-generated content perfectly captures our brand voice. Highly recommended!',
      rating: 5
    },
    {
      name: 'Amina Hassan',
      role: 'Restaurant Owner',
      content: 'M-Pesa integration makes payments so easy. Best investment for my business.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-clash font-bold text-text-primary">SocialFlow AI</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-text-secondary hover:text-text-primary transition-colors">Features</a>
              <a href="#pricing" className="text-text-secondary hover:text-text-primary transition-colors">Pricing</a>
              <a href="#testimonials" className="text-text-secondary hover:text-text-primary transition-colors">Testimonials</a>
              <Link href="/login" className="text-text-secondary hover:text-text-primary transition-colors">Login</Link>
              <Link href="/register" className="glow-button px-5 py-2 rounded-lg text-white font-medium">
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-text-secondary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-card border-t border-primary/10">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-text-secondary hover:text-text-primary">Features</a>
              <a href="#pricing" className="block text-text-secondary hover:text-text-primary">Pricing</a>
              <a href="#testimonials" className="block text-text-secondary hover:text-text-primary">Testimonials</a>
              <Link href="/login" className="block text-text-secondary hover:text-text-primary">Login</Link>
              <Link href="/register" className="block glow-button px-5 py-2 rounded-lg text-white font-medium text-center">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Social Media Management</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-clash font-bold mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Create Viral Content<br />
            <span className="gradient-text">In Seconds, Not Hours</span>
          </h1>
          
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Let AI generate engaging posts, captions, and images for your brand. 
            Plan your content calendar and automate posting - all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Link href="/register" className="glow-button px-8 py-4 rounded-xl text-white font-semibold text-lg flex items-center gap-2">
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#features" className="px-8 py-4 rounded-xl border border-primary/30 text-text-primary font-semibold text-lg hover:bg-primary/10 transition-colors">
              See How It Works
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div>
              <div className="text-3xl md:text-4xl font-clash font-bold gradient-text">10K+</div>
              <div className="text-text-secondary text-sm mt-1">Posts Generated</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-clash font-bold gradient-text">2K+</div>
              <div className="text-text-secondary text-sm mt-1">Happy Users</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-clash font-bold gradient-text">50+</div>
              <div className="text-text-secondary text-sm mt-1">Industries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-clash font-bold mb-4">
              Everything You Need for <span className="gradient-text">Social Media Success</span>
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Powerful features designed to help businesses grow their online presence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="glass-card rounded-2xl p-6 hover-glow transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-clash font-semibold mb-2">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-surface/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-clash font-bold mb-4">
              Simple, Transparent <span className="gradient-text">Pricing</span>
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Choose the plan that fits your business needs. Pay easily with M-Pesa.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index}
                className={`glass-card rounded-2xl p-8 relative animate-fade-in ${plan.popular ? 'border-primary ring-2 ring-primary/20' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-accent rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-clash font-semibold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-clash font-bold gradient-text">{plan.price}</span>
                    <span className="text-text-secondary">{plan.period}</span>
                  </div>
                  <p className="text-text-secondary text-sm mt-2">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-3 text-text-secondary">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  href="/register" 
                  className={`block w-full py-3 rounded-xl font-semibold text-center transition-all ${
                    plan.popular 
                      ? 'glow-button text-white' 
                      : 'border border-primary/30 text-text-primary hover:bg-primary/10'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-clash font-bold mb-4">
              Loved by <span className="gradient-text">Business Owners</span>
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Join thousands of satisfied customers growing their business with SocialFlow AI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="glass-card rounded-2xl p-6 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-text-secondary mb-4">&ldquo;{testimonial.content}&rdquo;</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-text-secondary text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center glass-card rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 to-accent/10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-clash font-bold mb-4">
              Ready to Transform Your Social Media?
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto mb-8">
              Join thousands of businesses already using SocialFlow AI to create engaging content effortlessly.
            </p>
            <Link href="/register" className="glow-button px-10 py-4 rounded-xl text-white font-semibold text-lg inline-flex items-center gap-2">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-primary/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-clash font-bold">SocialFlow AI</span>
            </div>
            <div className="flex items-center gap-6 text-text-secondary text-sm">
              <a href="#" className="hover:text-text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-text-primary transition-colors">Contact</a>
            </div>
            <div className="text-text-secondary text-sm">
              © 2024 SocialFlow AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
