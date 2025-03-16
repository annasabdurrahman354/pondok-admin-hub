
import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Download, FileBarChart, FileText, Filter } from 'lucide-react';

const YayasanReports = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('financial');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedPondok, setSelectedPondok] = useState('all');

  const financialData = [
    { name: 'Jan', anggaran: 4000, realisasi: 2400 },
    { name: 'Feb', anggaran: 3000, realisasi: 1398 },
    { name: 'Mar', anggaran: 2000, realisasi: 9800 },
    { name: 'Apr', anggaran: 2780, realisasi: 3908 },
    { name: 'Mei', anggaran: 1890, realisasi: 4800 },
    { name: 'Jun', anggaran: 2390, realisasi: 3800 },
  ];

  const programData = [
    { name: 'Keagamaan', target: 50, tercapai: 42 },
    { name: 'Pendidikan', target: 40, tercapai: 35 },
    { name: 'Kesehatan', target: 30, tercapai: 28 },
    { name: 'Sosial', target: 25, tercapai: 18 },
    { name: 'Ekonomi', target: 35, tercapai: 25 },
  ];

  const handleDownloadReport = () => {
    toast({
      title: "Laporan Diunduh",
      description: "Laporan telah berhasil diunduh",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Laporan Yayasan"
        description="Lihat dan unduh berbagai laporan terkait aktivitas yayasan"
      />

      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-6">
        <Card className="w-full md:w-1/3">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Periode</label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih periode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Periode</SelectItem>
                    <SelectItem value="2023-1">Semester 1 2023/2024</SelectItem>
                    <SelectItem value="2023-2">Semester 2 2023/2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Pondok</label>
                <Select value={selectedPondok} onValueChange={setSelectedPondok}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih pondok" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Pondok</SelectItem>
                    <SelectItem value="pondok-1">Pondok A</SelectItem>
                    <SelectItem value="pondok-2">Pondok B</SelectItem>
                    <SelectItem value="pondok-3">Pondok C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button className="w-full">
                <Filter className="w-4 h-4 mr-2" />
                Terapkan Filter
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="w-full md:w-2/3">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Ringkasan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex flex-col p-4 border rounded-lg">
                <span className="text-sm text-muted-foreground">Total RAB</span>
                <span className="text-2xl font-bold">Rp 1,25M</span>
                <span className="text-xs text-green-600 mt-1">+15% dari periode sebelumnya</span>
              </div>
              
              <div className="flex flex-col p-4 border rounded-lg">
                <span className="text-sm text-muted-foreground">Total Realisasi</span>
                <span className="text-2xl font-bold">Rp 950JT</span>
                <span className="text-xs text-muted-foreground mt-1">76% dari RAB</span>
              </div>
              
              <div className="flex flex-col p-4 border rounded-lg">
                <span className="text-sm text-muted-foreground">Ketercapaian Program</span>
                <span className="text-2xl font-bold">85%</span>
                <span className="text-xs text-green-600 mt-1">+5% dari target</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="financial" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="financial">Laporan Keuangan</TabsTrigger>
          <TabsTrigger value="program">Laporan Program</TabsTrigger>
        </TabsList>
        
        <TabsContent value="financial" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Perbandingan Anggaran dan Realisasi</CardTitle>
              <CardDescription>Data 6 bulan terakhir untuk semua pondok</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={financialData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="anggaran" fill="#8884d8" name="Anggaran" />
                    <Bar dataKey="realisasi" fill="#82ca9d" name="Realisasi" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 flex justify-end gap-4">
                <Button variant="outline" onClick={handleDownloadReport}>
                  <FileText className="w-4 h-4 mr-2" />
                  Lihat Detail
                </Button>
                
                <Button onClick={handleDownloadReport}>
                  <Download className="w-4 h-4 mr-2" />
                  Unduh Laporan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="program" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ketercapaian Program</CardTitle>
              <CardDescription>Perbandingan target dan pencapaian per kategori program</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={programData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="target" fill="#8884d8" name="Target" />
                    <Bar dataKey="tercapai" fill="#82ca9d" name="Tercapai" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 flex justify-end gap-4">
                <Button variant="outline" onClick={handleDownloadReport}>
                  <FileBarChart className="w-4 h-4 mr-2" />
                  Lihat Detail
                </Button>
                
                <Button onClick={handleDownloadReport}>
                  <Download className="w-4 h-4 mr-2" />
                  Unduh Laporan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default YayasanReports;
