import React, { useState, useEffect } from 'react';
import { useStaff } from '@/hooks/use-staff';
import { 
  StaffSchedule, 
  CreateScheduleParams, 
  UpdateScheduleParams,
  CreateMultipleScheduleParams 
} from '@/api/services/staffService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Pencil, Trash2, AlertTriangle, Loader2 } from 'lucide-react';

// Day of week constants
const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

const DAYS_OF_WEEK_VI = {
  'Monday': 'Thứ 2',
  'Tuesday': 'Thứ 3',
  'Wednesday': 'Thứ 4',
  'Thursday': 'Thứ 5',
  'Friday': 'Thứ 6',
  'Saturday': 'Thứ 7',
  'Sunday': 'Chủ nhật',
};

// Form schemas
const singleDayScheduleSchema = z.object({
  dayOfWeek: z.enum(DAYS_OF_WEEK),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Định dạng thời gian không hợp lệ (HH:MM)'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Định dạng thời gian không hợp lệ (HH:MM)'),
  isDayOff: z.boolean().default(false),
});

const multipleDayScheduleSchema = z.object({
  startDay: z.enum(DAYS_OF_WEEK),
  endDay: z.enum(DAYS_OF_WEEK),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Định dạng thời gian không hợp lệ (HH:MM)'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Định dạng thời gian không hợp lệ (HH:MM)'),
  isDayOff: z.boolean().default(false),
});

type SingleDayFormValues = z.infer<typeof singleDayScheduleSchema>;
type MultipleDayFormValues = z.infer<typeof multipleDayScheduleSchema>;

interface StaffScheduleManagerProps {
  staffId: number;
}

