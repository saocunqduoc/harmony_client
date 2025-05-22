
import React, { useEffect, useState } from 'react';
import { useApiAuth } from '@/context/ApiAuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { authService } from '@/api/services/authService';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, User, Lock, SaveIcon, X, Loader2 } from 'lucide-react';
import ChangePasswordForm from '@/components/profile/ChangePasswordForm';
import AvatarUpload from '@/components/profile/AvatarUpload';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const { user, isLoading } = useApiAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      address: '',
    },
  });

  // Fetch detailed profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        try {
          setIsLoadingProfile(true);
          const profileData = await authService.getCurrentUser();
          setProfileData(profileData);
          
          form.reset({
            fullName: profileData.fullName || user.fullName,
            phone: profileData.phone || user.phone || '',
            address: profileData.address || '',
          });
        } catch (error) {
          console.error('Failed to fetch profile details:', error);
          toast.error("Không thể tải thông tin hồ sơ");
          
          // Use existing user data as fallback
          form.reset({
            fullName: user.fullName,
            phone: user.phone || '',
            address: '',
          });
        } finally {
          setIsLoadingProfile(false);
        }
      }
    };

    fetchProfileData();
  }, [user, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsUpdating(true);
      
      // Call API to update profile
      await authService.updateProfile({
        fullName: data.fullName,
        phone: data.phone,
        address: data.address,
      });
      
      // Update profile data state
      setProfileData({
        ...profileData,
        fullName: data.fullName,
        phone: data.phone,
        address: data.address
      });
      
      setIsEditMode(false);
      // toast.success("Cập nhật hồ sơ thành công");
    } catch (error) {
      console.error('Failed to update profile:', error);
      // toast.error("Cập nhật hồ sơ thất bại");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarUpdate = (newAvatarUrl: string) => {
    setProfileData({
      ...profileData,
      avatar: newAvatarUrl
    });
  };

  if (isLoading || isLoadingProfile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">Đang tải hồ sơ...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-xl mb-4">Vui lòng đăng nhập để xem hồ sơ của bạn</p>
            <Button asChild>
              <a href="/login">Đăng nhập</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Hồ Sơ Của Tôi</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4">
              <Card className="overflow-hidden">
                <CardHeader className="bg-muted/30">
                  <CardTitle className="text-center">Thông Tin Cá Nhân</CardTitle>
                </CardHeader>
                <CardContent className="p-6 flex flex-col items-center">
                  <AvatarUpload 
                    currentAvatar={profileData?.avatar || user.avatar} 
                    fullName={profileData?.fullName || user.fullName}
                    onAvatarUpdate={handleAvatarUpdate}
                  />
                  
                  <div className="w-full mt-6 space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">Họ và tên:</p>
                      <p className="text-sm">{profileData?.fullName || user.fullName}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">Email:</p>
                      <p className="text-sm">{profileData?.email || user.email}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">Vai trò:</p>
                      <p className="text-sm capitalize">{profileData?.role || user.role}</p>
                    </div>
                    {(profileData?.phone || user.phone) && (
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">Điện thoại:</p>
                        <p className="text-sm">{profileData?.phone || user.phone}</p>
                      </div>
                    )}
                    {profileData?.address && (
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">Địa chỉ:</p>
                        <p className="text-sm line-clamp-2">{profileData.address}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="profile" className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Thông tin
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex items-center">
                    <Lock className="h-4 w-4 mr-2" />
                    Bảo mật
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="mt-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle>Cập Nhật Thông Tin</CardTitle>
                      {!isEditMode ? (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setIsEditMode(true)} 
                          className="flex items-center"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Chỉnh sửa
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setIsEditMode(false)} 
                            className="flex items-center text-destructive"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Hủy
                          </Button>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Họ tên đầy đủ</FormLabel>
                                <FormControl>
                                  <Input {...field} disabled={!isEditMode} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Email</label>
                              <Input 
                                value={profileData?.email || user?.email || ''} 
                                disabled 
                                className="bg-muted/50"
                              />
                            </div>
                            
                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Số điện thoại</FormLabel>
                                  <FormControl>
                                    <Input {...field} disabled={!isEditMode} type="tel" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Địa chỉ</FormLabel>
                                <FormControl>
                                  <Textarea {...field} disabled={!isEditMode} rows={3} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {isEditMode && (
                            <div className="flex justify-end">
                              <Button type="submit" disabled={isUpdating} className="flex items-center">
                                {isUpdating ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Đang cập nhật...
                                  </>
                                ) : (
                                  <>
                                    <SaveIcon className="h-4 w-4 mr-2" />
                                    Lưu thông tin
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="security" className="mt-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle>Bảo mật tài khoản</CardTitle>
                      {!showPasswordForm && (
                        <Button 
                          variant="outline"
                          onClick={() => setShowPasswordForm(true)}
                        >
                          Đổi mật khẩu
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent>
                      {showPasswordForm ? (
                        <ChangePasswordForm onComplete={() => setShowPasswordForm(false)} />
                      ) : (
                        <div className="py-8 text-center text-muted-foreground">
                          <Lock className="mx-auto h-12 w-12 mb-4 text-muted-foreground/50" />
                          <p>Bạn có thể thay đổi mật khẩu để tăng cường bảo mật cho tài khoản</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
