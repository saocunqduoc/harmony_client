import React, { useState, useEffect } from 'react';
import { useBusinessHours } from '@/hooks/use-business-hours';
import { 
  BusinessHours, 
  BusinessHoursRequest, 
  MultipleBusinessHoursRequest,
  DayOfWeek
} from '@/api/services/businessHoursService';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Clock, Loader2, Plus, Trash2, Edit, AlertTriangle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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
  'Monday': 'Thứ hai',
  'Tuesday': 'Thứ ba',
  'Wednesday': 'Thứ tư',
  'Thursday': 'Thứ năm',
  'Friday': 'Thứ sáu',
  'Saturday': 'Thứ bảy',
  'Sunday': 'Chủ nhật',
};

// Form schemas
const singleDayHoursSchema = z.object({
  dayOfWeek: z.enum(DAYS_OF_WEEK),
  openTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Định dạng thời gian không hợp lệ (HH:MM)').nullable(),
  closeTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Định dạng thời gian không hợp lệ (HH:MM)').nullable(),
  isClosed: z.boolean().default(false),
});

const multipleDayHoursSchema = z.object({
  startDay: z.enum(DAYS_OF_WEEK),
  endDay: z.enum(DAYS_OF_WEEK),
  openTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Định dạng thời gian không hợp lệ (HH:MM)').nullable(),
  closeTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Định dạng thời gian không hợp lệ (HH:MM)').nullable(),
  isClosed: z.boolean().default(false),
});

type SingleDayFormValues = z.infer<typeof singleDayHoursSchema>;
type MultipleDayFormValues = z.infer<typeof multipleDayHoursSchema>;

