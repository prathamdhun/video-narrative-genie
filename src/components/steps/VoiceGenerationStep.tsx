import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Mic, Play, Pause, Download, ArrowRight, Volume2 } from 'lucide-react';
import { useVideo } from '@/contexts/VideoContext';
import { toast } from '@/hooks/use-toast';
import { VoiceOption } from '@/types/video';

const voiceOptions: VoiceOption[] = [
  {
    id: 'female-indian-1',
    name: 'Priya',
    gender: 'female',
    language: 'en-IN',
    accent: 'Indian English',
    preview: '/audio/preview-female-indian.mp3'
  },
  {
    id: 'male-indian-1',
    name: 'Arjun',
    gender: 'male',
    language: 'en-IN',
    accent: 'Indian English',
    preview: '/audio/preview-male-indian.mp3'
  },
  {
    id: 'female-indian-2',
    name: 'Ananya',
    gender: 'female',
    language: 'en-IN',
    accent: 'Indian English - Soft',
    preview: '/audio/preview-female-indian-2.mp3'
  },
  {
    id: 'male-indian-2',
    name: 'Vikram',
    gender: 'male',
    language: 'en-IN',
    accent: 'Indian English - Deep',
    preview: '/audio/preview-male-indian-2.mp3'
  },
];

export const VoiceGenerationStep: React.FC = () => {
  const { project, setProject, currentStep, setCurrentStep } = useVideo();
  const [selectedVoice, setSelectedVoice] = useState(voiceOptions[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const generateVoiceover = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate Google Text-to-Speech API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In real implementation, this would be the actual audio URL from Google TTS
      const audioUrl = `/audio/generated-${selectedVoice}-${Date.now()}.mp3`;
      setGeneratedAudio(audioUrl);
      
      setProject(prev => ({
        ...prev,
        audioUrl,
        voiceGender: voiceOptions.find(v => v.id === selectedVoice)?.gender || 'female',
        updatedAt: new Date(),
      }));

      toast({
        title: "Voiceover Generated",
        description: "Your voiceover has been successfully created using Google Text-to-Speech.",
      });

    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate voiceover. Please try again or select a different voice.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const playPreview = (voiceId: string) => {
    // In real implementation, this would play the actual preview
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 2000);
    
    toast({
      title: "Voice Preview",
      description: `Playing preview for ${voiceOptions.find(v => v.id === voiceId)?.name}`,
    });
  };

  const handleNext = () => {
    if (!generatedAudio) {
      toast({
        title: "Voiceover Required",
        description: "Please generate a voiceover before proceeding.",
        variant: "destructive",
      });
      return;
    }

    setProject(prev => ({
      ...prev,
      status: 'image-generation',
      updatedAt: new Date(),
    }));

    setCurrentStep(currentStep + 1);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mx-auto shadow-glow">
          <Mic className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Voice Generation
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We will now generate the voiceover for your text using Google Text-to-Speech with 
          natural Indian voices. Please choose your preferred voice and generate the audio.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="shadow-card bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-primary" />
              Select Voice
            </CardTitle>
            <CardDescription>
              Choose from our natural-sounding Indian English voices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedVoice} onValueChange={setSelectedVoice}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {voiceOptions.map((voice) => (
                  <Label
                    key={voice.id}
                    htmlFor={voice.id}
                    className="cursor-pointer"
                  >
                    <Card className={`p-4 transition-all hover:shadow-md ${
                      selectedVoice === voice.id 
                        ? 'border-primary bg-accent/50' 
                        : 'hover:border-primary/50'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value={voice.id} id={voice.id} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{voice.name}</h4>
                            <Badge variant={voice.gender === 'female' ? 'secondary' : 'outline'}>
                              {voice.gender}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{voice.accent}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.preventDefault();
                            playPreview(voice.id);
                          }}
                          disabled={isPlaying}
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                      </div>
                    </Card>
                  </Label>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Generate Voiceover</CardTitle>
            <CardDescription>
              Create your voiceover using Google Text-to-Speech API
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-2">Text to convert:</p>
              <p className="text-sm text-muted-foreground line-clamp-4">
                {project.text}
              </p>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={generateVoiceover}
                size="lg"
                variant="hero"
                disabled={isGenerating}
                className="min-w-40"
              >
                {isGenerating ? (
                  <>
                    <Mic className="w-4 h-4 mr-2 animate-pulse" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    Generate Voiceover
                  </>
                )}
              </Button>
            </div>

            {generatedAudio && (
              <Card className="p-4 bg-video-success/10 border-video-success/20 animate-scale-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-video-success rounded-full flex items-center justify-center">
                      <Volume2 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-video-success">Voiceover Generated</p>
                      <p className="text-sm text-muted-foreground">
                        Voice: {voiceOptions.find(v => v.id === selectedVoice)?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Play className="w-4 h-4 mr-2" />
                      Play
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {generatedAudio && (
              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleNext}
                  size="lg"
                  variant="hero"
                  className="min-w-32"
                >
                  Next Step
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};