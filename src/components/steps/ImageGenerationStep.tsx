import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Image, 
  Palette, 
  Sparkles, 
  Download, 
  RefreshCw, 
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle,
  Settings
} from 'lucide-react';
import { useVideo } from '@/contexts/VideoContext';
import { toast } from '@/hooks/use-toast';

const imageStyles = [
  'Divine Temple Architecture',
  'Sacred Lotus Garden',
  'Mystical Mountain Sunset',
  'Golden Mandala Background',
  'Ancient Sanskrit Scrolls',
  'Celestial Star Field',
  'Peaceful River Ganga',
  'Holy Fire Ceremony'
];

const colorSchemes = [
  { name: 'Saffron Sacred', colors: ['#ff6600', '#ffaa44', '#ffe699'] },
  { name: 'Divine Blue', colors: ['#1e3a8a', '#3b82f6', '#93c5fd'] },
  { name: 'Lotus Pink', colors: ['#ec4899', '#f472b6', '#fbcfe8'] },
  { name: 'Golden Temple', colors: ['#f59e0b', '#fbbf24', '#fef3c7'] },
  { name: 'Emerald Vishnu', colors: ['#059669', '#10b981', '#86efac'] },
  { name: 'Crimson Shakti', colors: ['#dc2626', '#ef4444', '#fca5a5'] },
];

export const ImageGenerationStep: React.FC = () => {
  const { project, setProject, currentStep, setCurrentStep, apiKeys } = useVideo();
  const [isGenerating, setIsGenerating] = useState(false);
  const [imagePrompt, setImagePrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(imageStyles[0]);
  const [selectedColorScheme, setSelectedColorScheme] = useState(colorSchemes[0]);
  const [imageQuality, setImageQuality] = useState([80]);
  const [customizations, setCustomizations] = useState({
    includeText: true,
    textOverlay: true,
    logoUpload: false,
  });

  const generateImage = async () => {
    setIsGenerating(true);
    
    try {
      const apiKey = apiKeys.openai[0];
      if (!apiKey) throw new Error('OpenAI API key not found');

      // Real OpenAI API call for Hindu religious imagery
      const prompt = `Create a stunning, devotional Hindu religious background image based on this content: "${project.text}". 

Style requirements:
- High resolution, cinematic quality in ${selectedStyle} style
- Traditional Hindu iconography and symbols
- Warm, divine lighting with golden/saffron tones using ${selectedColorScheme.name} color scheme
- Sacred elements like lotus flowers, Om symbols, temple architecture
- Peaceful, spiritual atmosphere evoking bhakti and devotion
- Suitable for video background with ${imageQuality[0]}% quality
- No text or watermarks, 16:9 aspect ratio
- Hindu gods and goddesses imagery if relevant to content
- Traditional patterns and mandala designs
- Sacred geometry and spiritual symbolism

${imagePrompt ? `Additional elements: ${imagePrompt}` : ''}

The image should evoke feelings of devotion, peace, and spiritual connection suitable for Hindu religious content with divine presence and sacred atmosphere.`;

      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: prompt,
          n: 1,
          size: '1792x1024',
          quality: 'hd'
        })
      });

      if (!response.ok) {
        throw new Error('OpenAI API call failed');
      }

      const data = await response.json();
      const imageUrl = data.data[0].url;
      
      setProject(prev => ({
        ...prev,
        imageUrl,
        updatedAt: new Date(),
      }));

      toast({
        title: "Sacred Image Generated Successfully",
        description: "Your divine background image has been created with Hindu religious themes and spiritual elements.",
      });

    } catch (error) {
      toast({
        title: "Image Generation Failed",
        description: "Failed to generate sacred image. Please try again with different settings.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    if (!project.imageUrl) {
      toast({
        title: "Sacred Image Required",
        description: "Please generate a divine background image before proceeding.",
        variant: "destructive",
      });
      return;
    }

    setProject(prev => ({
      ...prev,
      status: 'music-upload',
      updatedAt: new Date(),
    }));

    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mx-auto shadow-glow">
          <Image className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Divine Image Generation
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Next, we will generate a sacred background image template to use in your Hindu devotional video. 
          Based on your spiritual content, we will create divine visuals with traditional Hindu iconography, 
          sacred symbols, and beautiful temple aesthetics.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="shadow-card bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Sacred Image Customization
            </CardTitle>
            <CardDescription>
              Customize your divine background with Hindu religious themes and spiritual elements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image-prompt">Additional Sacred Elements (Optional)</Label>
                  <Textarea
                    id="image-prompt"
                    placeholder="Describe additional Hindu religious elements you want: specific gods/goddesses, sacred symbols, temple details, spiritual themes..."
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Divine Image Style</Label>
                  <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {imageStyles.map(style => (
                        <SelectItem key={style} value={style}>{style}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Image Quality ({imageQuality[0]}%)</Label>
                  <Slider
                    value={imageQuality}
                    onValueChange={setImageQuality}
                    max={100}
                    min={50}
                    step={10}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Sacred Color Scheme</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {colorSchemes.map(scheme => (
                      <div
                        key={scheme.name}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedColorScheme.name === scheme.name
                            ? 'border-primary bg-accent'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedColorScheme(scheme)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {scheme.colors.map((color, i) => (
                            <div
                              key={i}
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <p className="text-xs font-medium">{scheme.name}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Divine Enhancement Options</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="include-text"
                        checked={customizations.includeText}
                        onChange={(e) => setCustomizations(prev => ({
                          ...prev,
                          includeText: e.target.checked
                        }))}
                      />
                      <Label htmlFor="include-text" className="text-sm">Include sacred text overlay</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="text-overlay"
                        checked={customizations.textOverlay}
                        onChange={(e) => setCustomizations(prev => ({
                          ...prev,
                          textOverlay: e.target.checked
                        }))}
                      />
                      <Label htmlFor="text-overlay" className="text-sm">Divine Sanskrit font styling</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={generateImage}
                size="lg"
                variant="hero"
                disabled={isGenerating}
                className="min-w-48"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Divine Image...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Sacred Background
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {project.imageUrl && (
          <Card className="shadow-card bg-gradient-card border-border/50 animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-video-success" />
                Divine Image Generated
              </CardTitle>
              <CardDescription>
                Your sacred background image has been successfully created with Hindu religious themes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-video-secondary/20 flex items-center justify-center">
                  <div className="text-center">
                    <Image className="w-12 h-12 mx-auto mb-2 text-primary/60" />
                    <p className="text-sm text-muted-foreground">Sacred Hindu Background Image</p>
                    <Badge variant="outline" className="mt-2">
                      {selectedStyle} • {selectedColorScheme.name}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline" onClick={generateImage}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                </div>
                <Badge variant="secondary">
                  Quality: {imageQuality[0]}% • Divine Theme
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between pt-4">
          <Button
            onClick={handlePrevious}
            variant="outline"
            size="lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            size="lg"
            variant="hero"
            disabled={!project.imageUrl}
          >
            Next Step
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};