'use client';

import { useState } from 'react';
import { User, Save, Bell, Shield, Palette, Trash2 } from 'lucide-react';

const industries = [
  'Technology',
  'Fashion',
  'Food & Beverage',
  'Health & Wellness',
  'Education',
  'Finance',
  'Real Estate',
  'Travel',
  'Entertainment',
  'Retail',
  'Other',
];

const tones = [
  'Professional',
  'Casual',
  'Humorous',
  'Inspirational',
  'Technical',
  'Friendly',
];

export default function SettingsPage() {
  const [brandProfile, setBrandProfile] = useState({
    business_name: '',
    description: '',
    industry: '',
    tone: 'Professional',
    target_audience: '',
    brand_colors: ['#6366F1'],
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brandProfile),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-clash font-bold mb-2">Settings</h1>
        <p className="text-text-secondary">Manage your account and brand preferences</p>
      </div>

      {/* Brand Profile */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Palette className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-clash font-semibold">Brand Voice</h2>
            <p className="text-text-secondary text-sm">Define your brand identity for AI content generation</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Business Name</label>
            <input
              type="text"
              value={brandProfile.business_name}
              onChange={(e) => setBrandProfile({ ...brandProfile, business_name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-background border border-primary/20 focus:border-primary focus:outline-none"
              placeholder="Your Business Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Industry</label>
            <select
              value={brandProfile.industry}
              onChange={(e) => setBrandProfile({ ...brandProfile, industry: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-background border border-primary/20 focus:border-primary focus:outline-none"
            >
              <option value="">Select industry</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Business Description</label>
            <textarea
              value={brandProfile.description}
              onChange={(e) => setBrandProfile({ ...brandProfile, description: e.target.value })}
              className="w-full h-32 px-4 py-3 rounded-xl bg-background border border-primary/20 focus:border-primary focus:outline-none resize-none"
              placeholder="Tell us about your business..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Brand Tone</label>
            <select
              value={brandProfile.tone}
              onChange={(e) => setBrandProfile({ ...brandProfile, tone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-background border border-primary/20 focus:border-primary focus:outline-none"
            >
              {tones.map((tone) => (
                <option key={tone} value={tone}>{tone}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Target Audience</label>
            <input
              type="text"
              value={brandProfile.target_audience}
              onChange={(e) => setBrandProfile({ ...brandProfile, target_audience: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-background border border-primary/20 focus:border-primary focus:outline-none"
              placeholder="e.g., Young professionals, 25-35"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Brand Colors</label>
            <div className="flex gap-3">
              {brandProfile.brand_colors.map((color, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => {
                      const newColors = [...brandProfile.brand_colors];
                      newColors[index] = e.target.value;
                      setBrandProfile({ ...brandProfile, brand_colors: newColors });
                    }}
                    className="w-12 h-12 rounded-lg cursor-pointer"
                  />
                </div>
              ))}
              <button
                onClick={() => setBrandProfile({ ...brandProfile, brand_colors: [...brandProfile.brand_colors, '#6366F1'] })}
                className="w-12 h-12 rounded-lg border-2 border-dashed border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="mt-6 glow-button px-6 py-3 rounded-xl text-white font-medium flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Notifications */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
            <Bell className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-clash font-semibold">Notifications</h2>
            <p className="text-text-secondary text-sm">Manage your notification preferences</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { label: 'Email notifications for new posts', enabled: true },
            { label: 'Payment reminders', enabled: true },
            { label: 'Weekly analytics report', enabled: false },
            { label: 'Marketing and promotional emails', enabled: false },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-background/50">
              <span>{item.label}</span>
              <button
                className={`w-12 h-6 rounded-full transition-colors ${
                  item.enabled ? 'bg-primary' : 'bg-text-secondary/30'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  item.enabled ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Account */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-error/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-error" />
          </div>
          <div>
            <h2 className="text-xl font-clash font-semibold">Account</h2>
            <p className="text-text-secondary text-sm">Manage your account settings</p>
          </div>
        </div>

        <div className="space-y-4">
          <button className="w-full p-4 rounded-xl bg-background/50 flex items-center justify-between hover:bg-error/10 transition-colors">
            <span className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-error" />
              Delete Account
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
