
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { StaffTimeSlot } from '@/api/services/bookingService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, parse, isBefore } from 'date-fns';

interface TimeSlotSelectorProps {
  timeSlots: StaffTimeSlot[];
  selectedStaffId: number | null;
  selectedTimeSlot: { startTime: string; endTime: string } | null;
  onTimeSlotSelect: (staffId: number, timeSlot: { startTime: string; endTime: string }) => void;
  onStaffSelect: (staffId: any) => void;
  selectedTab?: string;
  onTabChange?: (value: string) => void;
  selectedDate?: Date; // Thêm prop này
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  timeSlots,
  selectedStaffId,
  selectedTimeSlot,
  onTimeSlotSelect,
  onStaffSelect,
  selectedTab = "time",
  onTabChange = () => {},
  selectedDate,
}) => {
  // Format time và kiểm tra thời gian đã qua
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    return `${hours.padStart(2, '0')}:${minutes}`; // Hiển thị theo 24h
  };

  const isTimeSlotPassed = (slot: { startTime: string }) => {
    if (!selectedDate) return false;

    const now = new Date();
    const slotTime = parse(slot.startTime, 'HH:mm:ss', new Date());
    const slotDateTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      slotTime.getHours(),
      slotTime.getMinutes()
    );

    return isBefore(slotDateTime, now);
  };

  // Lọc các slot đã qua
  const filterAvailableSlots = (slots: { startTime: string; endTime: string }[]) => {
    return slots.filter(slot => !isTimeSlotPassed(slot));
  };

  if (!timeSlots.length) {
    return null;
  }

  // Find the staff member whose slots should be displayed
  const staff = timeSlots.find(s => selectedStaffId === s.staffId) || timeSlots[0];
  
  if (!staff || !staff.slots || staff.slots.length === 0) {
    return (
      <div className="text-center p-4">
        Không có khung giờ khả dụng cho nhân viên này vào ngày đã chọn.
      </div>
    );
  }

  const availableSlots = filterAvailableSlots(staff.slots);

  if (availableSlots.length === 0) {
    return (
      <div className="text-center p-4">
        Không còn khung giờ khả dụng cho ngày hôm nay.
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <Tabs value={selectedTab} onValueChange={onTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="staff">Chọn nhân viên</TabsTrigger>
            <TabsTrigger value="time">Chọn giờ</TabsTrigger>
          </TabsList>
          
          <TabsContent value="staff">
            {timeSlots.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Chọn nhân viên:</p>
                <Select 
                  value={selectedStaffId?.toString() || staff.staffId.toString()} 
                  onValueChange={onStaffSelect}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn nhân viên" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((staffMember) => (
                      <SelectItem key={staffMember.staffId} value={staffMember.staffId.toString()}>
                        {staffMember.staffName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="time">
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Khung giờ có sẵn với {staff.staffName}:
            </p>
            
            <ScrollArea className="h-[280px] rounded-md border p-2">
              <div className="flex flex-wrap gap-2">
                {availableSlots.map((slot, index) => (
                  <Button
                    key={`${slot.startTime}-${index}`}
                    variant={
                      selectedStaffId === staff.staffId && 
                      selectedTimeSlot?.startTime === slot.startTime
                        ? 'default'
                        : 'outline'
                    }
                    size="sm"
                    onClick={() => onTimeSlotSelect(staff.staffId, slot)}
                    disabled={isTimeSlotPassed(slot)}
                  >
                    {formatTime(slot.startTime)}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TimeSlotSelector;
