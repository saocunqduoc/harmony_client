
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, UserPlus } from 'lucide-react';

const BusinessCustomers = () => {
  // Mock customers data
  const customers = [
    {
      id: 1,
      name: 'Alex Johnson',
      email: 'alex@example.com',
      phone: '(555) 123-4567',
      appointmentsCount: 5,
      lastAppointment: '2023-10-10',
    },
    {
      id: 2,
      name: 'Emma Wilson',
      email: 'emma@example.com',
      phone: '(555) 987-6543',
      appointmentsCount: 3,
      lastAppointment: '2023-10-15',
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael@example.com',
      phone: '(555) 456-7890',
      appointmentsCount: 8,
      lastAppointment: '2023-10-05',
    },
    {
      id: 4,
      name: 'Sophie Taylor',
      email: 'sophie@example.com',
      phone: '(555) 234-5678',
      appointmentsCount: 2,
      lastAppointment: '2023-09-28',
    },
    {
      id: 5,
      name: 'James Miller',
      email: 'james@example.com',
      phone: '(555) 789-0123',
      appointmentsCount: 1,
      lastAppointment: '2023-10-20',
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search customers..." 
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Customer List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Phone</th>
                  <th className="text-left py-3 px-4">Appointments</th>
                  <th className="text-left py-3 px-4">Last Appointment</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{customer.name}</td>
                    <td className="py-3 px-4">{customer.email}</td>
                    <td className="py-3 px-4">{customer.phone}</td>
                    <td className="py-3 px-4">{customer.appointmentsCount}</td>
                    <td className="py-3 px-4">{new Date(customer.lastAppointment).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessCustomers;
