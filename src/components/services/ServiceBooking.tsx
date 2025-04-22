
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { bookingService } from '@/api/services/bookingService';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import TimeSlotSelector from './TimeSlotSelector';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useApiAuth } from '@/context/ApiAuthContext';

interface ServiceBookingProps {
  serviceId: number;
  serviceName: string;
  price: number;  
  duration: number;
  businessId: number;
}

const ServiceBooking: React.FC<ServiceBookingProps> = ({ 
  serviceId, 
  serviceName, 
  price, 
  duration,
  businessId 
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{startTime: string, endTime: string} | null>(null);
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [activeTab, setActiveTab] = useState<string>("staff");
  const { isAuthenticated } = useApiAuth();
  const navigate = useNavigate();

  console.log('ServiceBooking props:', { 
    serviceId, 
    businessId, 
    duration, 
    price,
    serviceIdType: typeof serviceId,
    businessIdType: typeof businessId
  });

  const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';

  // Make sure we have a valid serviceId to pass to the API
  const effectiveServiceId = typeof serviceId === 'string' ? parseInt(serviceId as string, 10) : serviceId;

  const { data: timeSlots, isLoading, error, refetch } = useQuery({
    queryKey: ['timeSlots', effectiveServiceId, formattedDate],
    queryFn: () => bookingService.getAvailableTimeSlots(effectiveServiceId, formattedDate),
    enabled: !!formattedDate && !!effectiveServiceId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
    meta: {
      onError: (error: any) => {
        console.error('Error fetching time slots:', error);
        if (error?.response?.data?.message === "Doanh nghiệp không hoạt động trong ngày này" ||
            error?.message === "Doanh nghiệp không hoạt động trong ngày này") {
          if (selectedDate) {
            setUnavailableDates(prev => [...prev, new Date(selectedDate)]);
          }
        }
      }
    }
  });

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      if (!selectedDate || format(date, 'yyyy-MM-dd') !== format(selectedDate, 'yyyy-MM-dd')) {
        setSelectedDate(date);
        setSelectedTimeSlot(null);
      }
    }
  };

  const handleTimeSlotSelect = (staffId: number, timeSlot: {startTime: string, endTime: string}) => {
    setSelectedStaffId(staffId);
    setSelectedTimeSlot(timeSlot);
  };

  const handleStaffSelect = (staffId: string) => {
    if (staffId === "any") {
      setSelectedStaffId(0);
    } else {
      setSelectedStaffId(parseInt(staffId));
    }
    setActiveTab("date");
  };

  const staffList = timeSlots || [];

  const handleBookNow = async () => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để đặt dịch vụ này', {
        description: 'Bạn cần đăng nhập để thực hiện đặt lịch.'
      });
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    if (!selectedDate || !selectedTimeSlot) {
      toast.error('Vui lòng chọn ngày và thời gian');
      return;
    }

    try {
      const effectiveStaffId = selectedStaffId === 0 && staffList.length > 0 
        ? staffList[0].staffId 
        : selectedStaffId;

      // Ensure businessId is a number
      const numericBusinessId = typeof businessId === 'string' ? parseInt(businessId as string, 10) : businessId;

      const bookingData = {
        businessId: numericBusinessId,
        serviceId: effectiveServiceId,
        startTime: selectedTimeSlot.startTime,
        endTime: selectedTimeSlot.endTime,
        bookingDate: formattedDate,
        staffId: effectiveStaffId,
      };

      console.log("Booking data:", bookingData);

      const response = await bookingService.addServiceToDraft(bookingData);
      
      toast.success('Dịch vụ đã được thêm vào đặt lịch', {
        description: 'Bạn có thể xem chi tiết đặt lịch trong trang cá nhân.'
      });
      
      navigate('/user/bookings');
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Không thể đặt dịch vụ', {
        description: 'Vui lòng thử lại hoặc liên hệ hỗ trợ.'
      });
    }
  };

  const hasAvailableSlots = timeSlots && timeSlots.length > 0 && 
    timeSlots.some(staff => staff.slots && staff.slots.length > 0);

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle>Đặt lịch dịch vụ này</CardTitle>
        <CardDescription>Chọn ngày và thời gian để đặt lịch {serviceName}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="staff">Chọn nhân viên</TabsTrigger>
            <TabsTrigger value="date" disabled={!selectedStaffId}>Chọn ngày</TabsTrigger>
            <TabsTrigger value="time" disabled={!selectedDate || !selectedStaffId}>Chọn giờ</TabsTrigger>
          </TabsList>
          
          <TabsContent value="staff" className="space-y-4">
            <div className="space-y-4 py-4">
              <label className="text-sm font-medium">Chọn nhân viên phục vụ:</label>
              <Select onValueChange={handleStaffSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn nhân viên" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Tùy chọn (Bất kỳ nhân viên)</SelectItem>
                  {(!isLoading && timeSlots) && timeSlots.map(staff => (
                    <SelectItem key={staff.staffId} value={staff.staffId.toString()}>
                      {staff.staffName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {isLoading && (
                <div className="text-center p-4">
                  <p className="text-muted-foreground">Đang tải thông tin nhân viên...</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="date" className="space-y-4">
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateChange}
                className="rounded-md border"
                disabled={(date) => {
                  const now = new Date();
                  now.setHours(0, 0, 0, 0);
                  const maxDate = new Date();
                  maxDate.setDate(maxDate.getDate() + 60);
                  
                  const isUnavailable = unavailableDates.some(unavailableDate => 
                    format(unavailableDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                  );
                  
                  return date < now || date > maxDate || isUnavailable;
                }}
              />
            </div>
            
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab("time")}
                disabled={!selectedDate}
              >
                Tiếp tục
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="time" className="space-y-4">
            {selectedDate && !isLoading && !error && timeSlots && Array.isArray(timeSlots) && (
              <TimeSlotSelector 
                timeSlots={timeSlots}
                onTimeSlotSelect={handleTimeSlotSelect}
                selectedTimeSlot={selectedTimeSlot}
                selectedStaffId={selectedStaffId}
                onStaffSelect={handleStaffSelect}
              />
            )}
            
            {isLoading && (
              <div className="text-center p-4">
                <p className="text-muted-foreground">Đang tải khung giờ khả dụng...</p>
              </div>
            )}
            
            {!isLoading && error && (
              <div className="text-center p-4">
                <p className="text-red-500">Không thể tải khung giờ. Vui lòng thử lại sau.</p>
                <Button 
                  variant="outline"
                  onClick={() => refetch()}
                  className="mt-2"
                >
                  Thử lại
                </Button>
              </div>
            )}
            
            {!isLoading && !error && (!timeSlots || timeSlots.length === 0 || !hasAvailableSlots) && (
              <div className="text-center p-4">
                <p className="text-muted-foreground">Không có khung giờ khả dụng cho ngày đã chọn.</p>
                <p className="text-sm text-muted-foreground mt-1">Vui lòng chọn một ngày khác.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div>
          <span className="font-semibold">Giá:</span> {Math.round(price).toLocaleString('vi-VN')} VND
        </div>
        <Button 
          onClick={handleBookNow}
          disabled={!selectedDate || !selectedTimeSlot}
        >
          Đặt ngay
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceBooking;
