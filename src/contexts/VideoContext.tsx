import React, { createContext, useContext, useState, ReactNode } from 'react';
import { VideoProject, APIKeys, ProcessingStep } from '@/types/video';

interface VideoContextType {
  project: VideoProject;
  setProject: React.Dispatch<React.SetStateAction<VideoProject>>;
  apiKeys: APIKeys;
  setApiKeys: React.Dispatch<React.SetStateAction<APIKeys>>;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  processingSteps: ProcessingStep[];
  setProcessingSteps: React.Dispatch<React.SetStateAction<ProcessingStep[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};

interface VideoProviderProps {
  children: ReactNode;
}

export const VideoProvider: React.FC<VideoProviderProps> = ({ children }) => {
  const [project, setProject] = useState<VideoProject>({
    id: crypto.randomUUID(),
    text: '',
    voiceGender: 'female',
    voiceLanguage: 'en-IN',
    status: 'text-input',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const [apiKeys, setApiKeys] = useState<APIKeys>({
    gemini: [],
    openai: [],
    json2video: [],
    googleTTS: [],
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([
    {
      id: 'text-analysis',
      title: 'Text Analysis',
      description: 'Analyzing your text with Gemini API',
      status: 'pending',
      progress: 0,
    },
    {
      id: 'voice-generation',
      title: 'Voice Generation',
      description: 'Creating natural-sounding voiceover',
      status: 'pending',
      progress: 0,
    },
    {
      id: 'image-generation',
      title: 'Image Creation',
      description: 'Generating background visuals',
      status: 'pending',
      progress: 0,
    },
    {
      id: 'music-processing',
      title: 'Music Processing',
      description: 'Processing background music',
      status: 'pending',
      progress: 0,
    },
    {
      id: 'video-compilation',
      title: 'Video Compilation',
      description: 'Creating your final video',
      status: 'pending',
      progress: 0,
    },
  ]);

  const value = {
    project,
    setProject,
    apiKeys,
    setApiKeys,
    currentStep,
    setCurrentStep,
    processingSteps,
    setProcessingSteps,
    isLoading,
    setIsLoading,
  };

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
};