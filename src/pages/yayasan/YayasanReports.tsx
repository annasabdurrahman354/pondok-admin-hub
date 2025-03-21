import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, FileText, Building2, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

const YayasanReports = () => {
  const { toast } = useToast();
  const [period, setPeriod] = useState('all');
  const [pondok, setPondok] = useState('all');

  // Mock data
  const periodsData = [
    { id: '202301', name: 'Semester 1 2023/2024' },
    { id: '202202', name: 'Semester 2 2022/2023' },
    { id: '202201', name: 'Semester 1 2022/2023' },
  ];

  const pondoksData = [
    { id: 'p1', name: 'Pondok Al-Hikmah' },
    { id: 'p2', name: 'Pondok Daarul Qur\'an' },
    { id: 'p3', name: 'Pondok Al-Barokah' },
    { id: 'p4', name: 'Pondok Nurul Hidayah' },
  ];

  // Financial summary data
  const financialSummary = {
    totalPemasukan: 782500000,
    totalPengeluaran: 718200000,
    saldoAkhir: 64300000,
    completionRate: 92,
  };

  // Mock data for charts
  const monthlyData = [
    { month: 'Jul', pemasukan: 120000000, pengeluaran: 110000000 },
    { month: 'Aug', pemasukan: 132000000, pengeluaran: 122000000 },
    { month: 'Sep', pemasukan: 129000000, pengeluaran: 119000000 },
    { month: 'Oct', pemasukan: 135000000, pengeluaran: 125000000 },
    { month: 'Nov', pemasukan: 130000000, pengeluaran: 120000000 },
    { month: 'Dec', pemasukan: 136500000, pengeluaran: 122200000 },
  ];

  const pondokDistributionData = [
    { name: 'Al-Hikmah', value: 240000000 },
    { name: 'Daarul Qur\'an', value: 180000000 },
    { name: 'Al-Barokah', value: 220000000 },
    { name: 'Nurul Hidayah', value: 142500000 },
  ];

  const recentReports = [
    { id: 1, name: 'Laporan Keuangan Semester 1 2023/2024', date: '2023-12-15', type: 'financial' },
    { id: 2, name: 'Laporan Program Semester 1 2023/2024', date: '2023-12-10', type: 'program' },
    { id: 3, name: 'Laporan Keuangan Semester 2 2022/2023', date: '2023-07-05', type: 'financial' },
    { id: 4, name: 'Laporan Program Semester 2 2022/2023', date: '2023-07-01', type: 'program' },
    { id: 5, name: 'Laporan Audit Tahunan 2022/2023', date: '2023-08-15', type: 'audit' },
  ];

  const categoryPengeluaranData = [
    { name: 'Operasional', value: 350000000 },
    { name: 'Gaji & SDM', value: 220000000 },
    { name: 'Infrastruktur', value: 85000000 },
    { name: 'Akademik', value: 63200000 },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleDownloadReport = (id) => {
    const report = recentReports.find(r => r.id === id);
    toast({
      title: "Mengunduh Laporan",
      description: `Sedang mengunduh ${report.name}`,
    });
  };

  const handleFilterChange = () => {
    toast({
      title: "Filter Diterapkan",
      description: `Data laporan telah difilter`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Laporan"
        description="Lihat dan analisis laporan keuangan dan program pondok"
      />

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Filter Laporan</CardTitle>
              <CardDescription>Pilih periode dan pondok untuk melihat data spesifik</CardDescription>
            </div>
            <Button onClick={handleFilterChange} size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Terapkan Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="period-select">Periode</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger id="period-select">
                  <SelectValue placeholder="Pilih periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Periode</SelectItem>
                  {periodsData.map((period) => (
                    <SelectItem key={period.id} value={period.id}>{period.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pondok-select">Pondok</Label>
              <Select value={pondok} onValueChange={setPondok}>
                <SelectTrigger id="pondok-select">
                  <SelectValue placeholder="Pilih pondok" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Pondok</SelectItem>
                  {pondoksData.map((pondok) => (
                    <SelectItem key={pondok.id} value={pondok.id}>{pondok.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Keuangan</CardTitle>
          <CardDescription>Semester 1 2023/2024</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-muted/30 p-4 rounded-md">
              <div className="text-sm text-muted-foreground mb-1">Total Pemasukan</div>
              <div className="text-2xl font-bold">{formatCurrency(financialSummary.totalPemasukan)}</div>
            </div>
            <div className="bg-muted/30 p-4 rounded-md">
              <div className="text-sm text-muted-foreground mb-1">Total Pengeluaran</div>
              <div className="text-2xl font-bold">{formatCurrency(financialSummary.totalPengeluaran)}</div>
            </div>
            <div className="bg-muted/30 p-4 rounded-md">
              <div className="text-sm text-muted-foreground mb-1">Saldo Akhir</div>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(financialSummary.saldoAkhir)}</div>
            </div>
            <div className="bg-muted/30 p-4 rounded-md">
              <div className="text-sm text-muted-foreground mb-1">Tingkat Realisasi</div>
              <div className="text-2xl font-bold">{financialSummary.completionRate}%</div>
            </div>
          </div>

          <Tabs defaultValue="monthly" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="monthly">Bulanan</TabsTrigger>
              <TabsTrigger value="distribution">Distribusi Pondok</TabsTrigger>
              <TabsTrigger value="category">Kategori Pengeluaran</TabsTrigger>
            </TabsList>
            
            <TabsContent value="monthly">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis 
                      tickFormatter={(value) => 
                        new Intl.NumberFormat('id', {
                          notation: 'compact',
                          compactDisplay: 'short',
                        }).format(value)
                      } 
                    />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value), ""]}
                      labelFormatter={(label) => `Bulan: ${label}`}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="pemasukan" name="Pemasukan" stroke="#4f46e5" strokeWidth={2} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="pengeluaran" name="Pengeluaran" stroke="#f97316" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="distribution">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pondokDistributionData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis 
                      tickFormatter={(value) => 
                        new Intl.NumberFormat('id', {
                          notation: 'compact',
                          compactDisplay: 'short',
                        }).format(value)
                      } 
                    />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value), "Total"]}
                      labelFormatter={(label) => `Pondok: ${label}`}
                    />
                    <Legend />
                    <Bar dataKey="value" name="Nominal" fill="#4f46e5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="category">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryPengeluaranData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis 
                      tickFormatter={(value) => 
                        new Intl.NumberFormat('id', {
                          notation: 'compact',
                          compactDisplay: 'short',
                        }).format(value)
                      } 
                    />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value), "Total"]}
                      labelFormatter={(label) => `Kategori: ${label}`}
                    />
                    <Legend />
                    <Bar dataKey="value" name="Nominal" fill="#f97316" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Laporan Terbaru</CardTitle>
          <CardDescription>Daftar laporan yang telah dibuat</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Laporan</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="text-right">Tindakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell>
                    {report.type === 'financial' ? 'Keuangan' : 
                     report.type === 'program' ? 'Program' : 'Audit'}
                  </TableCell>
                  <TableCell>{new Date(report.date).toLocaleDateString('id-ID')}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadReport(report.id)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Unduh
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default YayasanReports;
