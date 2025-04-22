
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Trash2, Loader2, Edit } from 'lucide-react';
import { ImageEditor } from '@/components/ui/image-editor';
import { authService } from '@/api/services/authService';
import { toast } from 'sonner';

interface AvatarUploadProps {
  currentAvatar?: string;
  fullName: string;
  onAvatarUpdate: (newAvatarUrl: string) => void;
}

const AvatarUpload = ({ currentAvatar, fullName, onAvatarUpdate }: AvatarUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileUrl = URL.createObjectURL(file);
      setSelectedFile(fileUrl);
      setShowEditor(true);
    }
  };

  const handleUpload = async (editedImage: Blob) => {
    try {
      setIsUploading(true);
      
      // Convert Blob to File
      const fileName = 'profile-picture.jpg';
      const fileType = 'image/jpeg';
      const file = new File([editedImage], fileName, { type: fileType });
      
      const result = await authService.uploadProfilePicture(file);
      
      // Update avatar URL
      if (result.avatar) {
        onAvatarUpdate(result.avatar);
        toast.success('Cập nhật ảnh đại diện thành công');
      }
      
      // Reset preview and file input
      setPreview(null);
      setShowEditor(false);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      toast.error('Cập nhật ảnh đại diện thất bại');
    } finally {
      setIsUploading(false);
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
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleEditCurrent = () => {
    if (currentAvatar) {
      setSelectedFile(currentAvatar);
      setShowEditor(true);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative group">
        <Avatar className="w-32 h-32 border-2 border-primary/20">
          {currentAvatar ? (
            <AvatarImage src={currentAvatar} alt={fullName} />
          ) : (
            <AvatarFallback className="text-4xl bg-primary/10">
              {fullName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        
        <div className="absolute -bottom-2 -right-2 flex space-x-1">
          <button 
            onClick={triggerFileInput}
            className="bg-primary text-primary-foreground p-2 rounded-full shadow-sm"
            type="button"
            disabled={isUploading}
          >
            <Camera className="h-4 w-4" />
          </button>
          
          {currentAvatar && (
            <button 
              onClick={handleEditCurrent}
              className="bg-secondary text-secondary-foreground p-2 rounded-full shadow-sm"
              type="button"
              disabled={isUploading}
            >
              <Edit className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {isUploading && (
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Đang tải...</span>
        </div>
      )}

      {/* Image editor dialog */}
      <ImageEditor 
        image={selectedFile}
        aspectRatio={1}
        onSave={handleUpload}
        onCancel={handleCancel}
        open={showEditor}
      />
    </div>
  );
};

export default AvatarUpload;
