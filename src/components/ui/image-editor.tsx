
import React, { useState, useRef } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { AspectRatio } from "@/components/ui/aspect-ratio"; 
import { ZoomIn, ZoomOut, Crop, Save, RotateCw, X } from 'lucide-react';
import ReactCrop, { type Crop as ReactCropType } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageEditorProps {
  image: string | null;
  aspectRatio?: number;
  onSave: (editedImage: Blob) => void;
  onCancel: () => void;
  open: boolean;
}

export function ImageEditor({ 
  image, 
  aspectRatio = 1, 
  onSave, 
  onCancel,
  open
}: ImageEditorProps) {
  const [crop, setCrop] = useState<ReactCropType>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5
  });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [completedCrop, setCompletedCrop] = useState<ReactCropType | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Function to handle zoom in
  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.1, 3));
  };

  // Function to handle zoom out
  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.1, 0.5));
  };

  // Function to handle rotation
  const handleRotate = () => {
    setRotation((rotation + 90) % 360);
  };

  // Function to handle crop completion
  const handleCropComplete = (crop: ReactCropType) => {
    setCompletedCrop(crop);
  };

  // Function to save the edited image
  const handleSave = () => {
    if (imgRef.current && completedCrop && canvasRef.current) {
      const canvas = canvasRef.current;
      const image = imgRef.current;
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        return;
      }

      // Set canvas dimensions to the cropped area
      canvas.width = completedCrop.width * scaleX;
      canvas.height = completedCrop.height * scaleY;

      // Apply rotation if needed
      if (rotation > 0) {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
      }

      // Draw the image with crop applied
      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY
      );

      if (rotation > 0) {
        ctx.restore();
      }

      // Convert canvas to blob and save
      canvas.toBlob((blob) => {
        if (blob) {
          onSave(blob);
        }
      }, 'image/jpeg', 0.95);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa hình ảnh</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          {/* Image editor controls */}
          <div className="flex justify-center gap-2 mb-3">
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4 mr-1" />
              Thu nhỏ
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4 mr-1" />
              Phóng to
            </Button>
            <Button variant="outline" size="sm" onClick={handleRotate}>
              <RotateCw className="h-4 w-4 mr-1" />
              Xoay
            </Button>
          </div>
          
          {/* Zoom slider */}
          <div className="flex items-center gap-4 px-4">
            <ZoomOut className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={[zoom * 100]}
              min={50}
              max={300}
              step={5}
              onValueChange={(value) => setZoom(value[0] / 100)}
            />
            <ZoomIn className="h-4 w-4 text-muted-foreground" />
          </div>
          
          {/* Image crop component */}
          <div className="relative overflow-hidden border rounded-md">
            <div
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'center',
              }}
              className="transition-transform duration-200"
            >
              {image && (
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={handleCropComplete}
                  aspect={aspectRatio}
                >
                  <img
                    ref={imgRef}
                    src={image}
                    alt="Preview"
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      maxWidth: '100%',
                      maxHeight: '500px',
                    }}
                    className="mx-auto"
                  />
                </ReactCrop>
              )}
            </div>
          </div>
          
          {/* Hidden canvas for saving the cropped image */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-1" />
            Hủy
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" />
            Lưu ảnh
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
