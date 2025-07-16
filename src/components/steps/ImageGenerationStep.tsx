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
  'Professional Business',
  'Modern Minimalist',
  'Creative Artistic',
  'Tech Futuristic',
  'Warm Cinematic',
  'Corporate Clean',
  'Vibrant Colorful',
  'Elegant Classic'
];

const colorSchemes = [
  { name: 'Blue Professional', colors: ['#1e40af', '#3b82f6', '#93c5fd'] },
  { name: 'Purple Creative', colors: ['#7c3aed', '#a855f7', '#c4b5fd'] },
  { name: 'Green Natural', colors: ['#059669', '#10b981', '#86efac'] },
  { name: 'Orange Energetic', colors: ['#ea580c', '#f97316', '#fdba74'] },
  { name: 'Red Bold', colors: ['#dc2626', '#ef4444', '#fca5a5'] },
  { name: 'Teal Modern', colors: ['#0891b2', '#0ea5e9', '#7dd3fc'] },
];

export const ImageGenerationStep: React.FC = () => {
  const { project, setProject, currentStep, setCurrentStep } = useVideo();
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
      // Simulate OpenAI image generation
      const prompt = `${imagePrompt || 'Professional background based on: ' + project.text.substring(0, 100)} in ${selectedStyle} style with ${selectedColorScheme.name} color scheme, high quality, ${imageQuality[0]}% quality, suitable for video background`;
      
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Simulate generated image URL
      const imageUrl = `/images/generated-${Date.now()}.jpg`;
      
      setProject(prev => ({
        ...prev,
        imageUrl,
        updatedAt: new Date(),
      }));

      toast({
        title: "Image Generated Successfully",
        description: "Your background image has been created using OpenAI's image generation.",
      });

    } catch (error) {
      toast({
        title: "Image Generation Failed",
        description: "Failed to generate image. Please try again with different settings.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    if (!project.imageUrl) {
      toast({
        title: "Image Required",
        description: "Please generate an image before proceeding.",
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
          Image Generation
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Next, we will generate a background image template to use in your video. Based on the 
          content of your text, we will create an image template. You can modify colors, fonts, and visuals.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="shadow-card bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Image Customization
            </CardTitle>
            <CardDescription>
              Customize your background image style and appearance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image-prompt">Custom Image Prompt (Optional)</Label>
                  <Textarea
                    id="image-prompt"
                    placeholder="Describe additional elements you want in your background image..."
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Image Style</Label>
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
                  <Label>Quality ({imageQuality[0]}%)</Label>
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
                  <Label>Color Scheme</Label>
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
                  <Label>Additional Options</Label>
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
                      <Label htmlFor="include-text" className="text-sm">Include text overlay</Label>
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
                      <Label htmlFor="text-overlay" className="text-sm">Professional text styling</Label>
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
                    Generating Image...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Background Image
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
                Generated Image
              </CardTitle>
              <CardDescription>
                Your background image has been successfully created
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-video-secondary/20 flex items-center justify-center">
                  <div className="text-center">
                    <Image className="w-12 h-12 mx-auto mb-2 text-primary/60" />
                    <p className="text-sm text-muted-foreground">Generated Background Image</p>
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
                  Quality: {imageQuality[0]}%
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