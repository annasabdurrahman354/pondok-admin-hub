import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { User, Building, Phone, Save, Key, LogOut, MapPin } from 'lucide-react';

const PondokSettings = () => {
  const { toast } = useToast();
  const [pondokData, setPondokData] = useState({
    nama: 'Pondok Al-Hikmah',
    alamat: 'Jl. Raya Bandung No. 123',
    telepon: '0812-3456-7890',
    kodePos: '40123',
    provinsi: 'Jawa Barat',
    kota: 'Bandung',
    kecamatan: 'Bandung Kulon',
    kelurahan: 'Cibaduyut',
  });

  const [pengurusData, setPengurusData] = useState([
    { id: 1, nama: 'H. Ahmad Fauzi', jabatan: 'Ketua Pondok', telepon: '0812-3456-7890' },
    { id: 2, nama: 'Ibu Halimah', jabatan: 'Bendahara', telepon: '0812-3456-7891' },
    { id: 3, nama: 'Ustadz Mahmud', jabatan: 'Sekretaris', telepon: '0812-3456-7892' },
  ]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePondokChange = (e) => {
    setPondokData({
      ...pondokData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePengurusChange = (id, field, value) => {
    setPengurusData(pengurusData.map(pengurus => 
      pengurus.id === id ? { ...pengurus, [field]: value } : pengurus
    ));
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSavePondok = () => {
    toast({
      title: "Profil Pondok Disimpan",
      description: "Perubahan pada profil pondok telah disimpan.",
    });
  };

  const handleSavePengurus = () => {
    toast({
      title: "Data Pengurus Disimpan",
      description: "Perubahan pada data pengurus telah disimpan.",
    });
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Kesalahan",
        description: "Password baru dan konfirmasi password tidak cocok.",
        variant: "destructive",
      });
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Kesalahan",
        description: "Password baru harus minimal 8 karakter.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Password Berhasil Diubah",
      description: "Password akun Anda telah berhasil diubah.",
    });
    
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logout Berhasil",
      description: "Anda telah berhasil keluar dari sistem.",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Pengaturan"
        description="Kelola profil pondok dan akun pengguna"
      />

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profil Pondok</TabsTrigger>
          <TabsTrigger value="pengurus">Pengurus</TabsTrigger>
          <TabsTrigger value="account">Akun</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profil Pondok</CardTitle>
              <CardDescription>
                Informasi detail tentang pondok Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2">
                  <Label htmlFor="nama">Nama Pondok</Label>
                  <div className="flex mt-1">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                      <Building className="h-4 w-4" />
                    </span>
                    <Input
                      id="nama"
                      name="nama"
                      value={pondokData.nama}
                      onChange={handlePondokChange}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <Label htmlFor="telepon">Nomor Telepon</Label>
                  <div className="flex mt-1">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                      <Phone className="h-4 w-4" />
                    </span>
                    <Input
                      id="telepon"
                      name="telepon"
                      value={pondokData.telepon}
                      onChange={handlePondokChange}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="alamat">Alamat</Label>
                <div className="flex mt-1">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <Input
                    id="alamat"
                    name="alamat"
                    value={pondokData.alamat}
                    onChange={handlePondokChange}
                    className="rounded-l-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="provinsi">Provinsi</Label>
                  <Input
                    id="provinsi"
                    name="provinsi"
                    value={pondokData.provinsi}
                    onChange={handlePondokChange}
                  />
                </div>
                <div>
                  <Label htmlFor="kota">Kota/Kabupaten</Label>
                  <Input
                    id="kota"
                    name="kota"
                    value={pondokData.kota}
                    onChange={handlePondokChange}
                  />
                </div>
                <div>
                  <Label htmlFor="kecamatan">Kecamatan</Label>
                  <Input
                    id="kecamatan"
                    name="kecamatan"
                    value={pondokData.kecamatan}
                    onChange={handlePondokChange}
                  />
                </div>
                <div>
                  <Label htmlFor="kelurahan">Kelurahan</Label>
                  <Input
                    id="kelurahan"
                    name="kelurahan"
                    value={pondokData.kelurahan}
                    onChange={handlePondokChange}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSavePondok} className="gap-2">
                  <Save className="h-4 w-4" />
                  Simpan Perubahan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pengurus">
          <Card>
            <CardHeader>
              <CardTitle>Data Pengurus</CardTitle>
              <CardDescription>
                Kelola informasi pengurus pondok
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {pengurusData.map((pengurus, index) => (
                <div key={pengurus.id}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`nama-${pengurus.id}`}>Nama Pengurus</Label>
                        <div className="flex mt-1">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                            <User className="h-4 w-4" />
                          </span>
                          <Input
                            id={`nama-${pengurus.id}`}
                            value={pengurus.nama}
                            onChange={(e) => handlePengurusChange(pengurus.id, 'nama', e.target.value)}
                            className="rounded-l-none"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor={`jabatan-${pengurus.id}`}>Jabatan</Label>
                        <Input
                          id={`jabatan-${pengurus.id}`}
                          value={pengurus.jabatan}
                          onChange={(e) => handlePengurusChange(pengurus.id, 'jabatan', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`telepon-${pengurus.id}`}>Nomor Telepon</Label>
                        <div className="flex mt-1">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                            <Phone className="h-4 w-4" />
                          </span>
                          <Input
                            id={`telepon-${pengurus.id}`}
                            value={pengurus.telepon}
                            onChange={(e) => handlePengurusChange(pengurus.id, 'telepon', e.target.value)}
                            className="rounded-l-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-end">
                <Button onClick={handleSavePengurus} className="gap-2">
                  <Save className="h-4 w-4" />
                  Simpan Perubahan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Akun</CardTitle>
              <CardDescription>
                Kelola keamanan dan pengaturan akun Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="" />
                  <AvatarFallback>AH</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Admin Pondok Al-Hikmah</p>
                  <p className="text-sm text-muted-foreground">admin@pondok-alhikmah.id</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Ubah Password
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="current-password">Password Saat Ini</Label>
                    <Input
                      id="current-password"
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="new-password">Password Baru</Label>
                    <Input
                      id="new-password"
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="confirm-password">Konfirmasi Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  
                  <Button onClick={handleChangePassword} className="w-full sm:w-auto">
                    Ubah Password
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium text-red-500 mb-2">Zona Berbahaya</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Anda akan keluar dari sistem dan harus login kembali untuk mengakses.
                </p>
                <Button variant="destructive" onClick={handleLogout} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PondokSettings;
