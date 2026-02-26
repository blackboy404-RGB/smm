'use client';

import { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Clock,
  Edit,
  Trash2
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

const platformIcons: Record<string, any> = {
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  facebook: Facebook,
};

const mockPosts = [
  { id: '1', platform: 'instagram', content: 'New product launch!', date: new Date(), time: '10:00', status: 'scheduled' },
  { id: '2', platform: 'twitter', content: 'Industry news update', date: new Date(), time: '14:00', status: 'draft' },
  { id: '3', platform: 'linkedin', content: 'Company milestone', date: new Date(Date.now() + 86400000), time: '09:00', status: 'scheduled' },
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [posts] = useState(mockPosts);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startDay = monthStart.getDay();
  const paddingDays = Array(startDay).fill(null);

  const selectedDatePosts = posts.filter(post => isSameDay(post.date, selectedDate));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-clash font-bold mb-2">Content Calendar</h1>
          <p className="text-text-secondary">Plan and schedule your content</p>
        </div>
        <button className="glow-button px-5 py-2 rounded-xl text-white font-medium flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Post
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-clash font-semibold">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 rounded-lg text-sm hover:bg-primary/10 transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-text-secondary py-2">
                {day}
              </div>
            ))}
            
            {paddingDays.map((_, index) => (
              <div key={`padding-${index}`} className="aspect-square" />
            ))}

            {days.map(day => {
              const dayPosts = posts.filter(post => isSameDay(post.date, day));
              const isSelected = isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());

              return (
                <button
                  key={day.toString()}
                  onClick={() => setSelectedDate(day)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-start pt-2 transition-all relative ${
                    isSelected 
                      ? 'bg-primary/20 border-2 border-primary' 
                      : 'hover:bg-primary/10'
                  } ${!isSameMonth(day, currentDate) ? 'opacity-30' : ''}`}
                >
                  <span className={`text-sm ${isToday ? 'w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center' : ''}`}>
                    {format(day, 'd')}
                  </span>
                  {dayPosts.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {dayPosts.slice(0, 3).map((post, i) => (
                        <div 
                          key={i} 
                          className="w-1.5 h-1.5 rounded-full bg-primary"
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Details */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-clash font-semibold">
              {format(selectedDate, 'EEEE, MMM d')}
            </h2>
          </div>

          {selectedDatePosts.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="w-12 h-12 text-text-secondary mx-auto mb-4 opacity-50" />
              <p className="text-text-secondary">No posts scheduled</p>
              <button className="mt-4 text-primary text-sm hover:underline">
                Create a new post
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDatePosts.map(post => {
                const PlatformIcon = platformIcons[post.platform] || Instagram;
                return (
                  <div 
                    key={post.id} 
                    className="p-4 rounded-xl bg-background/50 border border-primary/10"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <PlatformIcon className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium capitalize">{post.platform}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="p-1 hover:bg-primary/10 rounded">
                          <Edit className="w-4 h-4 text-text-secondary" />
                        </button>
                        <button className="p-1 hover:bg-error/10 rounded">
                          <Trash2 className="w-4 h-4 text-error" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary mb-2 line-clamp-2">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-secondary flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.time}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        post.status === 'scheduled' ? 'bg-success/20 text-success' : 'bg-text-secondary/20'
                      }`}>
                        {post.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
