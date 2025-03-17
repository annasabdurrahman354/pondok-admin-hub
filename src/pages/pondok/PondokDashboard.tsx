
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/page-header';
import { DataCard } from '@/components/ui/data-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, AlertTriangle, CheckCircle, FileText } from 'lucide-react';
import { usePondokData } from '@/hooks/usePondokData';
import { formatCurrency, formatDate } from '@/services/formatUtils';
import RABItem from '@/components/pondok/RABItem';
import LPJItem from '@/components/pondok/LPJItem';
import EmptyState from '@/components/pondok/EmptyState';
import ApprovalAlert from '@/components/pondok/ApprovalAlert';

const PondokDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    useGetPondok, 
    useGetRABs, 
    useGetLPJs, 
    useGetRABDetail, 
    useGetLPJDetail 
  } = usePondokData();
  
  // Fetch pondok data
  const { 
    data: pondokData, 
    isLoading: isPondokLoading 
  } = useGetPondok();
  
  // Fetch RABs and LPJs
  const { 
    data: rabs = [], 
    isLoading: isRabsLoading 
  } = useGetRABs(3);
  
  const { 
    data: lpjs = [], 
    isLoading: isLpjsLoading 
  } = useGetLPJs(3);
  
  // Fetch latest RAB and LPJ details if available
  const latestRabId = rabs[0]?.id;
  const latestLpjId = lpjs[0]?.id;
  
  const { 
    data: latestRabDetail, 
    isLoading: isLatestRabLoading 
  } = useGetRABDetail(latestRabId || '');
  
  const { 
    data: latestLpjDetail, 
    isLoading: isLatestLpjLoading 
  } = useGetLPJDetail(latestLpjId || '');
  
  // Calculate total for RAB and LPJ
  const totalRabPemasukan = latestRabDetail?.pemasukan?.reduce(
    (sum, item) => sum + item.nominal, 0
  ) || 0;
  
  const totalLpjRealisasi = latestLpjDetail?.pemasukan?.reduce(
    (sum, item) => sum + item.realisasi, 0
  ) || 0;
  
  const isLoading = 
    isPondokLoading || 
    isRabsLoading || 
    isLpjsLoading || 
    (latestRabId && isLatestRabLoading) || 
    (latestLpjId && isLatestLpjLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat data dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Selamat Datang, Admin Pondok`}
        description={pondokData?.pondok?.nama || 'Pondok Admin Dashboard'}
      />
      
      {/* Pending approval alert */}
      {pondokData?.pondok && !pondokData.pondok.status_acc && <ApprovalAlert />}
      
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DataCard
          title="Status RAB"
          value={
            !latestRabId ? 'Draft' :
            rabs[0].status === 'diajukan' ? 'Menunggu' : 
            rabs[0].status === 'revisi' ? 'Perlu Revisi' : 
            'Disetujui'
          }
          icon={
            !latestRabId ? <FileText className="h-4 w-4" /> :
            rabs[0].status === 'diajukan' ? <Clock className="h-4 w-4" /> : 
            rabs[0].status === 'revisi' ? <AlertTriangle className="h-4 w-4" /> : 
            <CheckCircle className="h-4 w-4" />
          }
          description={`Update terakhir: ${latestRabId ? formatDate(rabs[0].submit_at) : '-'}`}
        />
        <DataCard
          title="Total RAB"
          value={formatCurrency(totalRabPemasukan)}
          description="Budget bulan ini"
        />
        <DataCard
          title="Status LPJ"
          value={
            !latestLpjId ? 'Draft' :
            lpjs[0].status === 'diajukan' ? 'Menunggu' : 
            lpjs[0].status === 'revisi' ? 'Perlu Revisi' : 
            'Disetujui'
          }
          icon={
            !latestLpjId ? <FileText className="h-4 w-4" /> :
            lpjs[0].status === 'diajukan' ? <Clock className="h-4 w-4" /> : 
            lpjs[0].status === 'revisi' ? <AlertTriangle className="h-4 w-4" /> : 
            <CheckCircle className="h-4 w-4" />
          }
          description={`Update terakhir: ${latestLpjId ? formatDate(lpjs[0].submit_at) : '-'}`}
        />
        <DataCard
          title="Total LPJ"
          value={formatCurrency(totalLpjRealisasi)}
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
                  {rabs.length > 0 ? (
                    rabs.map((rab, index) => (
                      <RABItem key={rab.id} rab={rab} index={index} />
                    ))
                  ) : (
                    <EmptyState 
                      title="Belum ada RAB"
                      description="Anda belum memiliki Rencana Anggaran Biaya"
                      buttonText="Buat RAB"
                      buttonLink="/pondok/rab"
                    />
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
                  {lpjs.length > 0 ? (
                    lpjs.map((lpj, index) => (
                      <LPJItem key={lpj.id} lpj={lpj} index={index} />
                    ))
                  ) : (
                    <EmptyState 
                      title="Belum ada LPJ"
                      description="Anda belum memiliki Laporan Pertanggungjawaban"
                      buttonText="Buat LPJ"
                      buttonLink="/pondok/lpj"
                    />
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
