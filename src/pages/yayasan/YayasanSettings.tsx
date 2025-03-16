
import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Save, Upload, User, Users, Bell, BadgeAlert } from 'lucide-react';

const YayasanSettings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile settings
  const [profile, setProfile] = useState({
    name: 'Yayasan Pendidikan Al-Hikmah',
    email: 'admin@alhikmah.org',
    phone: '+62 812-3456-7890',
    address: 'Jl. Raya Pendidikan No. 123, Bandung, Jawa Barat 40123',
    description: 'Yayasan Pendidikan Al-Hikmah didirikan pada tahun 1995 dengan fokus pada pembinaan pendidikan Islam yang berkualitas melalui jaringan pondok pesantren modern yang tersebar di berbagai wilayah Indonesia.',
    website: 'www.alhikmah.org',
    foundedYear: '1995'
  });
  
  // Admin users
  const [admins, setAdmins] = useState([
    { id: 1, name: 'H. Ahmad Fauzi', email: 'ahmad@alhikmah.org', role: 'super_admin', lastLogin: '2023-06-10 09:30' },
    { id: 2, name: 'Fatimah Azzahra', email: 'fatimah@alhikmah.org', role: 'admin', lastLogin: '2023-06-09 15:45' },
    { id: 3, name: 'Muhammad Rizki', email: 'rizki@alhikmah.org', role: 'editor', lastLogin: '2023-06-08 11:20' }
  ]);
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    rabApproval: true,
    lpjApproval: true,
    pondokRegistration: true,
    dailyDigest: false,
    weeklyReport: true
  });
  
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    role: 'admin'
  });

  const handleProfileChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };
  
  const handleNotificationChange = (field, value) => {
    setNotifications({ ...notifications, [field]: value });
  };
  
  const handleAddAdmin = () => {
    if (!newAdmin.name || !newAdmin.email) {
      toast({
        title: "Validasi Gagal",
        description: "Nama dan email admin harus diisi",
        variant: "destructive",
      });
      return;
    }
    
    setAdmins([
      ...admins,
      {
        id: admins.length + 1,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        lastLogin: '-'
      }
    ]);
    
    setNewAdmin({
      name: '',
      email: '',
      role: 'admin'
    });
    
    toast({
      title: "Admin Berhasil Ditambahkan",
      description: `${newAdmin.name} telah ditambahkan sebagai ${newAdmin.role === 'super_admin' ? 'Super Admin' : newAdmin.role === 'admin' ? 'Admin' : 'Editor'}`,
    });
  };
  
  const handleRemoveAdmin = (id) => {
    setAdmins(admins.filter(admin => admin.id !== id));
    
    toast({
      title: "Admin Dihapus",
      description: "Admin telah dihapus dari sistem",
    });
  };
  
  const handleSaveProfile = () => {
    toast({
      title: "Profil Berhasil Disimpan",
      description: "Perubahan pada profil yayasan telah disimpan",
    });
  };
  
  const handleSaveNotifications = () => {
    toast({
      title: "Pengaturan Notifikasi Disimpan",
      description: "Preferensi notifikasi telah diperbarui",
    });
  };
  
  const getRoleBadge = (role) => {
    switch (role) {
      case 'super_admin':
        return <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">Super Admin</span>;
      case 'admin':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Admin</span>;
      case 'editor':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Editor</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Pengaturan"
        description="Kelola profil yayasan, pengguna, dan preferensi"
      />

      <Tabs defaultValue="profile" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profil Yayasan</TabsTrigger>
          <TabsTrigger value="admin">Pengguna Admin</TabsTrigger>
          <TabsTrigger value="notifications">Notifikasi</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profil Yayasan</CardTitle>
              <CardDescription>Informasi dasar tentang yayasan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>YA</AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-2">
                  <h3 className="text-lg font-medium">{profile.name}</h3>
                  <p className="text-sm text-muted-foreground">Logo dan identitas visual yayasan</p>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Unggah Logo
                  </Button>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="yayasan-name">Nama Yayasan</Label>
                  <Input 
                    id="yayasan-name" 
                    value={profile.name}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="yayasan-email">Email</Label>
                  <Input 
                    id="yayasan-email" 
                    type="email" 
                    value={profile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="yayasan-phone">Nomor Telepon</Label>
                  <Input 
                    id="yayasan-phone" 
                    value={profile.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="yayasan-website">Website</Label>
                  <Input 
                    id="yayasan-website" 
                    value={profile.website}
                    onChange={(e) => handleProfileChange('website', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="yayasan-founded">Tahun Didirikan</Label>
                  <Input 
                    id="yayasan-founded" 
                    value={profile.foundedYear}
                    onChange={(e) => handleProfileChange('foundedYear', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="yayasan-address">Alamat</Label>
                  <Input 
                    id="yayasan-address" 
                    value={profile.address}
                    onChange={(e) => handleProfileChange('address', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="yayasan-description">Deskripsi</Label>
                  <Textarea 
                    id="yayasan-description"
                    rows={4}
                    value={profile.description}
                    onChange={(e) => handleProfileChange('description', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile}>
                <Save className="h-4 w-4 mr-2" />
                Simpan Perubahan
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="admin" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pengguna Admin</CardTitle>
              <CardDescription>Kelola pengguna admin yayasan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {admins.map((admin) => (
                  <div key={admin.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3 sm:mb-0">
                      <Avatar>
                        <AvatarFallback>{admin.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{admin.name}</h3>
                        <p className="text-sm text-muted-foreground">{admin.email}</p>
                        <div className="mt-1">{getRoleBadge(admin.role)}</div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 items-end sm:items-center">
                      <span className="text-sm text-muted-foreground">
                        Login: {admin.lastLogin}
                      </span>
                      {admin.role !== 'super_admin' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemoveAdmin(admin.id)}
                        >
                          Hapus
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Tambah Admin Baru
                  </h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="admin-name">Nama</Label>
                      <Input 
                        id="admin-name" 
                        value={newAdmin.name}
                        onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Email</Label>
                      <Input 
                        id="admin-email" 
                        type="email" 
                        value={newAdmin.email}
                        onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                        placeholder="Masukkan alamat email"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="admin-role">Peran</Label>
                      <select 
                        id="admin-role"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={newAdmin.role}
                        onChange={(e) => setNewAdmin({...newAdmin, role: e.target.value})}
                      >
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </div>
                  </div>
                  <Button className="mt-4" onClick={handleAddAdmin}>
                    Tambah Admin
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Pengaturan Notifikasi
              </CardTitle>
              <CardDescription>Kelola preferensi notifikasi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Notifikasi Email</h3>
                    <p className="text-sm text-muted-foreground">Aktifkan notifikasi email untuk semua jenis pemberitahuan</p>
                  </div>
                  <Switch 
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                  />
                </div>
                
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-medium mb-2">Jenis Notifikasi</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Persetujuan RAB</h4>
                      <p className="text-sm text-muted-foreground">Dapatkan notifikasi saat ada RAB baru yang menunggu persetujuan</p>
                    </div>
                    <Switch 
                      checked={notifications.rabApproval}
                      onCheckedChange={(checked) => handleNotificationChange('rabApproval', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Persetujuan LPJ</h4>
                      <p className="text-sm text-muted-foreground">Dapatkan notifikasi saat ada LPJ baru yang menunggu persetujuan</p>
                    </div>
                    <Switch 
                      checked={notifications.lpjApproval}
                      onCheckedChange={(checked) => handleNotificationChange('lpjApproval', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Pendaftaran Pondok</h4>
                      <p className="text-sm text-muted-foreground">Dapatkan notifikasi saat ada pondok baru yang mendaftar</p>
                    </div>
                    <Switch 
                      checked={notifications.pondokRegistration}
                      onCheckedChange={(checked) => handleNotificationChange('pondokRegistration', checked)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-medium mb-2">Ringkasan dan Laporan</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Ringkasan Harian</h4>
                      <p className="text-sm text-muted-foreground">Dapatkan ringkasan aktivitas harian dari semua pondok</p>
                    </div>
                    <Switch 
                      checked={notifications.dailyDigest}
                      onCheckedChange={(checked) => handleNotificationChange('dailyDigest', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Laporan Mingguan</h4>
                      <p className="text-sm text-muted-foreground">Dapatkan laporan mingguan kegiatan dan keuangan</p>
                    </div>
                    <Switch 
                      checked={notifications.weeklyReport}
                      onCheckedChange={(checked) => handleNotificationChange('weeklyReport', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications}>
                <Save className="h-4 w-4 mr-2" />
                Simpan Pengaturan
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default YayasanSettings;
