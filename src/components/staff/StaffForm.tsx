import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { CreateStaffParams, UpdateStaffParams } from '@/api/services/staffService';
import { Loader2 } from 'lucide-react';

// Define staff roles
const StaffRoles = [
  { value: 'manager', label: 'Quản lý' },
  { value: 'staff', label: 'Nhân viên' }
];

interface StaffFormProps {
  onSubmit: (data: CreateStaffParams | UpdateStaffParams) => void;
  initialData?: { position: string; specialization?: string };
  isEdit?: boolean;
  isSubmitting?: boolean;
  fixedRole?: string;
}

const StaffForm: React.FC<StaffFormProps> = ({ 
  onSubmit, 
  initialData, 
  isEdit = false, 
  isSubmitting = false,
  fixedRole,
}) => {
  const form = useForm({
    defaultValues: {
      email: '',
      fullName: '',
      role: fixedRole ?? 'staff',
      position: initialData?.position || '',
      specialization: initialData?.specialization || '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {!isEdit && (
          <>
            {fixedRole && (
              <input
                type="hidden"
                {...form.register('role')}
                value={fixedRole}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="email" 
                      placeholder="Email nhân viên" 
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Họ và tên nhân viên" 
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!fixedRole && (
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vai trò</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn vai trò" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {StaffRoles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </>
        )}

        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vị trí</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Vị trí công việc" 
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="specialization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chuyên môn</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Chuyên môn (không bắt buộc)" 
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? 'Cập nhật' : 'Thêm nhân viên'}
        </Button>
      </form>
    </Form>
  );
};

export default StaffForm;
