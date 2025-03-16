
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/ui/page-header';
import { DataCard } from '@/components/ui/data-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, ArrowUpRight, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PondokDashboard = () => {
  const { user } = useAuth();
  const [pondokData, setPondokData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration
  const rab = {
    status: 'diajukan',
    lastUpdate: '2023-06-15',
    total: 'Rp 15,500,000',
    items: [
      { name: 'RAB June 2023', status: 'diajukan', date: '2023-06-01' },
      { name: 'RAB May 2023', status: 'diterima', date: '2023-05-01' },
      { name: 'RAB April 2023', status: 'revisi', date: '2023-04-01' },
    ]
  };

  const lpj = {
    status: 'diterima',
    lastUpdate: '2023-06-30',
    total: 'Rp 14,750,000',
    items: [
      { name: 'LPJ May 2023', status: 'diterima', date: '2023-06-01' },
      { name: 'LPJ April 2023', status: 'diterima', date: '2023-05-01' },
      { name: 'LPJ March 2023', status: 'diterima', date: '2023-04-01' },
    ]
  };

  useEffect(() => {
    const fetchPondokData = async () => {
      try {
        // Mock API request - this will be replaced with Supabase
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Get data from localStorage for demo purposes
        const storedData = localStorage.getItem(`pondok_data_${user?.pondokId}`);
        if (storedData) {
          setPondokData(JSON.parse(storedData));
        }
      } catch (error) {
        console.error('Error fetching pondok data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPondokData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Selamat Datang, Admin Pondok`}
        description={pondokData?.nama || 'Pondok Admin Dashboard'}
      />
      
      {/* Pending approval alert */}
      {pondokData && !pondokData.status_acc && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="flex items-center gap-3 py-4">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <div className="flex-1">
                <p className="text-amber-800 font-medium">Data pondok menunggu persetujuan admin yayasan</p>
                <p className="text-amber-700 text-sm">Beberapa fitur dibatasi sampai data disetujui</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DataCard
          title="Status RAB"
          value={rab.status === 'diajukan' ? 'Menunggu' : rab.status === 'revisi' ? 'Perlu Revisi' : 'Disetujui'}
          icon={rab.status === 'diajukan' ? <Clock className="h-4 w-4" /> : 
                rab.status === 'revisi' ? <AlertTriangle className="h-4 w-4" /> : 
                <CheckCircle className="h-4 w-4" />}
          description={`Update terakhir: ${rab.lastUpdate}`}
        />
        <DataCard
          title="Total RAB"
          value={rab.total}
          description="Budget bulan ini"
        />
        <DataCard
          title="Status LPJ"
          value={lpj.status === 'diajukan' ? 'Menunggu' : lpj.status === 'revisi' ? 'Perlu Revisi' : 'Disetujui'}
          icon={lpj.status === 'diajukan' ? <Clock className="h-4 w-4" /> : 
                lpj.status === 'revisi' ? <AlertTriangle className="h-4 w-4" /> : 
                <CheckCircle className="h-4 w-4" />}
          description={`Update terakhir: ${lpj.lastUpdate}`}
        />
        <DataCard
          title="Total LPJ"
          value={lpj.total}
          description="Realisasi bulan lalu"
        />
      </div>
      
      {/* Recent activities */}
      <div className="mb-6">
        <Tabs defaultValue="rab" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="rab">RAB Terbaru</TabsTrigger>
            <TabsTrigger value="lpj">LPJ Terbaru</TabsTrigger>
          </TabsList>
          <TabsContent value="rab">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Rencana Anggaran Biaya Terbaru</CardTitle>
                <CardDescription>Daftar RAB yang telah dibuat</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {rab.items.map((item, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-md bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          item.status === 'diajukan' ? 'secondary' : 
                          item.status === 'revisi' ? 'destructive' : 
                          'default'
                        }>
                          {item.status}
                        </Badge>
                        <Link to={`/pondok/rab/detail/${index}`}>
                          <Button size="sm" variant="ghost">
                            <ArrowUpRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="lpj">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Laporan Pertanggungjawaban Terbaru</CardTitle>
                <CardDescription>Daftar LPJ yang telah dibuat</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lpj.items.map((item, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-md bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          item.status === 'diajukan' ? 'secondary' : 
                          item.status === 'revisi' ? 'destructive' : 
                          'default'
                        }>
                          {item.status}
                        </Badge>
                        <Link to={`/pondok/lpj/detail/${index}`}>
                          <Button size="sm" variant="ghost">
                            <ArrowUpRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PondokDashboard;
