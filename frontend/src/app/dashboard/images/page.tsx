'use client';

import { useState } from 'react';
import { Image as ImageIcon, Sparkles, Download, Loader2, Palette } from 'lucide-react';

const stylePresets = [
  { id: 'modern', name: 'Modern', color: 'from-blue-500 to-purple-500' },
  { id: 'vintage', name: 'Vintage', color: 'from-amber-500 to-orange-500' },
  { id: 'minimal', name: 'Minimal', color: 'from-gray-500 to-zinc-500' },
  { id: 'bold', name: 'Bold', color: 'from-red-500 to-pink-500' },
  { id: 'nature', name: 'Nature', color: 'from-green-500 to-emerald-500' },
  { id: 'tech', name: 'Tech', color: 'from-cyan-500 to-blue-500' },
];

export default function ImagesPage() {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('modern');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setGeneratedImages([]);

    try {
      const response = await fetch('/api/images/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          style: selectedStyle,
        }),
      });

      const data = await response.json();
      
      if (data.images) {
        setGeneratedImages(data.images);
      }
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-clash font-bold mb-2">AI Image Generator</h1>
        <p className="text-text-secondary">Create stunning visuals for your social media</p>
      </div>

      {/* Generator */}
      <div className="glass-card rounded-2xl p-6">
        <div className="space-y-6">
          {/* Prompt Input */}
          <div>
            <label className="block text-sm font-medium mb-3">Describe your image</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A modern office workspace with plants and natural lighting..."
              className="w-full h-32 px-4 py-3 rounded-xl bg-background border border-primary/20 focus:border-primary focus:outline-none resize-none"
            />
          </div>

          {/* Style Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">Choose Style</label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {stylePresets.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-4 rounded-xl transition-all ${
                    selectedStyle === style.id
                      ? 'bg-primary/20 border-2 border-primary'
                      : 'bg-background/50 border-2 border-transparent hover:border-primary/30'
                  }`}
                >
                  <div className={`w-8 h-8 mx-auto mb-2 rounded-lg bg-gradient-to-br ${style.color}`} />
                  <span className="text-xs">{style.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
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
                Generate Image
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Images */}
      {generatedImages.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-clash font-semibold">Generated Images</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {generatedImages.map((image, index) => (
              <div key={index} className="glass-card rounded-2xl overflow-hidden">
                <div className="aspect-square bg-background/50 relative">
                  <img 
                    src={image} 
                    alt={`Generated ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Image {index + 1}</span>
                  <button className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="glass-card rounded-2xl p-6 border-l-4 border-accent">
        <h3 className="font-semibold mb-2">💡 Tips for better images</h3>
        <ul className="text-text-secondary text-sm space-y-2">
          <li>• Be specific about colors, lighting, and composition</li>
          <li>• Mention the mood or atmosphere you want</li>
          <li>• Include details about the subject matter</li>
        </ul>
      </div>
    </div>
  );
}
