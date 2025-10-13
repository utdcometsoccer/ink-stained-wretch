import { CircularProgress } from '@mui/material';
import { useRef, useState } from 'react';
import { useImageManager } from '../../hooks/useImageManager';
import { useLocalizationContext } from '../../hooks/useLocalizationContext.ts';
import { useTrackComponent } from '../../hooks/useTrackComponent.ts';
import { useCultureInfo } from '../../contexts/CultureInfoContext';
import type { ManagedImage } from '../../types/ManagedImage';
import './ImageManager.css';
import type { ImageManagerProps } from './ImageManagerProps.tsx';

export const ImageManager = ({ token, onSelect, listUserImages, deleteImage, uploadImage }: ImageManagerProps) => {
  const { culture } = useCultureInfo();
  useTrackComponent('ImageManager', { token, onSelect, listUserImages, deleteImage, uploadImage, culture });
  const localized = useLocalizationContext().ImageManager;
  const { state, fetchImages, handleDelete, handleUpload } = useImageManager({ token, listUserImages, deleteImage, uploadImage });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    Array.from(files).forEach(async (file) => {
      if (!file.type.startsWith('image/')) {
        setUploadStatus(`Invalid file type: ${file.name}`);
        return;
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setUploadStatus(`File too large: ${file.name}`);
        return;
      }

      try {
        setUploadStatus(localized.uploading);
        await handleUpload(file);
        setUploadStatus(localized.uploadSuccess);
        setTimeout(() => setUploadStatus(null), 3000);
      } catch (error) {
        setUploadStatus(`Upload failed: ${file.name}`);
        setTimeout(() => setUploadStatus(null), 5000);
      }
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  return (
    <div>
      <h2>{localized?.title}</h2>
      
      {/* Upload Area */}
      <div className="image-manager-upload-controls">
        <h3>{localized.uploadTitle}</h3>
        <div 
          className={`image-manager-upload-area ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
        >
          <div className="image-manager-upload-text">
            {localized.uploadText}
          </div>
          <button 
            type="button"
            className="image-manager-upload-btn"
            disabled={state.loading}
          >
            {localized.uploadButton}
          </button>
          <div className="image-manager-supported-formats">
            {localized.supportedFormats}
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="image-manager-file-input"
          onChange={handleFileInputChange}
          aria-label={localized.uploadButton}
          title={localized.uploadButton}
        />
      </div>

      {/* Status Messages */}
      {uploadStatus && (
        <div className={`image-manager-upload-status ${uploadStatus.includes('failed') || uploadStatus.includes('Invalid') || uploadStatus.includes('too large') ? 'error' : 'success'}`}>
          {uploadStatus}
        </div>
      )}

      {/* Loading and Error States */}
      {state.loading && <div><CircularProgress /> {localized.loading}</div>}
      {state.error && <div className="image-manager-error">{state.error}</div>}

      {/* Images List */}
      <ul className="image-manager-list">
        {state.images.map((img: ManagedImage) => (
          <li key={img.id} className="image-manager-item">
            <img src={img.url} alt={img.name} className="image-manager-img" />
            <span className="image-manager-name">{img.name} ({(img.size / 1024).toFixed(1)} KB)</span>
            <button className="image-manager-select-btn" onClick={() => onSelect(img)}>{localized.select}</button>
            <button className="image-manager-delete-btn" onClick={() => handleDelete(img.id)}>{localized.delete}</button>
          </li>
        ))}
      </ul>
      
      <button className="image-manager-refresh-btn" onClick={fetchImages}>{localized.refresh}</button>
    </div>
  );
}
