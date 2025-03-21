import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Building2, MapPin, Users, Phone, Mail, CalendarDays, FileText, ClipboardList } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PondokDetail = () => {
  const { pondokId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock data for the pondok
  const pondokData = {
    id: pondokId || 'p1',
    name: 'Pondok Al-Hikmah',
    status: 'active',
    location: 'Jl. Raya Bandung No. 123, Bandung, Jawa Barat',
    phone: '+62 812-3456-7890',
    email: 'admin@alhikmah.ac.id',
    website: 'www.alhikmah.ac.id',
    santriCount: 120,
    ustadzCount: 15,
    foundedDate: '2010-05-15',
    leadName: 'KH. Ahmad Fauzi',
    description: 'Pondok Al-Hikmah adalah pesantren yang fokus pada pendidikan Al-Quran dan bahasa Arab. Didirikan pada tahun 2010 oleh KH. Ahmad Fauzi, pesantren ini telah meluluskan ribuan santri yang kompeten dalam bidangnya.',
    rabCount: 12,
    lpjCount: 10,
    lastSync: '2023-06-01',
  };

  // Mock financial data
  const financialSummary = {
    currentPeriod: 'Semester 1 2023/2024',
    lastRab: {
      id: 'rab-2023-1',
      date: '2023-01-10',
      totalBudget: 125000000,
      status: 'approved',
    },
    lastLpj: {
      id: 'lpj-2022-2',
      date: '2022-12-15',
      totalRealization: 118500000,
      status: 'approved',
    }
  };

  // Mock history data
  const activityHistory = [
    { id: 1, type: 'rab', title: 'RAB Semester 1 2023', date: '2023-01-10', status: 'approved' },
    { id: 2, type: 'lpj', title: 'LPJ Semester 2 2022', date: '2022-12-15', status: 'approved' },
    { id: 3, type: 'rab', title: 'RAB Semester 2 2022', date: '2022-07-05', status: 'approved' },
    { id: 4, type: 'lpj', title: 'LPJ Semester 1 2022', date: '2022-06-20', status: 'approved' },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleViewRAB = (rabId) => {
    navigate(`/yayasan/rab/${rabId}`);
  };

  const handleViewLPJ = (lpjId) => {
    navigate(`/yayasan/lpj/${lpjId}`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Aktif</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Menunggu</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Tidak Aktif</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Disetujui</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Ditolak</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/yayasan/pondok')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        <PageHeader
          title={pondokData.name}
          description={`Detail informasi pondok dan aktivitas keuangan`}
        />
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="financial">Keuangan</TabsTrigger>
          <TabsTrigger value="history">Riwayat</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Informasi Pondok</CardTitle>
                {getStatusBadge(pondokData.status)}
              </div>
              <CardDescription>Detail dan informasi kontak pondok</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium">Nama Pondok</h3>
                      <p>{pondokData.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium">Alamat</h3>
                      <p>{pondokData.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium">Jumlah Santri</h3>
                      <p>{pondokData.santriCount} santri</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CalendarDays className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium">Tanggal Didirikan</h3>
                      <p>{new Date(pondokData.foundedDate).toLocaleDateString('id-ID', { 
                        year: 'numeric', month: 'long', day: 'numeric' 
                      })}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium">Nomor Telepon</h3>
                      <p>{pondokData.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p>{pondokData.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium">Pimpinan</h3>
                      <p>{pondokData.leadName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CalendarDays className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium">Terakhir Sinkronisasi</h3>
                      <p>{new Date(pondokData.lastSync).toLocaleDateString('id-ID', { 
                        year: 'numeric', month: 'long', day: 'numeric' 
                      })}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="font-medium mb-2">Deskripsi</h3>
                <p className="text-muted-foreground">{pondokData.description}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Keuangan</CardTitle>
              <CardDescription>Periode: {financialSummary.currentPeriod}</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <Card className="border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">RAB Terakhir</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID:</span>
                      <span>{financialSummary.lastRab.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tanggal:</span>
                      <span>{new Date(financialSummary.lastRab.date).toLocaleDateString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Anggaran:</span>
                      <span className="font-medium">{formatCurrency(financialSummary.lastRab.totalBudget)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Status:</span>
                      {getStatusBadge(financialSummary.lastRab.status)}
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-4"
                    onClick={() => handleViewRAB(financialSummary.lastRab.id)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Lihat Detail RAB
                  </Button>
                </CardContent>
              </Card>

              <Card className="border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">LPJ Terakhir</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID:</span>
                      <span>{financialSummary.lastLpj.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tanggal:</span>
                      <span>{new Date(financialSummary.lastLpj.date).toLocaleDateString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Realisasi:</span>
                      <span className="font-medium">{formatCurrency(financialSummary.lastLpj.totalRealization)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Status:</span>
                      {getStatusBadge(financialSummary.lastLpj.status)}
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-4"
                    onClick={() => handleViewLPJ(financialSummary.lastLpj.id)}
                  >
                    <ClipboardList className="h-4 w-4 mr-2" />
                    Lihat Detail LPJ
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Aktivitas</CardTitle>
              <CardDescription>Histori lengkap RAB dan LPJ pondok</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityHistory.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 rounded-md border">
                    <div className="flex items-center gap-3">
                      {activity.type === 'rab' ? (
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ClipboardList className="h-5 w-5 text-muted-foreground" />
                      )}
                      <div>
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(activity.date).toLocaleDateString('id-ID', {
                            year: 'numeric', month: 'long', day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(activity.status)}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (activity.type === 'rab') {
                            handleViewRAB(`rab-${activity.id}`);
                          } else {
                            handleViewLPJ(`lpj-${activity.id}`);
                          }
                        }}
                      >
                        Lihat Detail
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PondokDetail;
