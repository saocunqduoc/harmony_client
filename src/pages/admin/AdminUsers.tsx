
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, UserPlus, Edit, Trash, UserCheck, UserX } from 'lucide-react';
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

const AdminUsers = () => {
  const { toast } = useToast();
  const { apiQuery, apiMutation } = useApi();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Fetch users with page converted to string
  const { 
    data: usersData,
    isLoading, 
    refetch 
  } = apiQuery(['adminUsers', search, role, status, page], () => 
    adminApiService.getAllUsers({
      search,
      role: role !== 'all' ? role : undefined,
      status: status !== 'all' ? status : undefined,
      page: page.toString(), // Convert to string as required by PaginationParams
      limit: limit.toString()
    })
  );

  // Delete user mutation
  const deleteUserMutation = apiMutation((userId: number) => 
    adminApiService.deleteUser(userId),
    {
      onSuccess: () => {
        toast({
          title: "Thành công",
          description: "Người dùng đã được xóa thành công",
        });
        refetch();
      }
    }
  );

  // Update user status mutation
  const updateUserStatusMutation = apiMutation(
    ({ userId, newStatus }: { userId: number; newStatus: string }) => 
      adminApiService.updateUser(userId, { status: newStatus }),
    {
      onSuccess: () => {
        toast({
          title: "Thành công",
          description: "Trạng thái người dùng đã được cập nhật",
        });
        refetch();
      }
    }
  );

  const handleDelete = (userId: number) => {
    deleteUserMutation.mutate(userId);
  };

  const handleStatusChange = (userId: number, newStatus: string) => {
    updateUserStatusMutation.mutate({ userId, newStatus });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    refetch();
  };

  // Get users data safely
  const users = usersData?.data?.items || [
    {
      id: 1,
      name: 'Alex Johnson',
      email: 'alex@example.com',
      role: 'user',
      status: 'active',
      joinDate: '2023-09-15',
    },
    {
      id: 2,
      name: 'Emily Wilson',
      email: 'emily@example.com',
      role: 'business',
      status: 'active',
      joinDate: '2023-08-20',
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael@example.com',
      role: 'user',
      status: 'inactive',
      joinDate: '2023-10-05',
    },
    {
      id: 4,
      name: 'Sophie Taylor',
      email: 'sophie@example.com',
      role: 'user',
      status: 'active',
      joinDate: '2023-07-12',
    },
    {
      id: 5,
      name: 'James Miller',
      email: 'james@example.com',
      role: 'business',
      status: 'pending',
      joinDate: '2023-10-18',
    },
    {
      id: 6,
      name: 'Admin User',
      email: 'admin@yopmail.com',
      role: 'admin',
      status: 'active',
      joinDate: '2023-01-01',
    },
    {
      id: 7,
      name: 'Business Owner',
      email: 'business@yopmail.com',
      role: 'business',
      status: 'active',
      joinDate: '2023-01-01',
    },
    {
      id: 8,
      name: 'Regular User',
      email: 'user@yopmail.com',
      role: 'user',
      status: 'active',
      joinDate: '2023-01-01',
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search users..." 
            className="pl-10" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <Select 
          value={role} 
          onValueChange={setRole}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        
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
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>

        <Button type="submit">
          Search
        </Button>
      </form>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Users</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">Loading users data...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Role</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Join Date</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{user.name}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : user.role === 'business'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                          user.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : user.status === 'inactive'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">{new Date(user.joinDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {user.status === 'active' ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleStatusChange(user.id.toString(), 'inactive')}
                            >
                              <UserX className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleStatusChange(user.id.toString(), 'active')}
                            >
                              <UserCheck className="h-4 w-4" />
                            </Button>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the user
                                  account and remove their data from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(user.id.toString())}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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

export default AdminUsers;
