import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Music, 
  Upload, 
  Play, 
  Pause, 
  Volume2, 
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  X,
  FileAudio,
  Loader2
} from 'lucide-react';
import { useVideo } from '@/contexts/VideoContext';
import { toast } from '@/hooks/use-toast';

export const MusicUploadStep: React.FC = () => {
  const { project, setProject, currentStep, setCurrentStep } = useVideo();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/mp4'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an MP3, WAV, or MP4 audio file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setAudioFile(file);
    uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 5) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadProgress(i);
      }

      // Simulate file processing
      const audioUrl = URL.createObjectURL(file);
      
      setProject(prev => ({
        ...prev,
        musicUrl: audioUrl,
        updatedAt: new Date(),
      }));

      toast({
        title: "Music Uploaded Successfully",
        description: `${file.name} has been uploaded and is ready to use.`,
      });

    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload music file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSkip = () => {
    setSkipped(true);
    toast({
      title: "Music Skipped",
      description: "Your video will be created without background music.",
    });
  };

  const handleRemoveFile = () => {
    setAudioFile(null);
    setProject(prev => ({
      ...prev,
      musicUrl: undefined,
      updatedAt: new Date(),
    }));
    setSkipped(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const togglePlayback = () => {
    if (!project.musicUrl) return;

    if (audioElement) {
      // Stop current playback
      audioElement.pause();
      audioElement.currentTime = 0;
      setAudioElement(null);
      setIsPlaying(false);
      return;
    }

    // Start playback
    const audio = new Audio(project.musicUrl);
    audio.onloadeddata = () => {
      audio.play().catch(error => {
        console.error('Error playing music:', error);
        toast({
          title: "Music Playback Error",
          description: "Failed to play the uploaded music file.",
          variant: "destructive",
        });
        setIsPlaying(false);
      });
    };
    
    audio.onerror = () => {
      console.error('Music loading error');
      toast({
        title: "Music Loading Error",
        description: "Failed to load the music file.",
        variant: "destructive",
      });
      setIsPlaying(false);
    };
    
    setAudioElement(audio);
    setIsPlaying(true);
    
    audio.onended = () => {
      setAudioElement(null);
      setIsPlaying(false);
    };
  };

  const handleNext = () => {
    setProject(prev => ({
      ...prev,
      status: 'video-generation',
      updatedAt: new Date(),
    }));

    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mx-auto shadow-glow">
          <Music className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Background Music
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          You can now upload your background music for the video. Please upload your file 
          (MP3, WAV, etc.) or select 'Skip' if you prefer no background music.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="shadow-card bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileAudio className="w-5 h-5 text-primary" />
              Upload Music File
            </CardTitle>
            <CardDescription>
              Upload royalty-free background music (MP3, WAV, MP4 - max 10MB)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!audioFile && !skipped && (
              <div className="space-y-4">
                <div 
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">Upload Background Music</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop your audio file here, or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: MP3, WAV, MP4 • Max size: 10MB
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <div className="flex justify-center">
                  <Button onClick={handleSkip} variant="outline" size="lg">
                    Skip Background Music
                  </Button>
                </div>
              </div>
            )}

            {isUploading && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span className="font-medium">Uploading {audioFile?.name}...</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-muted-foreground text-center">
                  {uploadProgress}% complete
                </p>
              </div>
            )}

            {audioFile && project.musicUrl && (
              <Card className="p-4 bg-video-success/10 border-video-success/20 animate-scale-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-video-success rounded-full flex items-center justify-center">
                      <Music className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-video-success">{audioFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(audioFile.size)} • Ready to use
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={togglePlayback}>
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleRemoveFile}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {skipped && (
              <Card className="p-4 bg-muted/50 border-border/50 animate-scale-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted-foreground rounded-full flex items-center justify-center">
                      <Volume2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">No Background Music</p>
                      <p className="text-sm text-muted-foreground">
                        Your video will be created without background music
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setSkipped(false)}>
                    Add Music
                  </Button>
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
            disabled={!project.musicUrl && !skipped}
          >
            Next Step
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};