import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause,
  Download,
  Share, 
  ArrowLeft,
  CheckCircle,
  Video,
  Image,
  Music,
  Mic,
  Copy,
  RefreshCw,
  FileText,
  Clock,
  Users,
  Eye
} from 'lucide-react';
import { useVideo } from '@/contexts/VideoContext';
import { toast } from '@/hooks/use-toast';

export const PreviewStep: React.FC = () => {
  const { project, setProject, currentStep, setCurrentStep } = useVideo();
  const [isPlaying, setIsPlaying] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const handlePlayVideo = () => {
    setIsPlaying(!isPlaying);
    toast({
      title: isPlaying ? "Video Paused" : "Video Playing",
      description: `${isPlaying ? "Paused" : "Playing"} your generated video.`,
    });
  };

  const handleDownload = async (type: 'video' | 'image' | 'audio') => {
    setIsDownloading(true);
    
    try {
      // Simulate download progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setDownloadProgress(i);
      }

      const fileTypes = {
        video: 'MP4 Video',
        image: 'Background Image',
        audio: 'Audio Track'
      };

      toast({
        title: `${fileTypes[type]} Downloaded`,
        description: `Your ${fileTypes[type].toLowerCase()} has been downloaded successfully.`,
      });

    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/video/${project.id}`;
    navigator.clipboard.writeText(shareUrl);
    
    toast({
      title: "Share Link Copied",
      description: "Share link has been copied to clipboard.",
    });
  };

  const handleCreateNew = () => {
    setProject(prev => ({
      id: crypto.randomUUID(),
      text: '',
      voiceGender: 'female',
      voiceLanguage: 'en-IN',
      status: 'text-input',
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    setCurrentStep(0);
    
    toast({
      title: "New Project Started",
      description: "Ready to create your next video!",
    });
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const projectStats = {
    duration: "2:34",
    resolution: "1920x1080",
    size: "45.2 MB",
    format: "MP4",
    created: project.createdAt.toLocaleDateString(),
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mx-auto shadow-glow">
          <CheckCircle className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Video Complete!
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Your video has been successfully created! You can now preview it and download 
          the video along with all the resources used in its creation.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Video Preview */}
        <Card className="shadow-card bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5 text-primary" />
              Video Preview
            </CardTitle>
            <CardDescription>
              Preview your generated video before downloading
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-video-secondary/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center mb-4 mx-auto cursor-pointer hover:bg-primary transition-colors ${isPlaying ? 'animate-pulse' : ''}`} onClick={handlePlayVideo}>
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                    <p className="text-sm text-foreground font-medium">
                      {isPlaying ? 'Now Playing' : 'Click to Play'} • {projectStats.duration}
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-2">
                      <Badge variant="secondary">{projectStats.resolution}</Badge>
                      <Badge variant="secondary">{projectStats.format}</Badge>
                      <Badge variant="secondary">{projectStats.size}</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <Button
                  onClick={handlePlayVideo}
                  variant="hero"
                  size="lg"
                  className="min-w-32"
                >
                  {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
                <Button
                  onClick={() => handleDownload('video')}
                  variant="success"
                  size="lg"
                  disabled={isDownloading}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Video
                </Button>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  size="lg"
                >
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Information */}
        <Card className="shadow-card bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Project Information
            </CardTitle>
            <CardDescription>
              Details about your video project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Duration:</span>
                  <Badge variant="outline">{projectStats.duration}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Resolution:</span>
                  <Badge variant="outline">{projectStats.resolution}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">File Size:</span>
                  <Badge variant="outline">{projectStats.size}</Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Format:</span>
                  <Badge variant="outline">{projectStats.format}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Created:</span>
                  <Badge variant="outline">{projectStats.created}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Voice:</span>
                  <Badge variant="outline">{project.voiceGender} • Indian</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Download Resources */}
        <Card className="shadow-card bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-primary" />
              Download Resources
            </CardTitle>
            <CardDescription>
              Download individual components used in your video
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleDownload('video')}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Video className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Final Video</p>
                    <p className="text-sm text-muted-foreground">MP4 • {projectStats.size}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleDownload('image')}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-video-secondary/10 rounded-lg flex items-center justify-center">
                    <Image className="w-5 h-5 text-video-secondary" />
                  </div>
                  <div>
                    <p className="font-medium">Background Image</p>
                    <p className="text-sm text-muted-foreground">PNG • 1920x1080</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleDownload('audio')}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-video-success/10 rounded-lg flex items-center justify-center">
                    <Mic className="w-5 h-5 text-video-success" />
                  </div>
                  <div>
                    <p className="font-medium">Audio Track</p>
                    <p className="text-sm text-muted-foreground">MP3 • {project.voiceGender}</p>
                  </div>
                </div>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
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
            onClick={handleCreateNew}
            size="lg"
            variant="hero"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Create New Video
          </Button>
        </div>
      </div>
    </div>
  );
};