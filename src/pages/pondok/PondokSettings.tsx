
import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Save, User, Users, Bell, LogOut, Download } from 'lucide-react';

const PondokSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [pondokData, setPondokData] = useState({
    nama: 'Pondok Al-Hidayah',
    telepon: '08123456789',
    alamat: 'Jl. Raya Pondok No. 123',
    provinsi: 'Jawa Barat',
    kota: 'Bandung',
    kecamatan: 'Coblong',
    kelurahan: 'Dago',
    kodePos: '40135',
  });
  
  const [accountData, setAccountData] = useState({
    email: 'admin@pondok-alhidayah.org',
    name: 'Ahmad Hidayat',
    emailNotifications: true,
    appNotifications: true,
  });
  
  const [pengurusData, setPengurusData] = useState([
    { id: 1, nama: 'Ahmad Hidayat', jabatan: 'Pimpinan Pondok' },
    { id: 2, nama: 'Siti Fatimah', jabatan: 'Bendahara' },
    { id: 3, nama: 'Muhammad Ridwan', jabatan: 'Sekretaris' },
  ]);
  
  const [newPengurus, setNewPengurus] = useState({ nama: '', jabatan: '' });

  const handleSavePondok = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Berhasil Disimpan",
        description: "Data pondok berhasil diperbarui",
      });
    }, 1000);
  };
  
  const handleSaveAccount = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Berhasil Disimpan",
        description: "Pengaturan akun berhasil diperbarui",
      });
    }, 1000);
  };
  
  const handleAddPengurus = () => {
    if (!newPengurus.nama || !newPengurus.jabatan) {
      toast({
        title: "Validasi Gagal",
        description: "Nama dan jabatan harus diisi",
        variant: "destructive",
      });
      return;
    }
    
    setPengurusData([
      ...pengurusData,
      {
        id: pengurusData.length + 1,
        ...newPengurus
      }
    ]);
    
    setNewPengurus({ nama: '', jabatan: '' });
    
    toast({
      title: "Pengurus Ditambahkan",
      description: `${newPengurus.nama} (${newPengurus.jabatan}) berhasil ditambahkan`,
    });
  };
  
  const handleExportData = () => {
    toast({
      title: "Ekspor Data",
      description: "Data pondok berhasil diekspor ke Excel",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Pengaturan Pondok"
        description="Kelola data dan pengaturan pondok"
      />

      <Tabs defaultValue="pondok" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pondok">Data Pondok</TabsTrigger>
          <TabsTrigger value="pengurus">Data Pengurus</TabsTrigger>
          <TabsTrigger value="account">Akun</TabsTrigger>
          <TabsTrigger value="advanced">Lanjutan</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pondok" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pondok</CardTitle>
              <CardDescription>
                Data dan informasi dasar pondok
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama Pondok</Label>
                  <Input 
                    id="nama" 
                    value={pondokData.nama}
                    onChange={(e) => setPondokData({...pondokData, nama: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telepon">Nomor Telepon</Label>
                  <Input 
                    id="telepon" 
                    value={pondokData.telepon}
                    onChange={(e) => setPondokData({...pondokData, telepon: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="alamat">Alamat</Label>
                <Input 
                  id="alamat" 
                  value={pondokData.alamat}
                  onChange={(e) => setPondokData({...pondokData, alamat: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="provinsi">Provinsi</Label>
                  <Input 
                    id="provinsi" 
                    value={pondokData.provinsi}
                    onChange={(e) => setPondokData({...pondokData, provinsi: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kota">Kota/Kabupaten</Label>
                  <Input 
                    id="kota" 
                    value={pondokData.kota}
                    onChange={(e) => setPondokData({...pondokData, kota: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="kecamatan">Kecamatan</Label>
                  <Input 
                    id="kecamatan" 
                    value={pondokData.kecamatan}
                    onChange={(e) => setPondokData({...pondokData, kecamatan: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kelurahan">Kelurahan/Desa</Label>
                  <Input 
                    id="kelurahan" 
                    value={pondokData.kelurahan}
                    onChange={(e) => setPondokData({...pondokData, kelurahan: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kodePos">Kode Pos</Label>
                  <Input 
                    id="kodePos" 
                    value={pondokData.kodePos}
                    onChange={(e) => setPondokData({...pondokData, kodePos: e.target.value})}
                  />
                </div>
              </div>
              
              <Button onClick={handleSavePondok} className="mt-4" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pengurus" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Pengurus Pondok</CardTitle>
              <CardDescription>
                Kelola data pengurus pondok
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <Input
                    placeholder="Nama Pengurus"
                    value={newPengurus.nama}
                    onChange={(e) => setNewPengurus({...newPengurus, nama: e.target.value})}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Jabatan"
                    value={newPengurus.jabatan}
                    onChange={(e) => setNewPengurus({...newPengurus, jabatan: e.target.value})}
                    className="flex-1"
                  />
                  <Button onClick={handleAddPengurus}>Tambah Pengurus</Button>
                </div>
                
                <div className="space-y-2 mt-4">
                  {pengurusData.map((pengurus) => (
                    <div 
                      key={pengurus.id} 
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
                    >
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <User className="h-4 w-4" />
                        </Avatar>
                        <div>
                          <p className="font-medium">{pengurus.nama}</p>
                          <p className="text-xs text-muted-foreground">{pengurus.jabatan}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Akun</CardTitle>
              <CardDescription>
                Kelola akun dan preferensi notifikasi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <User className="h-8 w-8" />
                </Avatar>
                <div>
                  <h3 className="font-medium">{accountData.name}</h3>
                  <p className="text-sm text-muted-foreground">{accountData.email}</p>
                  <Button variant="link" className="p-0 h-auto mt-1 text-xs">
                    Ganti Foto Profil
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama</Label>
                  <Input 
                    id="name" 
                    value={accountData.name}
                    onChange={(e) => setAccountData({...accountData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={accountData.email}
                    onChange={(e) => setAccountData({...accountData, email: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-4 mt-4">
                <h3 className="font-medium">Pengaturan Notifikasi</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Notifikasi Email</h4>
                    <p className="text-sm text-muted-foreground">Terima pemberitahuan via email</p>
                  </div>
                  <Switch 
                    checked={accountData.emailNotifications}
                    onCheckedChange={(checked) => setAccountData({...accountData, emailNotifications: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Notifikasi Aplikasi</h4>
                    <p className="text-sm text-muted-foreground">Terima pemberitahuan di aplikasi</p>
                  </div>
                  <Switch 
                    checked={accountData.appNotifications}
                    onCheckedChange={(checked) => setAccountData({...accountData, appNotifications: checked})}
                  />
                </div>
              </div>
              
              <Button onClick={handleSaveAccount} className="mt-4" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Lanjutan</CardTitle>
              <CardDescription>
                Eksport data dan pengaturan lanjutan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Ekspor Data</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Ekspor data pondok, RAB, dan LPJ dalam format Excel
                  </p>
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="h-4 w-4 mr-2" />
                    Ekspor Data
                  </Button>
                </div>
                
                <div className="bg-red-50 p-4 rounded-md">
                  <h3 className="font-medium text-red-800 mb-2">Zona Berbahaya</h3>
                  <p className="text-sm text-red-700 mb-4">
                    Tindakan berikut tidak dapat dibatalkan. Harap berhati-hati.
                  </p>
                  <div className="space-y-2">
                    <Button variant="destructive" className="w-full">
                      <LogOut className="h-4 w-4 mr-2" />
                      Keluar dari Aplikasi
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PondokSettings;
