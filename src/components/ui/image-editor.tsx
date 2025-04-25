import React, { useState, useCallback, useRef } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ZoomIn, ZoomOut, Save, RotateCw, X, Loader2 } from 'lucide-react';
import { Area } from 'react-easy-crop/types';

// Import the following with dynamic import
// import Cropper from 'react-easy-crop';

// Lazy load the Cropper component
const CropperComponent = React.lazy(() => import('react-easy-crop').then(module => ({ 
  default: module.default 
})));

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
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  
  // Create a proxied version of the image for handling CORS
  const imageProxy = image && !image.startsWith('data:') && !image.startsWith('blob:') 
    ? `${image}${image.includes('?') ? '&' : '?'}timestamp=${new Date().getTime()}` 
    : image;

  // Called when the user has finished dragging/zooming
  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);
  
  // Function to create a canvas and draw the cropped image
  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.crossOrigin = 'anonymous';
      image.src = url;
    });

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

  // Function to get the cropped image
  const getCroppedImage = async (
    imageSrc: string,
    pixelCrop: Area,
    rotation = 0,
    flip = { horizontal: false, vertical: false }
  ): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    // Calculate the maximum size for the output image
    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

    // Set canvas dimensions to handle rotation properly
    canvas.width = safeArea;
    canvas.height = safeArea;

    // Translate canvas context to center
    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-safeArea / 2, -safeArea / 2);

    // Apply flips if needed
    const xScale = flip.horizontal ? -1 : 1;
    const yScale = flip.vertical ? -1 : 1;
    ctx.scale(xScale, yScale);

    // Draw the image in the center of the canvas
    const centerX = (safeArea - image.width) / 2;
    const centerY = (safeArea - image.height) / 2;
    
    // First clear the canvas with a transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the image
    if (flip.horizontal || flip.vertical) {
      ctx.drawImage(
        image,
        flip.horizontal ? -safeArea + centerX : centerX,
        flip.vertical ? -safeArea + centerY : centerY
      );
    } else {
      ctx.drawImage(image, centerX, centerY);
    }

    // Create a second canvas for the actual cropping
    const cropCanvas = document.createElement('canvas');
    const cropCtx = cropCanvas.getContext('2d');

    if (!cropCtx) {
      throw new Error('Could not get crop canvas context');
    }

    // Set the size of the crop canvas to the desired crop size
    cropCanvas.width = pixelCrop.width;
    cropCanvas.height = pixelCrop.height;

    // Draw the cropped area from the first canvas onto the second canvas
    cropCtx.drawImage(
      canvas,
      pixelCrop.x + (safeArea - image.width) / 2,
      pixelCrop.y + (safeArea - image.height) / 2,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    // Convert the canvas to a blob
    return new Promise<Blob>((resolve, reject) => {
      cropCanvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas is empty'));
        }
      }, 'image/jpeg', 0.95);
    });
  };

  // Handle saving the cropped image
  const handleSave = useCallback(async () => {
    if (!image || !croppedAreaPixels) return;

    try {
      setIsLoading(true);
      const croppedImage = await getCroppedImage(
        image,
        croppedAreaPixels,
        rotation
      );
      onSave(croppedImage);
    } catch (error) {
      console.error('Error cropping image:', error);
      setImageError('Có lỗi xảy ra khi xử lý ảnh. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, [croppedAreaPixels, image, onSave, rotation]);

  // Handle image load error
  const handleImageError = () => {
    setImageError('Không thể tải hình ảnh. Vui lòng thử lại hoặc chọn một ảnh khác.');
  };

  // Handle image load success
  const handleImageLoad = () => {
    setIsReady(true);
    setImageError(null);
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
            <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={!isReady || isLoading}>
              <ZoomOut className="h-4 w-4 mr-1" />
              Thu nhỏ
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={!isReady || isLoading}>
              <ZoomIn className="h-4 w-4 mr-1" />
              Phóng to
            </Button>
            <Button variant="outline" size="sm" onClick={handleRotate} disabled={!isReady || isLoading}>
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
              disabled={!isReady || isLoading}
            />
            <ZoomIn className="h-4 w-4 text-muted-foreground" />
          </div>
          
          {/* Cropper component */}
          <div className="relative w-full bg-muted rounded-md overflow-hidden" style={{ height: '400px' }}>
            {imageError ? (
              <div className="flex items-center justify-center h-full text-destructive">
                <p>{imageError}</p>
              </div>
            ) : !imageProxy ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Đang tải ảnh...</span>
              </div>
            ) : (
              <React.Suspense fallback={
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              }>
                <CropperComponent
                  image={imageProxy}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspectRatio}
                  rotation={rotation}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  onMediaLoaded={handleImageLoad}
                  onError={handleImageError}
                  objectFit="contain"
                  showGrid={true}
                  cropShape={aspectRatio === 1 ? "round" : "rect"}
                  classes={{
                    containerClassName: "rounded-md",
                    mediaClassName: "rounded-md"
                  }}
                />
              </React.Suspense>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            <X className="h-4 w-4 mr-1" />
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={!isReady || isLoading || !!imageError}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-1" />
                Lưu ảnh
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
