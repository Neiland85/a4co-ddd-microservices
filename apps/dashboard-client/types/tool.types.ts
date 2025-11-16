/**
 * User Dashboard - Tool Type Definitions
 * Free tools: video compressor, image compressor, audio extractor
 */

export type CompressionQuality = 'mobile' | 'standard' | 'minimal';

export interface VideoCompressionOptions {
  quality: CompressionQuality;
  maxSizeMB?: number;
  targetResolution?: VideoResolution;
  preserveAudio: boolean;
}

export type VideoResolution = 
  | '480p'
  | '720p'
  | '1080p'
  | '1440p'
  | '4k';

export interface CompressionProgress {
  status: CompressionStatus;
  progress: number; // 0-100
  originalSize: number;
  compressedSize?: number;
  estimatedTime?: number;
  currentStep?: string;
  error?: string;
}

export type CompressionStatus = 
  | 'idle'
  | 'uploading'
  | 'processing'
  | 'completed'
  | 'error';

export interface ImageCompressionOptions {
  quality: number; // 0-100
  maxWidth?: number;
  maxHeight?: number;
  format?: ImageFormat;
  preserveMetadata: boolean;
}

export type ImageFormat = 'jpeg' | 'png' | 'webp' | 'avif';

export interface ImageCompressionResult {
  id: string;
  originalFile: FileInfo;
  compressedFile: FileInfo;
  savings: {
    bytes: number;
    percentage: number;
  };
  downloadUrl: string;
}

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface AudioExtractionOptions {
  format: AudioFormat;
  quality: AudioQuality;
  trimStart?: number; // seconds
  trimEnd?: number; // seconds
}

export type AudioFormat = 'mp3' | 'wav' | 'ogg' | 'aac' | 'm4a';

export type AudioQuality = 
  | 'low'      // 64kbps
  | 'medium'   // 128kbps
  | 'high'     // 192kbps
  | 'ultra';   // 320kbps

export interface AudioExtractionResult {
  id: string;
  originalVideo: string;
  audioFile: FileInfo;
  duration: number;
  downloadUrl: string;
}

export interface ToolUsageStats {
  toolType: ToolType;
  usageCount: number;
  totalDataProcessed: number; // bytes
  averageProcessingTime: number; // seconds
}

export type ToolType = 
  | 'video_compressor'
  | 'image_compressor'
  | 'audio_extractor';

export interface BatchOperation {
  id: string;
  toolType: ToolType;
  files: File[];
  progress: number;
  completed: number;
  failed: number;
  results: (ImageCompressionResult | AudioExtractionResult)[];
}
