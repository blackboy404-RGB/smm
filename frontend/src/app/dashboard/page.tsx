'use client';

import { Sparkles, Calendar, PenTool, Image, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const stats = [
    { label: 'Total Posts', value: '24', icon: PenTool, change: '+12%', color: 'text-primary' },
    { label: 'Scheduled', value: '8', icon: Calendar, change: '+5', color: 'text-accent' },
    { label: 'Published', value: '16', icon: CheckCircle, change: '+8', color: 'text-success' },
    { label: 'Images Created', value: '12', icon: Image, change: '+3', color: 'text-purple-400' },
  ];

  const recentContent = [
    { platform: 'Instagram', type: 'Post', content: 'New product launch announcement...', status: 'scheduled', time: '2 hours ago' },
    { platform: 'Twitter', type: 'Tweet', content: 'Quick tip for your business...', status: 'draft', time: '5 hours ago' },
    { platform: 'LinkedIn', type: 'Article', content: 'Industry insights and trends...', status: 'published', time: '1 day ago' },
  ];

  const upcomingPosts = [
    { title: 'Product Launch', platform: 'Instagram', date: 'Tomorrow, 10:00 AM' },
    { title: 'Customer Testimonial', platform: 'Facebook', date: 'Jan 15, 2:00 PM' },
    { title: 'Industry News', platform: 'Twitter', date: 'Jan 16, 9:00 AM' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-clash font-bold mb-2">Welcome back! 👋</h1>
        <p className="text-text-secondary">Here&apos;s what&apos;s happening with your social media</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="glass-card rounded-2xl p-5 hover-glow transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color} bg-primary/10`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-xs text-success font-medium">{stat.change}</span>
            </div>
            <div className="text-2xl font-clash font-bold">{stat.value}</div>
            <div className="text-text-secondary text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Content */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-clash font-semibold">Recent Content</h2>
            <Link href="/dashboard/generate" className="text-primary text-sm hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentContent.map((item, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-background/50">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                  <PenTool className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{item.platform}</span>
                    <span className="text-text-secondary text-sm">• {item.type}</span>
                  </div>
                  <p className="text-text-secondary text-sm truncate">{item.content}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.status === 'published' ? 'bg-success/20 text-success' :
                      item.status === 'scheduled' ? 'bg-accent/20 text-accent' :
                      'bg-text-secondary/20 text-text-secondary'
                    }`}>
                      {item.status}
                    </span>
                    <span className="text-text-secondary text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Posts */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-clash font-semibold">Upcoming Posts</h2>
            <Link href="/dashboard/calendar" className="text-primary text-sm hover:underline">
              View calendar
            </Link>
          </div>
          <div className="space-y-4">
            {upcomingPosts.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-background/50">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-text-secondary text-sm">{item.platform}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{item.date}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-6 pt-6 border-t border-primary/10">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link 
                href="/dashboard/generate" 
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
              >
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-medium">Generate Content</span>
              </Link>
              <Link 
                href="/dashboard/images" 
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-accent/10 hover:bg-accent/20 text-accent transition-colors"
              >
                <Image className="w-5 h-5" />
                <span className="text-sm font-medium">Create Image</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="glass-card rounded-2xl p-6 border-l-4 border-accent">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Pro Tip</h3>
            <p className="text-text-secondary text-sm">
              Posts with images get 2.3x more engagement! Try using our AI image generator to create stunning visuals for your content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
