
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { bookingService } from '@/api/services/bookingService';
import { format } from 'date-fns';

interface EditBookingDetailDialogProps {
  detailId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  initialData?: {
    startTime: string;
    endTime: string;
  };
}

const EditBookingDetailDialog: React.FC<EditBookingDetailDialogProps> = ({
  detailId,
  open,
  onOpenChange,
  onSuccess,
  initialData
}) => {
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<{ startTime: string; endTime: string; }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (open && detailId) {
      // Reset selected slot when dialog opens
      setSelectedSlot('');
      fetchAvailableSlots();
    }
  }, [open, detailId]);

  const fetchAvailableSlots = async () => {
    try {
      const slots = await bookingService.getAvailableTimeSlots(0, format(new Date(), 'yyyy-MM-dd'));
      if (slots && slots.length > 0) {
        const flatSlots = slots.flatMap(staff => staff.slots);
        setAvailableSlots(flatSlots);
      }
    } catch (error) {
      console.error('Error fetching time slots:', error);
      // toast.error('Không thể tải danh sách thời gian trống');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!detailId || !selectedSlot) {
      // toast.error('Vui lòng chọn thời gian');
      return;
    }
    
    const [startTime, endTime] = selectedSlot.split('-');
    
    setIsLoading(true);
    
    try {
      await bookingService.updateBookingDetail2(detailId, {
        startTime,
        endTime
      });
      
      // toast.success('Cập nhật thành công');
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating booking detail:', error);
      // toast.error('Không thể cập nhật. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeDisplay = (time: string) => {
    const date = new Date(`1970-01-01T${time}`);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thông tin dịch vụ</DialogTitle>
          <DialogDescription>
            Thay đổi thời gian bắt đầu và kết thúc cho dịch vụ này.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="timeSlot">Chọn thời gian</Label>
              <Select
                value={selectedSlot}
                onValueChange={setSelectedSlot}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thời gian" />
                </SelectTrigger>
                <SelectContent>
                  {availableSlots.map((slot, index) => (
                    <SelectItem 
                      key={index} 
                      value={`${slot.startTime}-${slot.endTime}`}
                    >
                      {formatTimeDisplay(slot.startTime)} - {formatTimeDisplay(slot.endTime)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBookingDetailDialog;