const StaffScheduleManager = ({ staffId }: StaffScheduleManagerProps) => {
  const { 
    getStaffSchedule,
    createSchedule,
    createMultipleSchedules,
    updateSchedule,
    deleteSchedule,
    isCreatingSchedule,
    isCreatingMultipleSchedules,
    isUpdatingSchedule,
    isDeletingSchedule
  } = useStaff();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<StaffSchedule | null>(null);
  const [activeTab, setActiveTab] = useState<"single" | "multiple">("single");

  // Fetch staff schedule
  const { 
    data: schedules = [], 
    isLoading,
    refetch: refetchSchedules
  } = getStaffSchedule(staffId);

  // Single day form setup
  const singleDayForm = useForm<SingleDayFormValues>({
    resolver: zodResolver(singleDayScheduleSchema),
    defaultValues: {
      dayOfWeek: 'Monday',
      startTime: '09:00',
      endTime: '17:00',
      isDayOff: false,
    },
  });

  // Multiple day form setup
  const multipleDayForm = useForm<MultipleDayFormValues>({
    resolver: zodResolver(multipleDayScheduleSchema),
    defaultValues: {
      startDay: 'Monday',
      endDay: 'Friday',
      startTime: '09:00',
      endTime: '17:00',
      isDayOff: false,
    },
  });

  // Reset form when selectedSchedule changes
  useEffect(() => {
    if (selectedSchedule) {
      singleDayForm.reset({
        dayOfWeek: selectedSchedule.dayOfWeek,
        startTime: selectedSchedule.startTime.substring(0, 5),
        endTime: selectedSchedule.endTime.substring(0, 5),
        isDayOff: selectedSchedule.isDayOff,
      });
    } else {
      singleDayForm.reset({
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '17:00',
        isDayOff: false,
      });
      
      multipleDayForm.reset({
        startDay: 'Monday',
        endDay: 'Friday',
        startTime: '09:00',
        endTime: '17:00',
        isDayOff: false,
      });
    }
  }, [selectedSchedule, singleDayForm, multipleDayForm]);

  // Handle single day form submission
  const onSubmitSingleDay = (data: SingleDayFormValues) => {
    if (selectedSchedule) {
      // Update existing schedule
      const scheduleUpdate: UpdateScheduleParams = {
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
        isDayOff: data.isDayOff
      };
      updateSchedule(selectedSchedule.id, scheduleUpdate);
      setSelectedSchedule(null);
    } else {
      // Create new schedule
      const newSchedule: CreateScheduleParams = {
        staffId,
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
        isDayOff: data.isDayOff
      };
      createSchedule(newSchedule);
      setIsAddDialogOpen(false);
    }
  };

  // Handle multiple day form submission
  const onSubmitMultipleDay = (data: MultipleDayFormValues) => {
    const multipleSchedule: CreateMultipleScheduleParams = {
      staffId,
      startDay: data.startDay,
      endDay: data.endDay,
      startTime: data.startTime,
      endTime: data.endTime,
      isDayOff: data.isDayOff
    };
    createMultipleSchedules(multipleSchedule);
    setIsAddDialogOpen(false);
  };

  // Handle delete schedule
  const handleDeleteSchedule = (scheduleId: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa lịch làm việc này?')) {
      deleteSchedule(scheduleId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Lịch làm việc hàng tuần</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Thêm lịch mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Thêm lịch làm việc mới</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="single" value={activeTab} onValueChange={(value) => setActiveTab(value as "single" | "multiple")}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="single">Một ngày</TabsTrigger>
                <TabsTrigger value="multiple">Nhiều ngày</TabsTrigger>
              </TabsList>
              
              <TabsContent value="single">
                <SingleDayScheduleForm 
                  form={singleDayForm} 
                  onSubmit={onSubmitSingleDay}
                  isSubmitting={isCreatingSchedule}
                  onCancel={() => setIsAddDialogOpen(false)}
                />
              </TabsContent>
              
              <TabsContent value="multiple">
                <MultipleDayScheduleForm 
                  form={multipleDayForm} 
                  onSubmit={onSubmitMultipleDay}
                  isSubmitting={isCreatingMultipleSchedules}
                  onCancel={() => setIsAddDialogOpen(false)}
                />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-6 flex justify-center items-center h-48">
            <p className="text-muted-foreground">Đang tải lịch làm việc...</p>
          </CardContent>
        </Card>
      ) : schedules.length === 0 ? (
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center py-16">
            <AlertTriangle className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Chưa có lịch làm việc</h3>
            <p className="text-muted-foreground text-center mt-2">
              Nhân viên này chưa có lịch làm việc. Hãy thêm lịch làm việc mới.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Thời gian bắt đầu</TableHead>
                  <TableHead>Thời gian kết thúc</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules
                  .sort((a, b) => {
                    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                    return days.indexOf(a.dayOfWeek) - days.indexOf(b.dayOfWeek);
                  })
                  .map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell>{DAYS_OF_WEEK_VI[schedule.dayOfWeek]}</TableCell>
                    <TableCell>{schedule.isDayOff ? '-' : schedule.startTime.substring(0, 5)}</TableCell>
                    <TableCell>{schedule.isDayOff ? '-' : schedule.endTime.substring(0, 5)}</TableCell>
                    <TableCell>
                      {schedule.isDayOff ? (
                        <span className="rounded-full px-2 py-1 text-xs bg-red-100 text-red-800">
                          Nghỉ
                        </span>
                      ) : (
                        <span className="rounded-full px-2 py-1 text-xs bg-green-100 text-green-800">
                          Làm việc
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog 
                          open={selectedSchedule?.id === schedule.id} 
                          onOpenChange={(open) => !open && setSelectedSchedule(null)}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setSelectedSchedule(schedule)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Chỉnh sửa lịch làm việc</DialogTitle>
                            </DialogHeader>
                            <SingleDayScheduleForm 
                              form={singleDayForm} 
                              onSubmit={onSubmitSingleDay}
                              isSubmitting={isUpdatingSchedule}
                              onCancel={() => setSelectedSchedule(null)}
                              isEdit
                            />
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteSchedule(schedule.id)}
                          disabled={isDeletingSchedule}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

interface ScheduleFormProps {
  form: any;
  onSubmit: any;
  isSubmitting: boolean;
  onCancel: () => void;
  isEdit?: boolean;
}

const SingleDayScheduleForm = ({ form, onSubmit, isSubmitting, onCancel, isEdit = false }: ScheduleFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="dayOfWeek"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày trong tuần</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn ngày" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {DAYS_OF_WEEK.map((day) => (
                    <SelectItem key={day} value={day}>
                      {DAYS_OF_WEEK_VI[day]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isDayOff"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Ngày nghỉ</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Đây là ngày nghỉ của nhân viên.
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {!form.watch('isDayOff') && (
          <>
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thời gian bắt đầu</FormLabel>
                  <FormControl>
                    <Input {...field} type="time" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thời gian kết thúc</FormLabel>
                  <FormControl>
                    <Input {...field} type="time" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? 'Cập nhật' : 'Thêm lịch'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

const MultipleDayScheduleForm = ({ form, onSubmit, isSubmitting, onCancel }: ScheduleFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Từ ngày</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn ngày bắt đầu" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((day) => (
                      <SelectItem key={`start-${day}`} value={day}>
                        {DAYS_OF_WEEK_VI[day]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Đến ngày</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn ngày kết thúc" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((day) => (
                      <SelectItem key={`end-${day}`} value={day}>
                        {DAYS_OF_WEEK_VI[day]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isDayOff"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Ngày nghỉ</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Đây là những ngày nghỉ của nhân viên.
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {!form.watch('isDayOff') && (
          <>
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thời gian bắt đầu</FormLabel>
                  <FormControl>
                    <Input {...field} type="time" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thời gian kết thúc</FormLabel>
                  <FormControl>
                    <Input {...field} type="time" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Thêm lịch
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default StaffScheduleManager;
