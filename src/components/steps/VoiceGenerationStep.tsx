import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Mic, 
  Play, 
  Pause, 
  Download, 
  ArrowRight,
  ArrowLeft,
  Volume2,
  Edit3
} from 'lucide-react';
import { useVideo } from '@/contexts/VideoContext';
import { toast } from '@/hooks/use-toast';
import { VoiceOption } from '@/types/video';

const voiceOptions: VoiceOption[] = [
  {
    id: 'hindi-female',
    name: 'Hindi Female Voice',
    gender: 'female',
    language: 'hi-IN',
    accent: 'Indian',
    responsiveVoiceName: 'Hindi Female'
  },
  {
    id: 'hindi-male', 
    name: 'Hindi Male Voice',
    gender: 'male',
    language: 'hi-IN',
    accent: 'Indian',
    responsiveVoiceName: 'Hindi Male'
  }
];

export const VoiceGenerationStep: React.FC = () => {
  const { project, setProject, currentStep, setCurrentStep, apiKeys } = useVideo();
  const [selectedVoice, setSelectedVoice] = useState(voiceOptions[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(project.audioUrl || null);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [voiceText, setVoiceText] = useState(project.text);
  const [isEditing, setIsEditing] = useState(false);

  const generateVoiceover = async () => {
    if (!selectedVoice || !voiceText.trim()) return;
    
    setIsGenerating(true);
    try {
      const selectedVoiceOption = voiceOptions.find(v => v.id === selectedVoice);
      if (!selectedVoiceOption) throw new Error('Voice not found');

      // Generate voice using OpenAI TTS API
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer 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`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: voiceText,
          voice: selectedVoiceOption.gender === 'female' ? 'nova' : 'onyx',
          response_format: 'mp3'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate voice');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      setProject(prev => ({
        ...prev,
        text: voiceText,
        audioUrl,
        voiceGender: selectedVoiceOption.gender,
        voiceLanguage: selectedVoiceOption.language
      }));
      setGeneratedAudio(audioUrl);
      setIsEditing(false);
      
      toast({
        title: "Divine Voiceover Generated",
        description: "Your sacred narration has been created successfully using ResponsiveVoice.",
      });
    } catch (error) {
      toast({
        title: "Voice Generation Failed",
        description: "Failed to generate voiceover. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const playPreview = (voiceId: string) => {
    const voice = voiceOptions.find(v => v.id === voiceId);
    if (!voice) return;
    
    setIsPlaying(voiceId);
    
    if (typeof window !== 'undefined' && (window as any).responsiveVoice) {
      (window as any).responsiveVoice.speak(
        "नमस्ते, मैं आपका भक्ति वॉइस असिस्टेंट हूं। राम राम।",
        voice.responsiveVoiceName,
        {
          onend: () => setIsPlaying(null),
          onerror: () => setIsPlaying(null)
        }
      );
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleNext = () => {
    if (!generatedAudio) {
      toast({
        title: "Voiceover Required",
        description: "Please generate a voiceover before proceeding to the next step.",
        variant: "destructive",
      });
      return;
    }

    // Skip image generation if disabled
    const nextStatus = project.generateImage ? 'image-generation' : 'music-upload';
    const nextStep = project.generateImage ? currentStep + 1 : currentStep + 2;

    setProject(prev => ({
      ...prev,
      status: nextStatus,
      updatedAt: new Date(),
    }));

    setCurrentStep(nextStep);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mx-auto shadow-glow">
          <Mic className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Divine Voice Generation
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We will now generate the sacred voiceover for your Hindu devotional content using ResponsiveVoice with 
          natural Indian voices. Choose your preferred voice and create divine narration.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="shadow-card bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-primary" />
              Select Sacred Voice
            </CardTitle>
            <CardDescription>
              Choose from our natural-sounding Hindi voices for devotional content
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
                          disabled={isPlaying === voice.id}
                        >
                          {isPlaying === voice.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
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
            <CardTitle className="flex items-center justify-between">
              Generate Sacred Voiceover
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {isEditing ? 'Preview' : 'Edit Text'}
              </Button>
            </CardTitle>
            <CardDescription>
              Create your devotional voiceover using ResponsiveVoice API. Only text is needed for voice generation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-2">Sacred Text to convert:</p>
              {isEditing ? (
                <Textarea
                  value={voiceText}
                  onChange={(e) => setVoiceText(e.target.value)}
                  className="min-h-[100px] text-sm"
                  placeholder="Edit your text for voice generation..."
                />
              ) : (
                <p className="text-sm text-muted-foreground line-clamp-4">
                  {voiceText}
                </p>
              )}
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
                    Generating Divine Voice...
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    Generate Sacred Voiceover
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
                      <p className="font-medium text-video-success">Divine Voiceover Generated</p>
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
          </CardContent>
        </Card>

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
            className="min-w-32"
            disabled={!generatedAudio}
          >
            Next Step
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};