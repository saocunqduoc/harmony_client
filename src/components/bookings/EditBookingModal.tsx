import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { bookingService } from '@/api/services/bookingService';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import TimeSlotSelector from '../services/TimeSlotSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

import { isBefore, startOfDay } from 'date-fns';

interface BookingDetailData {
  id: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  staffId: number | null;
  serviceId: number;
}

interface EditBookingModalProps {
  bookingDetailId: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const EditBookingModal = ({ bookingDetailId, isOpen, onClose, onSave }: EditBookingModalProps) => {
  // Sửa lại phần query và useEffect
  const { data: bookingDetailResponse, isLoading: isLoadingDetail } = useQuery({
    queryKey: ['bookingDetail', bookingDetailId],
    queryFn: async () => {
      const response = await bookingService.getBookingDetail2(bookingDetailId);
      if (!response) {
        throw new Error('Không tìm thấy thông tin đặt lịch');
      }
      return response;
    },
    enabled: !!bookingDetailId
  });

  const bookingDetail = bookingDetailResponse;

  const [activeTab, setActiveTab] = useState('date');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{startTime: string, endTime: string} | null>(null);

  // Set initial values when bookingDetail is loaded
  React.useEffect(() => {
    if (bookingDetail) {
      setSelectedDate(new Date(bookingDetail.bookingDate));
      setSelectedStaffId(bookingDetail.staffId);
      setSelectedTimeSlot({
        startTime: bookingDetail.startTime,
        endTime: bookingDetail.endTime
      });
    }
  }, [bookingDetail]);

  const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';

  // Sửa lại query timeSlots
  const { data: timeSlots, isLoading: isLoadingSlots } = useQuery({
    queryKey: ['timeSlots', bookingDetail?.serviceId, formattedDate],
    queryFn: async () => {
      const slots = await bookingService.getAvailableTimeSlots(
        bookingDetail?.serviceId || 0, 
        formattedDate
      );
      return slots || [];
    },
    enabled: !!formattedDate && !!bookingDetail?.serviceId
  });

  // Sửa lại hàm handleDateChange để validate ngày
  const handleDateChange = (date: Date | undefined) => {
    if (date && isBefore(startOfDay(date), startOfDay(new Date()))) {
      toast.error('Không thể chọn ngày trong quá khứ');
      return;
    }
    
    setSelectedDate(date);
    setSelectedTimeSlot(null);
    setSelectedStaffId(null);
    if (date) {
      setActiveTab('staff');
    }
  };

  const handleStaffSelect = (staffId: any) => {
    const parsedStaffId = staffId === "any" ? 0 : parseInt(staffId);
    setSelectedStaffId(parsedStaffId);
    setActiveTab('time');
  };

  const handleTimeSlotSelect = (staffId: number, timeSlot: {startTime: string, endTime: string}) => {
    setSelectedStaffId(staffId);
    setSelectedTimeSlot(timeSlot);
  };

  // Sửa lại handleSave
  const handleSave = async () => {
    if (!selectedDate || !selectedTimeSlot || !bookingDetail) {
      toast.error('Vui lòng chọn đầy đủ thông tin');
      return;
    }

    try {
      await bookingService.updateBookingDetail2(bookingDetailId, {
        serviceId: bookingDetail.serviceId,
        staffId: selectedStaffId || undefined,
        startTime: selectedTimeSlot.startTime,
        endTime: selectedTimeSlot.endTime
      });

      toast.success('Cập nhật đặt lịch thành công');
      onSave();
      onClose();
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Không thể cập nhật đặt lịch');
    }
  };

  if (isLoadingDetail) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin đặt lịch</DialogTitle>
            <DialogDescription>
              Đang tải thông tin...
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center items-center h-40">
            Đang tải thông tin...
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!bookingDetail) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thông tin đặt lịch</DialogTitle>
          <DialogDescription>
            Thay đổi ngày, giờ và nhân viên cho lịch đặt này
          </DialogDescription>
        </DialogHeader>

        {/* Hiển thị thông tin hiện tại khi có dữ liệu */}
        {bookingDetail && (
          <Card className="mb-4">
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    <span>Ngày hiện tại: {format(new Date(bookingDetail.bookingDate), 'dd/MM/yyyy')}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>
                      Thời gian hiện tại: {format(new Date(`2000-01-01T${bookingDetail.startTime}`), 'HH:mm')} - 
                      {format(new Date(`2000-01-01T${bookingDetail.endTime}`), 'HH:mm')}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="date">Chọn ngày</TabsTrigger>
            <TabsTrigger value="staff" disabled={!selectedDate}>Chọn nhân viên</TabsTrigger>
            <TabsTrigger value="time" disabled={!selectedDate || !selectedStaffId}>Chọn giờ</TabsTrigger>
          </TabsList>
          
          <TabsContent value="date" className="space-y-4">
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateChange}
                className="rounded-md border"
                disabled={(date) => isBefore(startOfDay(date), startOfDay(new Date()))}
                fromDate={new Date()} // Chỉ cho phép chọn từ ngày hiện tại
              />
            </div>
          </TabsContent>

          <TabsContent value="staff" className="space-y-4">
            <div className="space-y-4 py-4">
              <label className="text-sm font-medium">Chọn nhân viên phục vụ:</label>
              <Select onValueChange={handleStaffSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn nhân viên" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Tùy chọn (Bất kỳ nhân viên)</SelectItem>
                  {(!isLoadingSlots && timeSlots) && timeSlots.map(staff => (
                    <SelectItem key={staff.staffId} value={staff.staffId.toString()}>
                      {staff.staffName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="time" className="space-y-4">
            {selectedDate && !isLoadingSlots && timeSlots && (
              <TimeSlotSelector 
                timeSlots={timeSlots}
                onTimeSlotSelect={handleTimeSlotSelect}
                selectedTimeSlot={selectedTimeSlot}
                selectedStaffId={selectedStaffId}
                onStaffSelect={handleStaffSelect}
                selectedDate={selectedDate} // Thêm prop này
              />
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button 
            onClick={handleSave} 
            disabled={!selectedDate || !selectedTimeSlot}
          >
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditBookingModal;