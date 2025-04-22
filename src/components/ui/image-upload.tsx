
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ImageEditor } from '@/components/ui/image-editor';
import { Camera, Upload, Trash2, Loader2, Edit } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card } from '@/components/ui/card';

interface ImageUploadProps {
  currentImage?: string | null;
  onImageUpdate: (imageBlob: Blob) => void;
  aspectRatio?: number;
  className?: string;
  maxSize?: number; // in MB
  label?: string;
  height?: number;
}

export function ImageUpload({
  currentImage,
  onImageUpdate,
  aspectRatio = 1,
  className = '',
  maxSize = 5, // Default 5MB
  label = 'Hình ảnh',
  height = 250,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        alert(`Kích thước file quá lớn. Tối đa ${maxSize}MB.`);
        return;
      }
      
      const fileUrl = URL.createObjectURL(file);
      setSelectedFile(fileUrl);
      setShowEditor(true);
    }
  };

  const handleSaveImage = (editedImage: Blob) => {
    setIsUploading(true);
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(editedImage);
    setPreview(previewUrl);
    
    // Pass the blob to parent component
    onImageUpdate(editedImage);
    
    // Cleanup
    setShowEditor(false);
    setSelectedFile(null);
    setIsUploading(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCancel = () => {
    setShowEditor(false);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleEditImage = () => {
    if (preview) {
      setSelectedFile(preview);
      setShowEditor(true);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle drag and drop
  React.useEffect(() => {
    const dropArea = dropAreaRef.current;
    if (!dropArea) return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dropArea.classList.add('border-primary');
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dropArea.classList.remove('border-primary');
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dropArea.classList.remove('border-primary');
      
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        
        // Check if file is an image
        if (!file.type.startsWith('image/')) {
          alert('Vui lòng chỉ kéo thả file hình ảnh.');
          return;
        }
        
        // Check file size
        if (file.size > maxSize * 1024 * 1024) {
          alert(`Kích thước file quá lớn. Tối đa ${maxSize}MB.`);
          return;
        }
        
        const fileUrl = URL.createObjectURL(file);
        setSelectedFile(fileUrl);
        setShowEditor(true);
      }
    };

    dropArea.addEventListener('dragover', handleDragOver);
    dropArea.addEventListener('dragleave', handleDragLeave);
    dropArea.addEventListener('drop', handleDrop);

    return () => {
      dropArea.removeEventListener('dragover', handleDragOver);
      dropArea.removeEventListener('dragleave', handleDragLeave);
      dropArea.removeEventListener('drop', handleDrop);
    };
  }, [maxSize]);

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      <Card 
        ref={dropAreaRef}
        className="relative border-dashed border-2 hover:border-primary/50 transition-colors"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        
        {preview ? (
          <div className="relative">
            <AspectRatio ratio={aspectRatio} className="bg-muted">
              <img 
                src={preview} 
                alt="Preview" 
                className="object-contain w-full h-full rounded-md"
                style={{ maxHeight: `${height}px` }}
              />
            </AspectRatio>
            
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-background/80 transition-opacity">
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="secondary" 
                  onClick={handleEditImage}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Chỉnh sửa
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={handleRemoveImage}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Xóa
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div 
            className="flex flex-col items-center justify-center p-6 cursor-pointer"
            onClick={triggerFileInput}
            style={{ minHeight: `${height}px` }}
          >
            <div className="bg-muted p-4 rounded-full mb-3">
              <Camera className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              Nhấp để tải lên hoặc kéo thả hình ảnh vào đây
            </p>
            <p className="text-xs text-muted-foreground">
              Hỗ trợ định dạng JPG, PNG, GIF (Tối đa {maxSize}MB)
            </p>
          </div>
        )}
      </Card>
      
      {/* Image editor dialog */}
      <ImageEditor 
        image={selectedFile}
        aspectRatio={aspectRatio}
        onSave={handleSaveImage}
        onCancel={handleCancel}
        open={showEditor}
      />
    </div>
  );
}
