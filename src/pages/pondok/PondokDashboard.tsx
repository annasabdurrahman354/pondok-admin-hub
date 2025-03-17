
import React, { useEffect, useState } from 'react';
import { useAuth, supabase } from '@/context/AuthContext';
import { PageHeader } from '@/components/ui/page-header';
import { DataCard } from '@/components/ui/data-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, ArrowUpRight, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Pondok, RAB, LPJ } from '@/types/dataTypes';

type PondokData = Pondok & {
  pengurus_pondok: {
    nama: string;
    jabatan: string;
  }[];
};

type RABItem = {
  name: string;
  status: string;
  date: string;
};

type LPJItem = {
  name: string;
  status: string;
  date: string;
};

type RABSummary = {
  status: string;
  lastUpdate: string;
  total: string;
  items: RABItem[];
};

type LPJSummary = {
  status: string;
  lastUpdate: string;
  total: string;
  items: LPJItem[];
};

const PondokDashboard = () => {
  const { user } = useAuth();
  const [pondokData, setPondokData] = useState<PondokData | null>(null);
  const [rabSummary, setRabSummary] = useState<RABSummary | null>(null);
  const [lpjSummary, setLpjSummary] = useState<LPJSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPondokData = async () => {
      if (!user?.pondokId) return;

      try {
        setIsLoading(true);
        
        // Fetch pondok data with pengurus (pengurus_pondok)
        const { data: pondok, error: pondokError } = await supabase
          .from('pondok')
          .select(`
            *,
            pengurus_pondok (
              id,
              nama,
              jabatan
            )
          `)
          .eq('id', user.pondokId)
          .single();
        
        if (pondokError) throw pondokError;
        
        setPondokData(pondok as PondokData);
        
        // Fetch RAB data
        const { data: rabs, error: rabError } = await supabase
          .from('rab')
          .select('*')
          .eq('pondok_id', user.pondokId)
          .order('submit_at', { ascending: false })
          .limit(3);
        
        if (rabError) throw rabError;
        
        // Fetch LPJ data
        const { data: lpjs, error: lpjError } = await supabase
          .from('lpj')
          .select('*')
          .eq('pondok_id', user.pondokId)
          .order('submit_at', { ascending: false })
          .limit(3);
        
        if (lpjError) throw lpjError;
        
        // Process RAB data
        if (rabs && rabs.length > 0) {
          const latestRAB = rabs[0] as RAB;
          
          // Fetch RAB pemasukan and pengeluaran for the latest RAB
          const { data: pemasukan, error: pemasukanError } = await supabase
            .from('rab_pemasukan')
            .select('nominal')
            .eq('rab_id', latestRAB.id);
          
          if (pemasukanError) throw pemasukanError;
          
          const { data: pengeluaran, error: pengeluaranError } = await supabase
            .from('rab_pengeluaran')
            .select('nominal')
            .eq('rab_id', latestRAB.id);
          
          if (pengeluaranError) throw pengeluaranError;
          
          // Calculate total
          const totalPemasukan = pemasukan.reduce((sum, item) => sum + (item.nominal || 0), 0);
          
          // Convert RABs to RABItems
          const rabItems = rabs.map(rab => ({
            name: `RAB ${formatPeriode(rab.periode_id)}`,
            status: rab.status,
            date: formatDate(rab.submit_at || '')
          }));
          
          setRabSummary({
            status: latestRAB.status,
            lastUpdate: formatDate(latestRAB.submit_at || ''),
            total: formatCurrency(totalPemasukan),
            items: rabItems
          });
        } else {
          // No RABs yet
          setRabSummary({
            status: 'draft',
            lastUpdate: '-',
            total: formatCurrency(0),
            items: []
          });
        }
        
        // Process LPJ data
        if (lpjs && lpjs.length > 0) {
          const latestLPJ = lpjs[0] as LPJ;
          
          // Fetch LPJ pemasukan and pengeluaran for the latest LPJ
          const { data: pemasukan, error: pemasukanError } = await supabase
            .from('lpj_pemasukan')
            .select('realisasi')
            .eq('lpj_id', latestLPJ.id);
          
          if (pemasukanError) throw pemasukanError;
          
          const { data: pengeluaran, error: pengeluaranError } = await supabase
            .from('lpj_pengeluaran')
            .select('realisasi')
            .eq('lpj_id', latestLPJ.id);
          
          if (pengeluaranError) throw pengeluaranError;
          
          // Calculate total
          const totalPemasukan = pemasukan.reduce((sum, item) => sum + (item.realisasi || 0), 0);
          
          // Convert LPJs to LPJItems
          const lpjItems = lpjs.map(lpj => ({
            name: `LPJ ${formatPeriode(lpj.periode_id)}`,
            status: lpj.status,
            date: formatDate(lpj.submit_at || '')
          }));
          
          setLpjSummary({
            status: latestLPJ.status,
            lastUpdate: formatDate(latestLPJ.submit_at || ''),
            total: formatCurrency(totalPemasukan),
            items: lpjItems
          });
        } else {
          // No LPJs yet
          setLpjSummary({
            status: 'draft',
            lastUpdate: '-',
            total: formatCurrency(0),
            items: []
          });
        }
      } catch (error: any) {
        console.error('Error fetching pondok data:', error);
        toast.error(error.message || 'Failed to load pondok data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPondokData();
  }, [user]);

  // Helper functions
  const formatPeriode = (periode: string): string => {
    if (!periode) return '-';
    const year = periode.substring(0, 4);
    const month = periode.substring(4, 6);
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

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
          value={rabSummary?.status === 'diajukan' ? 'Menunggu' : 
                 rabSummary?.status === 'revisi' ? 'Perlu Revisi' : 
                 rabSummary?.status === 'diterima' ? 'Disetujui' : 'Draft'}
          icon={rabSummary?.status === 'diajukan' ? <Clock className="h-4 w-4" /> : 
                rabSummary?.status === 'revisi' ? <AlertTriangle className="h-4 w-4" /> : 
                rabSummary?.status === 'diterima' ? <CheckCircle className="h-4 w-4" /> :
                <FileText className="h-4 w-4" />}
          description={`Update terakhir: ${rabSummary?.lastUpdate || '-'}`}
        />
        <DataCard
          title="Total RAB"
          value={rabSummary?.total || 'Rp 0'}
          description="Budget bulan ini"
        />
        <DataCard
          title="Status LPJ"
          value={lpjSummary?.status === 'diajukan' ? 'Menunggu' : 
                 lpjSummary?.status === 'revisi' ? 'Perlu Revisi' : 
                 lpjSummary?.status === 'diterima' ? 'Disetujui' : 'Draft'}
          icon={lpjSummary?.status === 'diajukan' ? <Clock className="h-4 w-4" /> : 
                lpjSummary?.status === 'revisi' ? <AlertTriangle className="h-4 w-4" /> : 
                lpjSummary?.status === 'diterima' ? <CheckCircle className="h-4 w-4" /> :
                <FileText className="h-4 w-4" />}
          description={`Update terakhir: ${lpjSummary?.lastUpdate || '-'}`}
        />
        <DataCard
          title="Total LPJ"
          value={lpjSummary?.total || 'Rp 0'}
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
                  {rabSummary && rabSummary.items.length > 0 ? (
                    rabSummary.items.map((item, index) => (
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
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Belum ada RAB yang dibuat</p>
                      <Button variant="outline" className="mt-4" onClick={() => navigate('/pondok/rab')}>
                        Buat RAB
                      </Button>
                    </div>
                  )}
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
                  {lpjSummary && lpjSummary.items.length > 0 ? (
                    lpjSummary.items.map((item, index) => (
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
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Belum ada LPJ yang dibuat</p>
                      <Button variant="outline" className="mt-4" onClick={() => navigate('/pondok/lpj')}>
                        Buat LPJ
                      </Button>
                    </div>
                  )}
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