export const BusinessHoursManager = () => {
  const { 
    businessHours, 
    isLoadingHours, 
    refetchHours,
    createHours,
    createMultipleHours,
    updateHours,
    deleteHours,
    isCreatingHours,
    isCreatingMultipleHours,
    isUpdatingHours,
    isDeletingHours
  } = useBusinessHours();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingHours, setEditingHours] = useState<BusinessHours | null>(null);
  const [activeTab, setActiveTab] = useState<"single" | "multiple">("single");
  
  // Single day form setup
  const singleDayForm = useForm<SingleDayFormValues>({
    resolver: zodResolver(singleDayHoursSchema),
    defaultValues: {
      dayOfWeek: 'Monday',
      openTime: '09:00',
      closeTime: '17:00',
      isClosed: false
    },
  });
  
  // Multiple day form setup
  const multipleDayForm = useForm<MultipleDayFormValues>({
    resolver: zodResolver(multipleDayHoursSchema),
    defaultValues: {
      startDay: 'Monday',
      endDay: 'Friday',
      openTime: '09:00',
      closeTime: '17:00',
      isClosed: false
    },
  });

  // Reset forms when editingHours changes
  useEffect(() => {
    if (editingHours) {
      singleDayForm.reset({
        dayOfWeek: editingHours.dayOfWeek,
        openTime: editingHours.openTime,
        closeTime: editingHours.closeTime,
        isClosed: editingHours.isClosed
      });
    } else {
      singleDayForm.reset({
        dayOfWeek: 'Monday',
        openTime: '09:00',
        closeTime: '17:00',
        isClosed: false
      });
      
      multipleDayForm.reset({
        startDay: 'Monday',
        endDay: 'Friday',
        openTime: '09:00',
        closeTime: '17:00',
        isClosed: false
      });
    }
  }, [editingHours, singleDayForm, multipleDayForm]);

  // Handle single day form submission
  const onSubmitSingleDay = (data: SingleDayFormValues) => {
    const businessHoursRequest: BusinessHoursRequest = {
      dayOfWeek: data.dayOfWeek,
      openTime: data.openTime,
      closeTime: data.closeTime,
      isClosed: data.isClosed
    };

    if (editingHours) {
      // Update existing hours
      updateHours(editingHours.id, businessHoursRequest);
      setEditingHours(null);
    } else {
      // Create new hours
      createHours(businessHoursRequest);
      setIsAddDialogOpen(false);
    }
  };

  // Handle multiple day form submission
  const onSubmitMultipleDay = (data: MultipleDayFormValues) => {
    const multipleBusinessHoursRequest: MultipleBusinessHoursRequest = {
      startDay: data.startDay,
      endDay: data.endDay,
      openTime: data.openTime,
      closeTime: data.closeTime,
      isClosed: data.isClosed
    };
    
    createMultipleHours(multipleBusinessHoursRequest);
    setIsAddDialogOpen(false);
  };

  // Handle deleting hours
  const handleDeleteHours = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa giờ làm việc này?')) {
      deleteHours(id);
    }
  };

  if (isLoadingHours) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Giờ làm việc</CardTitle>
          <CardDescription>Đang tải...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Giờ làm việc</CardTitle>
          <CardDescription>Quản lý giờ mở cửa và đóng cửa của doanh nghiệp</CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm giờ làm việc
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Thêm giờ làm việc</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="single" value={activeTab} onValueChange={(value) => setActiveTab(value as "single" | "multiple")}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="single">Một ngày</TabsTrigger>
                <TabsTrigger value="multiple">Nhiều ngày</TabsTrigger>
              </TabsList>
              
              <TabsContent value="single">
                <SingleDayHoursForm 
                  form={singleDayForm} 
                  onSubmit={onSubmitSingleDay}
                  isSubmitting={isCreatingHours}
                  onCancel={() => setIsAddDialogOpen(false)}
                />
              </TabsContent>
              
              <TabsContent value="multiple">
                <MultipleDayHoursForm 
                  form={multipleDayForm} 
                  onSubmit={onSubmitMultipleDay}
                  isSubmitting={isCreatingMultipleHours}
                  onCancel={() => setIsAddDialogOpen(false)}
                />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </CardHeader>
      
      <CardContent>
        {businessHours.length === 0 ? (
          <div className="text-center py-8 border rounded-lg">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-lg font-medium">Chưa có giờ làm việc</h3>
            <p className="text-sm text-muted-foreground">
              Thêm giờ làm việc để khách hàng biết khi nào có thể đặt lịch
            </p>
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Thời gian mở cửa</TableHead>
                    <TableHead>Thời gian đóng cửa</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {businessHours
                    .sort((a, b) => {
                      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                      return days.indexOf(a.dayOfWeek) - days.indexOf(b.dayOfWeek);
                    })
                    .map(hours => (
                    <TableRow key={hours.id}>
                      <TableCell>{DAYS_OF_WEEK_VI[hours.dayOfWeek]}</TableCell>
                      <TableCell>{hours.isClosed ? '-' : hours.openTime}</TableCell>
                      <TableCell>{hours.isClosed ? '-' : hours.closeTime}</TableCell>
                      <TableCell>
                        {hours.isClosed ? (
                          <span className="rounded-full px-2 py-1 text-xs bg-red-100 text-red-800">
                            Đóng cửa
                          </span>
                        ) : (
                          <span className="rounded-full px-2 py-1 text-xs bg-green-100 text-green-800">
                            Mở cửa
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog
                            open={editingHours?.id === hours.id}
                            onOpenChange={(open) => !open && setEditingHours(null)}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setEditingHours(hours)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Chỉnh sửa giờ làm việc</DialogTitle>
                              </DialogHeader>
                              <SingleDayHoursForm 
                                form={singleDayForm} 
                                onSubmit={onSubmitSingleDay} 
                                isSubmitting={isUpdatingHours}
                                onCancel={() => setEditingHours(null)}
                                isEdit
                              />
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="destructive" 
                            size="icon"
                            onClick={() => handleDeleteHours(hours.id)}
                            disabled={isDeletingHours}
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
      </CardContent>
    </Card>
  );
};

interface HoursFormProps {
  form: any;
  onSubmit: any;
  isSubmitting: boolean;
  onCancel: () => void;
  isEdit?: boolean;
}

const SingleDayHoursForm = ({ form, onSubmit, isSubmitting, onCancel, isEdit = false }: HoursFormProps) => {
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
          name="isClosed"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Đóng cửa</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Doanh nghiệp đóng cửa vào ngày này.
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

        {!form.watch('isClosed') && (
          <>
            <FormField
              control={form.control}
              name="openTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giờ mở cửa</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="time" 
                      value={field.value || ''} 
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="closeTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giờ đóng cửa</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="time" 
                      value={field.value || ''} 
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
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
            {isEdit ? 'Cập nhật' : 'Thêm giờ làm việc'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

const MultipleDayHoursForm = ({ form, onSubmit, isSubmitting, onCancel }: HoursFormProps) => {
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
          name="isClosed"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Đóng cửa</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Doanh nghiệp đóng cửa vào những ngày này.
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

        {!form.watch('isClosed') && (
          <>
            <FormField
              control={form.control}
              name="openTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giờ mở cửa</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="time" 
                      value={field.value || ''} 
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="closeTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giờ đóng cửa</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="time" 
                      value={field.value || ''} 
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
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
            Thêm giờ làm việc
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
