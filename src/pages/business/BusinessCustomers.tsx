import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { businessService } from '@/api/services/businessService';

const BusinessCustomers = () => {
  const [searchTerm, setSearchTerm] = useState('');           // input ngay lập tức
  const [search, setSearch] = useState('');                   // giá trị đã debounce
  const [page, setPage] = useState(1);
  const [data, setData] = useState<{
    customers: any[];
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // debounce 500ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await businessService.getBusinessCustomers({ page, limit: 10, search });
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, search]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        {/* Tiêu đề trang */}
        <h1 className="text-2xl font-bold">Khách hàng</h1>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Thêm khách hàng
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm khách hàng..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Danh sách khách hàng</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Đang tải...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Tên</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Điện thoại</th>
                    <th className="text-left py-3 px-4">Số lịch hẹn</th>
                    <th className="text-left py-3 px-4">Lần hẹn cuối</th>
                    <th className="text-right py-3 px-4">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.customers.map((c) => (
                    <tr key={c.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{c.name}</td>
                      <td className="py-3 px-4">{c.email}</td>
                      <td className="py-3 px-4">{c.phone || 'Chưa cung cấp'}</td>
                      <td className="py-3 px-4">{c.appointments}</td>
                      <td className="py-3 px-4">{new Date(c.lastAppointment).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm">Xem</Button>
                          <Button variant="outline" size="sm">Chỉnh sửa</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
        {data && data.totalPages > 1 && (
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Trang {page} / {data.totalPages}
            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" onClick={() => setPage(p => p - 1)} disabled={page === 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setPage(p => p + 1)} disabled={page === data.totalPages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default BusinessCustomers;
