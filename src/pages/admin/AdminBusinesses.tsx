
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Building, CheckCircle, XCircle } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApi } from '@/hooks/use-api';
import { adminApiService } from '@/api/services/adminApiService';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const AdminBusinesses = () => {
  const { toast } = useToast();
  const { apiQuery, apiMutation } = useApi();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Fetch businesses with string conversion for page
  const { 
    data: businessesData,
    isLoading, 
    refetch 
  } = apiQuery(['adminBusinesses', search, status, page], () => 
    adminApiService.getAllBusinesses({
      search,
      status: status !== 'all' ? status : undefined,
      page: page.toString(), // Convert to string as required by PaginationParams
      limit: limit.toString()
    })
  );

  // Update business status mutation
  const updateBusinessStatusMutation = apiMutation(
    ({ businessId, newStatus }: { businessId: number; newStatus: string }) => 
      adminApiService.updateBusinessStatus(businessId, newStatus),
    {
      onSuccess: () => {
        toast({
          title: "Thành công",
          description: "Trạng thái doanh nghiệp đã được cập nhật",
        });
        refetch();
      }
    }
  );

  const handleStatusChange = (businessId: number, newStatus: string) => {
    updateBusinessStatusMutation.mutate({ businessId, newStatus });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    refetch();
  };

  // Get businesses data safely
  const businesses = businessesData?.data?.items || [
    {
      id: '1',
      name: 'Spa Center',
      email: 'spa@example.com',
      status: 'active',
      ownerName: 'John Doe',
      phone: '123-456-7890',
      city: 'New York',
      createdAt: '2023-01-01',
    },
    {
      id: '2',
      name: 'Salon de Coiffure',
      email: 'salon@example.com',
      status: 'pending',
      ownerName: 'Jane Smith',
      phone: '987-654-3210',
      city: 'Paris',
      createdAt: '2023-02-15',
    },
    {
      id: '3',
      name: 'Fitness First',
      email: 'fitness@example.com',
      status: 'inactive',
      ownerName: 'Mike Johnson',
      phone: '555-123-4567',
      city: 'London',
      createdAt: '2023-03-20',
    },
    {
      id: '4',
      name: 'Coffee Corner',
      email: 'coffee@example.com',
      status: 'rejected',
      ownerName: 'Emily White',
      phone: '111-222-3333',
      city: 'Sydney',
      createdAt: '2023-04-10',
    },
    {
      id: '5',
      name: 'Tech Solutions',
      email: 'tech@example.com',
      status: 'active',
      ownerName: 'David Black',
      phone: '444-555-6666',
      city: 'Tokyo',
      createdAt: '2023-05-01',
    },
    {
      id: '6',
      name: 'Harmony Clinic',
      email: 'harmony@yopmail.com',
      status: 'active',
      ownerName: 'Alice Johnson',
      phone: '555-123-4567',
      city: 'New York',
      createdAt: '2023-01-01',
    },
    {
      id: '7',
      name: 'Global Services',
      email: 'global@yopmail.com',
      status: 'active',
      ownerName: 'Bob Williams',
      phone: '555-987-6543',
      city: 'Los Angeles',
      createdAt: '2023-02-15',
    },
    {
      id: '8',
      name: 'Innovation Labs',
      email: 'innovation@yopmail.com',
      status: 'active',
      ownerName: 'Charlie Brown',
      phone: '555-555-5555',
      city: 'Chicago',
      createdAt: '2023-03-20',
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Business Management</h1>
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search businesses..." 
            className="pl-10" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <Select 
          value={status} 
          onValueChange={setStatus}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Button type="submit">
          Search
        </Button>
      </form>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Businesses</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">Loading businesses data...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Business Name</th>
                    <th className="text-left py-3 px-4">Owner</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Phone</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Created Date</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {businesses.map((business) => (
                    <tr key={business.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{business.name}</td>
                      <td className="py-3 px-4">{business.ownerName}</td>
                      <td className="py-3 px-4">{business.email}</td>
                      <td className="py-3 px-4">{business.phone}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                          business.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : business.status === 'inactive'
                            ? 'bg-red-100 text-red-800'
                            : business.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {business.status.charAt(0).toUpperCase() + business.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">{new Date(business.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end space-x-2">
                          {business.status === 'pending' && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-green-600">
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Approve Business</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to approve this business? This will create an owner account and notify them via email.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleStatusChange(business.id.toString(), 'active')}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Approve
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                          
                          {business.status === 'active' && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-red-600">
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Deactivate Business</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to deactivate this business? This will suspend their account and notify them via email.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleStatusChange(business.id.toString(), 'inactive')}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Deactivate
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                          
                          {business.status === 'inactive' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-green-600"
                              onClick={() => handleStatusChange(business.id.toString(), 'active')}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBusinesses;
