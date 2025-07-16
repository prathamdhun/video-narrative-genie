export interface VideoProject {
  id: string;
  text: string;
  voiceGender: 'male' | 'female';
  voiceLanguage: string;
  audioUrl?: string;
  imageUrl?: string;
  musicUrl?: string;
  videoUrl?: string;
  status: 'text-input' | 'processing' | 'voice-generation' | 'image-generation' | 'music-upload' | 'video-generation' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface APIKeys {
  gemini: string[];
  openai: string[];
  json2video: string[];
  googleTTS: string[];
}

export interface ProcessingStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  errorMessage?: string;
}

export interface VoiceOption {
  id: string;
  name: string;
  gender: 'male' | 'female';
  language: string;
  accent: string;
  preview?: string;
}