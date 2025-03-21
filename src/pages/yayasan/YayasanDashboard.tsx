import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { DataCard } from '@/components/ui/data-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, FileText, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const YayasanDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('202306');

  // Mock data for demonstration
  const stats = {
    pondok: {
      total: 25,
      active: 23,
      pending: 2,
    },
    rab: {
      total: 23,
      approved: 18,
      pending: 3,
      revision: 2,
    },
    lpj: {
      total: 20,
      approved: 18,
      pending: 1,
      revision: 1,
    },
    totalBudget: 'Rp 375,500,000',
  };

  const pendingPondok = [
    { id: 'p1', name: 'Pondok Al-Hikmah', location: 'Bandung, Jawa Barat', date: '2023-06-10' },
    { id: 'p2', name: 'Pondok Daarul Qur\'an', location: 'Semarang, Jawa Tengah', date: '2023-06-12' },
  ];

  const pendingRab = [
    { id: 'r1', pondok: 'Pondok Al-Hikmah', amount: 'Rp 15,000,000', date: '2023-06-15' },
    { id: 'r2', pondok: 'Pondok Al-Ikhlas', amount: 'Rp 12,500,000', date: '2023-06-14' },
    { id: 'r3', pondok: 'Pondok Miftahul Jannah', amount: 'Rp 18,200,000', date: '2023-06-13' },
  ];

  const pendingLpj = [
    { id: 'l1', pondok: 'Pondok Al-Barokah', amount: 'Rp 14,500,000', date: '2023-06-05' },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4 items-start">
        <PageHeader
          title="Dashboard Admin Yayasan"
          description="Overview dan pengelolaan pondok"
        />
        
        <div className="w-full md:w-auto">
          <Select defaultValue={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Pilih Periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="202306">Juni 2023</SelectItem>
              <SelectItem value="202305">Mei 2023</SelectItem>
              <SelectItem value="202304">April 2023</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DataCard
          title="Total Pondok"
          value={stats.pondok.total}
          description={`${stats.pondok.active} aktif, ${stats.pondok.pending} menunggu persetujuan`}
          icon={<Building2 className="h-4 w-4" />}
        />
        <DataCard
          title="RAB"
          value={`${stats.rab.approved}/${stats.rab.total}`}
          description={`${stats.rab.pending} menunggu, ${stats.rab.revision} perlu revisi`}
          icon={<FileText className="h-4 w-4" />}
        />
        <DataCard
          title="LPJ"
          value={`${stats.lpj.approved}/${stats.lpj.total}`}
          description={`${stats.lpj.pending} menunggu, ${stats.lpj.revision} perlu revisi`}
          icon={<FileText className="h-4 w-4" />}
        />
        <DataCard
          title="Total Anggaran"
          value={stats.totalBudget}
          description="Periode Juni 2023"
        />
      </div>
      
      {/* Pending Approvals */}
      <div className="mb-6">
        <Tabs defaultValue="pondok" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="pondok">Persetujuan Pondok</TabsTrigger>
            <TabsTrigger value="rab">Persetujuan RAB</TabsTrigger>
            <TabsTrigger value="lpj">Persetujuan LPJ</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pondok">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pondok Menunggu Persetujuan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingPondok.length > 0 ? (
                    pendingPondok.map((pondok, index) => (
                      <motion.div 
                        key={pondok.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-md bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <Building2 className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{pondok.name}</p>
                            <p className="text-xs text-muted-foreground">{pondok.location}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-sm text-muted-foreground">{pondok.date}</span>
                          <Link to={`/yayasan/pondok/detail/${pondok.id}`}>
                            <Button size="sm" variant="outline">
                              Review
                            </Button>
                          </Link>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">Tidak ada pondok yang menunggu persetujuan</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="rab">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">RAB Menunggu Persetujuan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingRab.length > 0 ? (
                    pendingRab.map((rab, index) => (
                      <motion.div 
                        key={rab.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-md bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{rab.pondok}</p>
                            <p className="text-xs text-muted-foreground">{rab.amount}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-sm text-muted-foreground">{rab.date}</span>
                          <Link to={`/yayasan/rab/review/${rab.id}`}>
                            <Button size="sm" variant="outline">
                              Review
                            </Button>
                          </Link>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">Tidak ada RAB yang menunggu persetujuan</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="lpj">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">LPJ Menunggu Persetujuan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingLpj.length > 0 ? (
                    pendingLpj.map((lpj, index) => (
                      <motion.div 
                        key={lpj.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-md bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{lpj.pondok}</p>
                            <p className="text-xs text-muted-foreground">{lpj.amount}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-sm text-muted-foreground">{lpj.date}</span>
                          <Link to={`/yayasan/lpj/review/${lpj.id}`}>
                            <Button size="sm" variant="outline">
                              Review
                            </Button>
                          </Link>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">Tidak ada LPJ yang menunggu persetujuan</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Recent Activity */}
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative pl-6 border-l border-muted space-y-6 py-2">
              <div className="relative">
                <div className="absolute -left-[27px] p-1 bg-green-100 rounded-full border-4 border-background">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                </div>
                <div>
                  <p className="font-medium">LPJ Pondok Al-Hidayah disetujui</p>
                  <p className="text-xs text-muted-foreground">2 jam yang lalu</p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -left-[27px] p-1 bg-amber-100 rounded-full border-4 border-background">
                  <Clock className="h-3 w-3 text-amber-500" />
                </div>
                <div>
                  <p className="font-medium">RAB Pondok Al-Hikmah diajukan</p>
                  <p className="text-xs text-muted-foreground">5 jam yang lalu</p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -left-[27px] p-1 bg-red-100 rounded-full border-4 border-background">
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                </div>
                <div>
                  <p className="font-medium">RAB Pondok Miftahul Jannah perlu revisi</p>
                  <p className="text-xs text-muted-foreground">1 hari yang lalu</p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -left-[27px] p-1 bg-blue-100 rounded-full border-4 border-background">
                  <Building2 className="h-3 w-3 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">Pondok Daarul Qur'an mendaftar</p>
                  <p className="text-xs text-muted-foreground">2 hari yang lalu</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default YayasanDashboard;
