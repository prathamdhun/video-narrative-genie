import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { FileText, ArrowRight, Sparkles } from 'lucide-react';
import { useVideo } from '@/contexts/VideoContext';
import { toast } from '@/hooks/use-toast';

export const TextInputStep: React.FC = () => {
  const { project, setProject, currentStep, setCurrentStep } = useVideo();
  const [text, setText] = useState(project.text || '');

  const handleNext = () => {
    if (!text.trim()) {
      toast({
        title: "Text Required",
        description: "Please input some text to convert into a video.",
        variant: "destructive",
      });
      return;
    }

    if (text.length < 10) {
      toast({
        title: "Text Too Short",
        description: "Please provide at least 10 characters for better video generation.",
        variant: "destructive",
      });
      return;
    }

    setProject(prev => ({
      ...prev,
      text,
      status: 'processing',
      updatedAt: new Date(),
    }));

    setCurrentStep(currentStep + 1);
    
    toast({
      title: "Text Saved",
      description: "Your text has been saved. Proceeding to processing...",
    });
  };

  const exampleTexts = [
    "Welcome to our innovative platform that transforms your ideas into stunning videos. Our advanced AI technology analyzes your content and creates professional-quality videos in minutes.",
    "Imagine a world where technology seamlessly integrates with human creativity. This is the future we are building - a place where artificial intelligence empowers storytellers to bring their visions to life.",
    "The art of storytelling has evolved through the ages, from cave paintings to digital media. Today, we stand at the threshold of a new era where AI becomes the brush and creativity becomes limitless."
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mx-auto shadow-glow">
          <FileText className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Input Your Text
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Please input the text you want to convert into a video. This could be a script, 
          a short story, or any content you'd like to turn into a video. Once you've input 
          the text, click 'Next' to proceed.
        </p>
      </div>

      <Card className="shadow-card bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Your Content
          </CardTitle>
          <CardDescription>
            Write or paste your text content. Minimum 10 characters required.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text-input">Text Content</Label>
            <Textarea
              id="text-input"
              placeholder="Enter your text here... e.g., 'Welcome to our amazing platform where creativity meets technology...'"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[200px] resize-none focus:ring-primary/50 focus:border-primary/50"
            />
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Characters: {text.length}</span>
              <span className={text.length >= 10 ? "text-video-success" : "text-video-warning"}>
                {text.length >= 10 ? "Ready to proceed" : "Minimum 10 characters"}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Example Texts (Click to use)</Label>
            <div className="grid gap-2">
              {exampleTexts.map((example, index) => (
                <Card 
                  key={index}
                  className="p-3 cursor-pointer hover:bg-accent transition-colors border-dashed"
                  onClick={() => setText(example)}
                >
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {example}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              onClick={handleNext}
              size="lg"
              variant="hero"
              className="min-w-32"
              disabled={!text.trim() || text.length < 10}
            >
              Next Step
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};