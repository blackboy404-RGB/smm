'use client';

import { useState } from 'react';
import { CreditCard, Check, Sparkles, Loader2, Phone } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Perfect for getting started',
    features: [
      '5 AI-generated posts/month',
      'Basic content calendar',
      'Brand voice setup',
      'Email support'
    ],
    popular: false
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 2500,
    description: 'Best for growing businesses',
    features: [
      'Unlimited AI-generated posts',
      'Advanced content calendar',
      'AI image generation',
      'Basic scheduling',
      'Priority support'
    ],
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 5000,
    description: 'For serious marketers',
    features: [
      'Everything in Pro',
      'Auto-posting automation',
      'Analytics dashboard',
      'Multi-platform management',
      'Dedicated account manager'
    ],
    popular: false
  }
];

export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const handlePayment = async () => {
    if (!phone.trim()) return;
    
    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      const url = `${API_BASE_URL}/api/payments/stk-push`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone,
          amount: plans.find(p => p.id === selectedPlan)?.price || 0,
          plan: selectedPlan,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setPaymentStatus('success');
      } else {
        setPaymentStatus('error');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-clash font-bold mb-2">Upgrade Your Plan</h1>
        <p className="text-text-secondary">Choose the plan that works best for you</p>
      </div>

      {/* Current Plan */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">Current Plan</h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-clash font-bold gradient-text">Free Plan</div>
            <p className="text-text-secondary text-sm">10 posts remaining this month</p>
          </div>
          <button className="px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium">
            Current
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            className={`glass-card rounded-2xl p-6 cursor-pointer transition-all ${
              selectedPlan === plan.id 
                ? 'border-primary ring-2 ring-primary/20' 
                : 'hover:border-primary/30'
            } ${plan.id === 'free' ? 'opacity-60' : ''}`}
          >
            {plan.popular && (
              <div className="mb-4 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-white text-xs font-medium w-fit">
                Most Popular
              </div>
            )}
            <h3 className="text-xl font-clash font-semibold mb-2">{plan.name}</h3>
            <div className="mb-4">
              <span className="text-3xl font-clash font-bold">KSh {plan.price}</span>
              <span className="text-text-secondary">/month</span>
            </div>
            <p className="text-text-secondary text-sm mb-4">{plan.description}</p>
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-success" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Payment Section */}
      {selectedPlan !== 'free' && (
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-xl font-clash font-semibold mb-6">Pay with M-Pesa</h2>
          
          {paymentStatus === 'success' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/20 flex items-center justify-center">
                <Check className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Payment Initiated!</h3>
              <p className="text-text-secondary">
                Please check your phone and enter your M-Pesa PIN to complete the payment.
              </p>
            </div>
          ) : paymentStatus === 'error' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-error/20 flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-error" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Payment Failed</h3>
              <p className="text-text-secondary mb-4">
                There was an issue processing your payment. Please try again.
              </p>
              <button 
                onClick={() => setPaymentStatus('idle')}
                className="px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">M-Pesa Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="254712345678"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-background border border-primary/20 focus:border-primary focus:outline-none"
                  />
                </div>
                <p className="text-text-secondary text-sm mt-2">
                  Enter the phone number linked to your M-Pesa account
                </p>
              </div>

              <div className="p-4 rounded-xl bg-background/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-text-secondary">Plan</span>
                  <span className="font-medium">{plans.find(p => p.id === selectedPlan)?.name}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-text-secondary">Amount</span>
                  <span className="font-medium">KSh {plans.find(p => p.id === selectedPlan)?.price}</span>
                </div>
                <div className="border-t border-primary/10 pt-2 mt-2 flex items-center justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-bold gradient-text">KSh {plans.find(p => p.id === selectedPlan)?.price}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing || !phone.trim()}
                className="w-full glow-button py-4 rounded-xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Pay KSh {plans.find(p => p.id === selectedPlan)?.price} with M-Pesa
                  </>
                )}
              </button>

              <p className="text-text-secondary text-sm text-center">
                You will receive an STK push prompt on your phone to complete the payment.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
