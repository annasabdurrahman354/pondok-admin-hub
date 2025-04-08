import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/page-header';
import { DataCard } from '@/components/ui/data-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Clock, AlertTriangle, CheckCircle, FileText, Plus, Edit } from 'lucide-react';
import { formatCurrency, formatDate } from '@/services/formatUtils';
import RABItem from '@/components/pondok/RABItem';
import LPJItem from '@/components/pondok/LPJItem';
import EmptyState from '@/components/pondok/EmptyState';
import ApprovalAlert from '@/components/pondok/ApprovalAlert';
import { useGetPondok, useGetRABs, useGetLPJs, useLPJMutations, useRABMutations } from '@/hooks/use-pondok-data';
import { toast } from 'sonner';

const PondokDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Fetch pondok data
  const { 
    data: pondok, 
    isLoading: isPondokLoading 
  } = useGetPondok();
  
  // Fetch RABs and LPJs
  const { 
    data: rabs = [], 
    isLoading: isRabsLoading 
  } = useGetRABs(10);
  
  const { 
    data: lpjs = [], 
    isLoading: isLpjsLoading 
  } = useGetLPJs(10);


  const { submitRABMutation } = useRABMutations();
  const { submitLPJMutation } = useLPJMutations();

  const handleSubmitRAB = async (rabId) => {
    if (!rabId) return;
    
    try {
      setIsSubmitting(true);
      await submitRABMutation.mutateAsync(rabId);
      toast.success('RAB berhasil diajukan');
    } catch (error) {
      console.error('Failed to submit RAB:', error);
      toast.error('Gagal mengajukan RAB');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle LPJ submission
  const handleSubmitLPJ = async (lpjId) => {
    if (!lpjId) return;
    try {
      setIsSubmitting(true);
      await submitLPJMutation.mutateAsync(lpjId);
      toast.success('LPJ berhasil diajukan');
    } catch (error) {
      console.error('Failed to submit LPJ:', error);
      toast.error('Gagal mengajukan LPJ');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate total for RAB and LPJ
  const totalRabPemasukan = rabs[0]?.rabPemasukan?.reduce(
    (sum, item) => sum + item.nominal, 0
  ) || 0;
  
  const totalLpjRealisasi = lpjs[0]?.lpjPemasukan?.reduce(
    (sum, item) => sum + item.realisasi, 0
  ) || 0;
  
  const isLoading = isPondokLoading || isRabsLoading || isLpjsLoading || isSubmitting;

  // Determine RAB button props
  const getRabButtonProps = () => {
    if (!rabs[0]) {
      return {
        text: 'Buat RAB',
        onClick: () => navigate('/pondok/rab/create'),
        icon: <Plus className="h-4 w-4 mr-2" />
      };
    }

    switch (rabs[0].status) {
      case 'revisi':
        return {
          text: 'Revisi RAB',
          onClick: () => navigate(`/pondok/rab/edit/${rabs[0].id}`),
          icon: <Edit className="h-4 w-4 mr-2" />
        };
      case 'draft':
        return {
          text: 'Ajukan RAB',
          onClick: () => handleSubmitRAB(rabs[0].id),
          icon: <Plus className="h-4 w-4 mr-2" />
        };
      case 'diterima':
        return null; // No button when approved
      default:
        return {
          text: 'Buat RAB',
          onClick: () => navigate('/pondok/rab/create'),
          icon: <Plus className="h-4 w-4 mr-2" />
        };
    }
  };

  // Determine LPJ button props
  const getLpjButtonProps = () => {
    if (!lpjs[0]) {
      return {
        text: 'Buat LPJ',
        onClick: () => navigate('/pondok/lpj/create'),
        icon: <Plus className="h-4 w-4 mr-2" />
      };
    }

    switch (lpjs[0].status) {
      case 'revisi':
        return {
          text: 'Revisi LPJ',
          onClick: () => navigate(`/pondok/lpj/edit/${lpjs[0].id}`),
          icon: <Edit className="h-4 w-4 mr-2" />
        };
      case 'draft':
        return {
          text: 'Ajukan LPJ',
          onClick: () => handleSubmitLPJ(lpjs[0].id),
          icon: <Plus className="h-4 w-4 mr-2" />
        };
      case 'diterima':
        return null; // No button when approved
      default:
        return {
          text: 'Buat LPJ',
          onClick: () => navigate('/pondok/lpj/create'),
          icon: <Plus className="h-4 w-4 mr-2" />
        };
    }
  };

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

  const rabButtonProps = getRabButtonProps();
  const lpjButtonProps = getLpjButtonProps();

  return (
    <div>
      <PageHeader
        title={`Selamat Datang, Admin Pondok`}
        description={pondok?.nama || 'Pondok Admin Dashboard'}
      />
      
      {/* Pending approval alert */}
      {pondok && !pondok.status_acc && <ApprovalAlert />}
      
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DataCard
          title="Status RAB"
          value={
            !rabs[0] ? 'Belum Dibuat' :
            rabs[0].status === 'diajukan' ? 'Menunggu' : 
            rabs[0].status === 'revisi' ? 'Perlu Revisi' : 
            rabs[0].status === 'draft' ? 'Belum Diajukan' : 
            'Disetujui'
          }
          icon={
            !rabs[0] ? <FileText className="h-4 w-4" /> :
            rabs[0].status === 'diajukan' ? <Clock className="h-4 w-4" /> : 
            rabs[0].status === 'revisi' ? <AlertTriangle className="h-4 w-4" /> : 
            <CheckCircle className="h-4 w-4" />
          }
          description={`Update terakhir: ${rabs[0] ? formatDate(rabs[0].submit_at) : '-'}`}
        />
        <DataCard
          title="Total RAB"
          value={formatCurrency(totalRabPemasukan)}
          description="Budget bulan ini"
        />
        <DataCard
          title="Status LPJ"
          value={
            !lpjs[0] ? 'Belum Dibuat' :
            lpjs[0].status === 'diajukan' ? 'Menunggu' : 
            lpjs[0].status === 'revisi' ? 'Perlu Revisi' : 
            lpjs[0].status === 'draft' ? 'Belum Diajukan' : 
            'Disetujui'
          }
          icon={
            !lpjs[0] ? <FileText className="h-4 w-4" /> :
            lpjs[0].status === 'diajukan' ? <Clock className="h-4 w-4" /> : 
            lpjs[0].status === 'revisi' ? <AlertTriangle className="h-4 w-4" /> : 
            <CheckCircle className="h-4 w-4" />
          }
          description={`Update terakhir: ${lpjs[0] ? formatDate(lpjs[0].submit_at) : '-'}`}
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
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Rencana Anggaran Biaya Terbaru</CardTitle>
                  <CardDescription>Daftar RAB yang telah dibuat</CardDescription>
                </div>
                {rabButtonProps && (
                  <Button 
                    size="sm" 
                    onClick={rabButtonProps.onClick}
                  >
                    {rabButtonProps.icon}
                    {rabButtonProps.text}
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-3">
                  {rabs.length > 0 ? (
                    rabs.map((rab, index) => (
                      <Link to={`/pondok/rab/detail/${rab.id}`} key={rab.id}>
                        <RABItem rab={rab} index={index} />
                      </Link>
                    ))
                  ) : (
                    <EmptyState 
                      title="Belum ada RAB"
                      description="Anda belum memiliki Rencana Anggaran Biaya"
                      buttonText="Buat RAB"
                      buttonLink="/pondok/rab/create"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="lpj">
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Laporan Pertanggungjawaban Terbaru</CardTitle>
                  <CardDescription>Daftar LPJ yang telah dibuat</CardDescription>
                </div>
                {lpjButtonProps && (
                  <Button 
                    size="sm" 
                    onClick={lpjButtonProps.onClick}
                  >
                    {lpjButtonProps.icon}
                    {lpjButtonProps.text}
                  </Button>
                )}
              </CardHeader>
              <CardContent>
              <div className="flex flex-col space-y-3">
                {lpjs.length > 0 ? (
                    lpjs.map((lpj, index) => (
                      <Link to={`/pondok/lpj/detail/${lpj.id}`} key={lpj.id}>
                        <LPJItem lpj={lpj} index={index} />
                      </Link>
                    ))
                  ) : (
                    <EmptyState 
                      title="Belum ada LPJ"
                      description="Anda belum memiliki Laporan Pertanggungjawaban"
                      buttonText="Buat LPJ"
                      buttonLink="/pondok/lpj/create"
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