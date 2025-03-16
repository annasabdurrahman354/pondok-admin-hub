
import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { BellRing, Building, MailIcon, Save, Settings, User, Users } from 'lucide-react';

const YayasanSettings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [yayasanInfo, setYayasanInfo] = useState({
    name: 'Yayasan ABC',
    email: 'admin@yayasanabc.org',
    phone: '021-12345678',
    address: 'Jl. Pendidikan No. 123, Jakarta',
    logo: '/placeholder.svg',
  });
  const [adminInfo, setAdminInfo] = useState({
    name: 'Administrator',
    email: 'admin@yayasanabc.org',
    phone: '0812-3456-7890',
    photo: '/placeholder.svg',
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    rabApprovalNotifications: true,
    lpjSubmissionNotifications: true,
    systemUpdates: false,
  });

  const handleYayasanInfoChange = (field, value) => {
    setYayasanInfo({
      ...yayasanInfo,
      [field]: value,
    });
  };

  const handleAdminInfoChange = (field, value) => {
    setAdminInfo({
      ...adminInfo,
      [field]: value,
    });
  };

  const handleSaveYayasanInfo = () => {
    toast({
      title: "Perubahan Disimpan",
      description: "Informasi yayasan telah berhasil diperbarui",
    });
  };

  const handleSaveAdminInfo = () => {
    toast({
      title: "Perubahan Disimpan",
      description: "Informasi administrator telah berhasil diperbarui",
    });
  };

  const handleSaveNotificationSettings = () => {
    toast({
      title: "Pengaturan Disimpan",
      description: "Pengaturan notifikasi telah berhasil diperbarui",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Pengaturan Yayasan"
        description="Kelola informasi dan pengaturan untuk akun yayasan Anda"
      />

      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="profile">
            <Building className="w-4 h-4 mr-2" />
            Profil Yayasan
          </TabsTrigger>
          <TabsTrigger value="admin">
            <User className="w-4 h-4 mr-2" />
            Admin
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <BellRing className="w-4 h-4 mr-2" />
            Notifikasi
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Yayasan</CardTitle>
              <CardDescription>
                Kelola informasi dasar yayasan Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3 flex flex-col items-center">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={yayasanInfo.logo} alt={yayasanInfo.name} />
                    <AvatarFallback>{yayasanInfo.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <Button className="mt-4" variant="outline">
                    Ubah Logo
                  </Button>
                  <div className="mt-4 text-center">
                    <Badge>Yayasan</Badge>
                  </div>
                </div>
                
                <div className="space-y-4 md:w-2/3">
                  <div className="space-y-2">
                    <Label htmlFor="yayasan-name">Nama Yayasan</Label>
                    <Input 
                      id="yayasan-name" 
                      value={yayasanInfo.name}
                      onChange={(e) => handleYayasanInfoChange('name', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="yayasan-email">Email</Label>
                    <Input 
                      id="yayasan-email" 
                      type="email"
                      value={yayasanInfo.email}
                      onChange={(e) => handleYayasanInfoChange('email', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="yayasan-phone">Nomor Telepon</Label>
                    <Input 
                      id="yayasan-phone" 
                      value={yayasanInfo.phone}
                      onChange={(e) => handleYayasanInfoChange('phone', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="yayasan-address">Alamat</Label>
                    <Input 
                      id="yayasan-address" 
                      value={yayasanInfo.address}
                      onChange={(e) => handleYayasanInfoChange('address', e.target.value)}
                    />
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <Button onClick={handleSaveYayasanInfo}>
                      <Save className="w-4 h-4 mr-2" />
                      Simpan Perubahan
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="admin" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profil Administrator</CardTitle>
              <CardDescription>
                Kelola informasi administrator yayasan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3 flex flex-col items-center">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={adminInfo.photo} alt={adminInfo.name} />
                    <AvatarFallback>{adminInfo.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <Button className="mt-4" variant="outline">
                    Ubah Foto
                  </Button>
                  <div className="mt-4 text-center">
                    <Badge variant="secondary">Admin Yayasan</Badge>
                  </div>
                </div>
                
                <div className="space-y-4 md:w-2/3">
                  <div className="space-y-2">
                    <Label htmlFor="admin-name">Nama</Label>
                    <Input 
                      id="admin-name" 
                      value={adminInfo.name}
                      onChange={(e) => handleAdminInfoChange('name', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email</Label>
                    <Input 
                      id="admin-email" 
                      type="email"
                      value={adminInfo.email}
                      onChange={(e) => handleAdminInfoChange('email', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="admin-phone">Nomor Telepon</Label>
                    <Input 
                      id="admin-phone" 
                      value={adminInfo.phone}
                      onChange={(e) => handleAdminInfoChange('phone', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <div className="flex gap-4">
                      <Input 
                        id="admin-password" 
                        type="password"
                        value="••••••••"
                        disabled
                      />
                      <Button variant="outline">Ubah Password</Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <Button onClick={handleSaveAdminInfo}>
                      <Save className="w-4 h-4 mr-2" />
                      Simpan Perubahan
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Manajemen Pengguna</CardTitle>
              <CardDescription>
                Kelola akun administrator tambahan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>SU</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Supardi</p>
                      <p className="text-sm text-muted-foreground">supardi@yayasanabc.org</p>
                    </div>
                  </div>
                  <Badge>Admin</Badge>
                </div>
                
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>AR</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Ahmad Rasyid</p>
                      <p className="text-sm text-muted-foreground">ahmad@yayasanabc.org</p>
                    </div>
                  </div>
                  <Badge variant="outline">Editor</Badge>
                </div>
                
                <Button variant="outline" className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Tambah Pengguna Baru
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Notifikasi</CardTitle>
              <CardDescription>
                Kelola preferensi notifikasi untuk akun Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Notifikasi Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Terima notifikasi melalui email
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, emailNotifications: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Pengajuan RAB</Label>
                    <p className="text-sm text-muted-foreground">
                      Dapatkan notifikasi ketika ada pengajuan RAB baru
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.rabApprovalNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, rabApprovalNotifications: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Pengajuan LPJ</Label>
                    <p className="text-sm text-muted-foreground">
                      Dapatkan notifikasi ketika ada pengajuan LPJ baru
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.lpjSubmissionNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, lpjSubmissionNotifications: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Pembaruan Sistem</Label>
                    <p className="text-sm text-muted-foreground">
                      Dapatkan notifikasi tentang pembaruan sistem dan fitur baru
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.systemUpdates}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, systemUpdates: checked})
                    }
                  />
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button onClick={handleSaveNotificationSettings}>
                    <Settings className="w-4 h-4 mr-2" />
                    Simpan Pengaturan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default YayasanSettings;
