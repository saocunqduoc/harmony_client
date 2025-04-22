
import React from 'react';
import { Staff } from '@/api/services/staffService';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PencilLine, Trash2, Clock, AlertCircle } from 'lucide-react';

interface StaffListProps {
  staffList: Staff[];
  isLoading: boolean;
  onEdit: (staff: Staff) => void;
  onDelete: (staffId: number) => void;
  onManageSchedule: (staff: Staff) => void;
}

const StaffList = ({ staffList, isLoading, onEdit, onDelete, onManageSchedule }: StaffListProps) => {
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  // Translate role to Vietnamese
  const translateRole = (role: string) => {
    switch (role.toLowerCase()) {
      case 'owner':
        return 'Chủ cơ sở';
      case 'manager':
        return 'Quản lý';
      case 'staff':
        return 'Nhân viên';
      default:
        return role;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
                <Skeleton className="h-10 w-10" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (staffList.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 flex flex-col items-center justify-center py-16">
          <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Không có nhân viên nào</h3>
          <p className="text-muted-foreground text-center mt-2">
            Chưa có nhân viên nào được thêm vào hệ thống. Hãy bấm "Thêm nhân viên" để bắt đầu.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nhân viên</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Vị trí</TableHead>
              <TableHead>Chuyên môn</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffList.map((staff) => (
              <TableRow key={staff.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={staff.user.avatar || undefined} alt={staff.user.fullName} />
                      <AvatarFallback>{getInitials(staff.user.fullName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{staff.user.fullName}</p>
                      <p className="text-sm text-muted-foreground">{staff.user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={staff.user.role === 'manager' ? 'outline' : 'secondary'}>
                    {translateRole(staff.user.role)}
                  </Badge>
                </TableCell>
                <TableCell>{staff.position}</TableCell>
                <TableCell>{staff.specialization || "-"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onManageSchedule(staff)}
                      title="Quản lý lịch làm việc"
                    >
                      <Clock className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(staff)}
                      title="Chỉnh sửa"
                    >
                      <PencilLine className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => onDelete(staff.id)}
                      title="Xóa nhân viên"
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
  );
};

export default StaffList;
