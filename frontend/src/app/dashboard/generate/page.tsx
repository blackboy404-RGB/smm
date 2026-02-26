'use client';

import { useState } from 'react';
import { Sparkles, Copy, RefreshCw, Check, Instagram, Twitter, Linkedin, Facebook, Loader2 } from 'lucide-react';

const platforms = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'text-blue-400' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-600' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-500' },
];

const contentTypes = [
  { id: 'post', name: 'Post' },
  { id: 'caption', name: 'Caption' },
  { id: 'story', name: 'Story' },
  { id: 'thread', name: 'Thread' },
];

const tones = [
  'Professional',
  'Casual',
  'Humorous',
  'Inspirational',
  'Technical',
  'Friendly',
];

export default function GeneratePage() {
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [selectedType, setSelectedType] = useState('post');
  const [selectedTone, setSelectedTone] = useState('Professional');
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    setGeneratedContent([]);

    try {
      const response = await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: selectedPlatform,
          content_type: selectedType,
          tone: selectedTone,
          topic: topic,
        }),
      });

      const data = await response.json();
      
      if (data.content) {
        setGeneratedContent(data.content);
      }
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-clash font-bold mb-2">AI Content Generator</h1>
        <p className="text-text-secondary">Create engaging posts, captions, and more with AI</p>
      </div>

      {/* Generator Form */}
      <div className="glass-card rounded-2xl p-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Platform Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">Select Platform</label>
              <div className="grid grid-cols-4 gap-3">
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => setSelectedPlatform(platform.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                      selectedPlatform === platform.id
                        ? 'bg-primary/20 border-2 border-primary'
                        : 'bg-background/50 border-2 border-transparent hover:border-primary/30'
                    }`}
                  >
                    <platform.icon className={`w-6 h-6 ${platform.color}`} />
                    <span className="text-xs">{platform.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Type */}
            <div>
              <label className="block text-sm font-medium mb-3">Content Type</label>
              <div className="flex flex-wrap gap-2">
                {contentTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      selectedType === type.id
                        ? 'bg-primary text-white'
                        : 'bg-background/50 text-text-secondary hover:bg-primary/10'
                    }`}
                  >
                    {type.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone */}
            <div>
              <label className="block text-sm font-medium mb-3">Tone</label>
              <select
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-background border border-primary/20 focus:border-primary focus:outline-none"
              >
                {tones.map((tone) => (
                  <option key={tone} value={tone}>{tone}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Topic Input */}
            <div>
              <label className="block text-sm font-medium mb-3">What do you want to post about?</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Our new summer collection is finally here! 🍃..."
                className="w-full h-40 px-4 py-3 rounded-xl bg-background border border-primary/20 focus:border-primary focus:outline-none resize-none"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !topic.trim()}
              className="w-full glow-button py-4 rounded-xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Content
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Generated Content */}
      {generatedContent.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-clash font-semibold">Generated Content</h2>
          <div className="grid gap-4">
            {generatedContent.map((content, index) => (
              <div key={index} className="glass-card rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-text-primary whitespace-pre-wrap">{content}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(content, index)}
                      className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                      title="Copy to clipboard"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={handleGenerate}
                      className="p-2 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent transition-colors"
                      title="Regenerate"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-primary/10 flex items-center justify-between">
                  <span className="text-sm text-text-secondary">
                    {selectedTone} • {platforms.find(p => p.id === selectedPlatform)?.name}
                  </span>
                  <button className="px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors">
                    Add to Calendar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="glass-card rounded-2xl p-6 border-l-4 border-accent">
        <h3 className="font-semibold mb-2">💡 Tips for better results</h3>
        <ul className="text-text-secondary text-sm space-y-2">
          <li>• Be specific about your topic and include key details</li>
          <li>• Mention your target audience for more targeted content</li>
          <li>• Include any special offers or promotions you want to highlight</li>
        </ul>
      </div>
    </div>
  );
}
