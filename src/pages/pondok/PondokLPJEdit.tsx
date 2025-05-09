import { useState, useEffect, useCallback, useMemo } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Save, AlertCircle, Trash2, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useGetLPJs, useLPJMutations } from '@/hooks/use-pondok-data';
import { useSession } from '@/context/SessionContext';
import { LPJPemasukan, LPJPengeluaran, LPJ } from '@/types/dataTypes';
import { fetchLPJPeriode, fetchRABDetail, updateLPJ } from '@/services/apiService';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import React from 'react';

// Memoized ItemCard component to prevent unnecessary re-renders
interface ItemCardProps {
  item: LPJPemasukan | LPJPengeluaran;
  index: number;
  type: string;
  onRemove: (id: string, type: string) => void;
  onChangeName: (id: string, type: string, value: string) => void;
  onChangeRencana: (id: string, type: string, value: string) => void;
  onChangeRealisasi: (id: string, type: string, value: string) => void;
  getPersentase: (realisasi: number, rencana: number) => string;
}

const ItemCard: React.FC<ItemCardProps> = React.memo(({
  item,
  index,
  type,
  onRemove,
  onChangeName,
  onChangeRencana,
  onChangeRealisasi,
  getPersentase
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="mb-3"
    >
      <Card className="overflow-hidden">
        <CardHeader className="p-3 flex flex-row items-center justify-between bg-muted/30">
          <div className="flex items-center justify-between w-full">
            <Input 
              value={item.nama}
              onChange={(e) => onChangeName(item.id, type, e.target.value)}
              className="w-full mr-2"
              placeholder="Nama item"
            />
            <Button variant="ghost" size="icon" onClick={() => onRemove(item.id, type)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Rencana</p>
              <Input 
                type="number"
                value={item.rencana}
                onChange={(e) => onChangeRencana(item.id, type, e.target.value)}
                className="w-full"
                placeholder="nominal"
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Realisasi</p>
              <Input 
                type="number"
                value={item.realisasi}
                onChange={(e) => onChangeRealisasi(item.id, type, e.target.value)}
                className="w-full"
                placeholder="nominal"
              />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-xs text-muted-foreground mb-1">Persentase Realisasi</p>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${Math.min(100, Math.round((item.realisasi / (item.rencana || 1)) * 100))}%` }}
              />
            </div>
            <p className="text-xs mt-1 text-right">{getPersentase(item.realisasi, item.rencana)}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

// Memoized SummaryCard component
interface SummaryCardProps {
  title: string;
  rencana: number;
  realisasi: number;
  formatCurrency: (amount: number) => string;
  getPersentase: (realisasi: number, rencana: number) => string;
}

const SummaryCard: React.FC<SummaryCardProps> = React.memo(({
  title,
  rencana,
  realisasi,
  formatCurrency,
  getPersentase
}) => (
  <Card className="mb-4 bg-muted/20">
    <CardContent className="p-4">
      <h3 className="font-medium text-lg mb-2">{title}</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground">Rencana</p>
          <p className="font-medium">{formatCurrency(rencana)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Realisasi</p>
          <p className="font-medium">{formatCurrency(realisasi)}</p>
        </div>
      </div>
      <div className="mt-2">
        <p className="text-xs text-muted-foreground mb-1">Persentase Realisasi</p>
        <div className="w-full bg-muted rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{ width: `${Math.min(100, Math.round((realisasi / (rencana || 1)) * 100))}%` }}
          />
        </div>
        <p className="text-xs mt-1 text-right">{getPersentase(realisasi, rencana)}</p>
      </div>
    </CardContent>
  </Card>
));

const PondokLPJEdit = () => {
  const navigate = useNavigate();
  const { user } = useSession();
  const [activeTab, setActiveTab] = useState('pemasukan');
  const [currentPeriodeId, setCurrentPeriodeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [rabId, setRabId] = useState<string | null>(null);
  
  // LPJ data state
  const [pemasukan, setPemasukan] = useState<LPJPemasukan[]>([]);
  const [pengeluaran, setPengeluaran] = useState<LPJPengeluaran[]>([]);
  
  const { data: lpjs = [], isLoading: isLoadingLpjs } = useGetLPJs();
  const { createLPJMutation, updateLPJMutation } = useLPJMutations();
  const pondokId = user?.pondok_id;

  // Fetch current periode on component mount
  useEffect(() => {
    const getPeriode = async () => {
      try {
        setIsLoading(true);
        const periode = await fetchLPJPeriode();
        if (periode) {
          setCurrentPeriodeId(periode.id);
          
          // Calculate previous periode and attempt to load RAB data if available
          const previousPeriodeId = calculatePreviousPeriode(periode.id);
          if (previousPeriodeId && user?.pondok_id) {
            await fetchPreviousRABData(previousPeriodeId, user.pondok_id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch periode:', error);
        toast.error('Gagal mengambil periode LPJ saat ini');
      } finally {
        setIsLoading(false);
      }
    };
    
    getPeriode();
  }, [user?.pondok_id]);
  
  // Check if user already has an LPJ for the current period
  const currentPeriodLPJ = lpjs.find(lpj => lpj.periode_id === currentPeriodeId);
  // Determine if we are in edit mode (LPJ exists and its status is "revisi")
  const isEditMode = currentPeriodLPJ && currentPeriodLPJ.status === 'revisi';
  
  // Calculate previous periode (format: YYYYMM)
  const calculatePreviousPeriode = (periodeId: string): string => {
    const year = parseInt(periodeId.substring(0, 4));
    const month = parseInt(periodeId.substring(4, 6));
    let prevMonth = month - 1;
    let prevYear = year;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear -= 1;
    }
    return `${prevYear}${prevMonth.toString().padStart(2, '0')}`;
  };
  
  // Fetch previous RAB data and map it to LPJ format
  const fetchPreviousRABData = async (periodeId: string, pondokId: string) => {
    try {
      setIsLoading(true);
      const rabResponse = await fetch(`/api/rab?period=${periodeId}&pondok=${pondokId}`);
      if (rabResponse.ok) {
        const rabData = await rabResponse.json();
        if (rabData && rabData.id) {
          const rabDetail = await fetchRABDetail(rabData.id);
          if (rabDetail) {
            setRabId(rabDetail.rab.id);
            const lpjPemasukan = rabDetail.pemasukan.map((item) => ({
              id: `temp-${Math.random().toString(36).substr(2, 9)}`,
              lpj_id: 'temp',
              nama: item.nama,
              rencana: item.nominal,
              realisasi: item.nominal // default, user can edit
            }));
            const lpjPengeluaran = rabDetail.pengeluaran.map((item) => ({
              id: `temp-${Math.random().toString(36).substr(2, 9)}`,
              lpj_id: 'temp',
              nama: item.nama,
              rencana: item.nominal,
              realisasi: item.nominal // default, user can edit
            }));
            setPemasukan(lpjPemasukan);
            setPengeluaran(lpjPengeluaran);
            return;
          }
        }
      }
      toast.info('Tidak ditemukan RAB dari periode sebelumnya. Anda dapat menambahkan item secara manual.');
      setPemasukan([]);
      setPengeluaran([]);
    } catch (error) {
      console.error('Failed to fetch previous RAB data:', error);
      toast.error('Gagal mengambil data RAB periode sebelumnya');
      setPemasukan([]);
      setPengeluaran([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handlers for editing items
  const handleChangeRealisasi = useCallback((id: string, type: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    if (type === 'pemasukan') {
      setPemasukan(prev => prev.map(item => item.id === id ? { ...item, realisasi: numValue } : item));
    } else {
      setPengeluaran(prev => prev.map(item => item.id === id ? { ...item, realisasi: numValue } : item));
    }
  }, []);
  
  const handleAddItem = useCallback((type: string) => {
    const newItem = {
      id: `temp-${Math.random().toString(36).substr(2, 9)}`,
      lpj_id: 'temp',
      nama: '',
      rencana: 0,
      realisasi: 0
    };
    if (type === 'pemasukan') {
      setPemasukan(prev => [...prev, newItem]);
    } else {
      setPengeluaran(prev => [...prev, newItem]);
    }
  }, []);
  
  const handleRemoveItem = useCallback((id: string, type: string) => {
    if (type === 'pemasukan') {
      setPemasukan(prev => prev.filter(item => item.id !== id));
    } else {
      setPengeluaran(prev => prev.filter(item => item.id !== id));
    }
  }, []);
  
  const handleChangeName = useCallback((id: string, type: string, value: string) => {
    if (type === 'pemasukan') {
      setPemasukan(prev => prev.map(item => item.id === id ? { ...item, nama: value } : item));
    } else {
      setPengeluaran(prev => prev.map(item => item.id === id ? { ...item, nama: value } : item));
    }
  }, []);
  
  const handleChangeRencana = useCallback((id: string, type: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    if (type === 'pemasukan') {
      setPemasukan(prev => prev.map(item => item.id === id ? { ...item, rencana: numValue } : item));
    } else {
      setPengeluaran(prev => prev.map(item => item.id === id ? { ...item, rencana: numValue } : item));
    }
  }, []);
  
  // Validate form
  const isFormValid = useMemo(() => {
    if (pemasukan.length === 0 || pengeluaran.length === 0) return false;
    const validPemasukan = pemasukan.every(item => item.nama.trim() !== '' && !isNaN(item.rencana) && !isNaN(item.realisasi));
    const validPengeluaran = pengeluaran.every(item => item.nama.trim() !== '' && !isNaN(item.rencana) && !isNaN(item.realisasi));
    return validPemasukan && validPengeluaran;
  }, [pemasukan, pengeluaran]);
  
  const handleCreateLPJ = async () => {
    if (!currentPeriodeId || !user?.pondok_id) {
      toast.error('Periode LPJ atau data pondok tidak tersedia');
      return;
    }
    if (!isFormValid) {
      toast.error('Semua item harus memiliki nama, rencana, dan realisasi');
      return;
    }
    try {
      setIsCreating(true);
      const pemasukanData = pemasukan.map(({ id, lpj_id, ...rest }) => rest);
      const pengeluaranData = pengeluaran.map(({ id, lpj_id, ...rest }) => rest);
      let isSuccess = false;
      let lpjId = '';
      if (isEditMode) {
        isSuccess = await updateLPJMutation.mutateAsync({
          lpjId: currentPeriodLPJ.id,
          lpjData: {}, // Add additional LPJ fields if needed
          pemasukan: pemasukanData,
          pengeluaran: pengeluaranData,
        });
      } else {
        lpjId = await createLPJMutation.mutateAsync({
          periodeId: currentPeriodeId,
          pemasukan: pemasukanData,
          pengeluaran: pengeluaranData,
        });
      }
      if (isSuccess || lpjId) {
        toast.success('LPJ berhasil disimpan');
        navigate(`/pondok/lpj/detail/${currentPeriodLPJ?.id || lpjId}`);
      }
    } catch (error) {
      console.error('Failed to create LPJ:', error);
      toast.error('Gagal membuat LPJ');
    } finally {
      setIsCreating(false);
    }
  };
  
  const formatCurrency = useCallback((amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num || 0);
  }, []);
  
  const getPersentase = useCallback((realisasi: number, rencana: number) => {
    if (rencana === 0) return '0%';
    return `${Math.round((realisasi / rencana) * 100)}%`;
  }, []);
  
  const totalRencanaPemasukan = pemasukan.reduce((sum, item) => sum + item.rencana, 0);
  const totalRealisasiPemasukan = pemasukan.reduce((sum, item) => sum + item.realisasi, 0);
  
  const totalRencanaPengeluaran = pengeluaran.reduce((sum, item) => sum + item.rencana, 0);
  const totalRealisasiPengeluaran = pengeluaran.reduce((sum, item) => sum + item.realisasi, 0);
  
  if (isLoading || isLoadingLpjs) {
    return (
      <div className="flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!currentPeriodeId) {
    return (
      <div className='space-y-6'>
        <PageHeader
          title="Laporan Pertanggungjawaban"
          description="Buat dan kelola LPJ Pondok"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/pondok/lpj-list`, { replace: true })}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Batal
          </Button>
        </PageHeader>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Periode LPJ tidak tersedia</AlertTitle>
          <AlertDescription>
            Tidak ada periode LPJ aktif saat ini. Silakan hubungi admin yayasan.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  // If an LPJ exists and it's not in revisi state, show alert and navigation option
  if (currentPeriodLPJ && !isEditMode) {
    return (
      <div className='space-y-6'>
        <PageHeader
          title="Laporan Pertanggungjawaban"
          description="Buat dan kelola LPJ Pondok"
        >
        <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/pondok/lpj/detail/${currentPeriodLPJ.id}`, { replace: true })}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Batal
          </Button>
        </PageHeader>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>LPJ sudah dibuat</AlertTitle>
          <AlertDescription>
            Anda sudah membuat LPJ untuk periode ini. Silakan lihat detail LPJ yang ada.
          </AlertDescription>
        </Alert>
        <div className="flex justify-center mt-4">
          <Button onClick={() => navigate(`/pondok/lpj/detail/${currentPeriodLPJ.id}`, { replace: true })}>
            Lihat Detail LPJ
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className='space-y-6'>
      <PageHeader 
        title="Laporan Pertanggungjawaban"
        description={`Buat LPJ untuk periode ${currentPeriodeId?.substring(0, 4)}-${currentPeriodeId?.substring(4, 6)}`}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/pondok/lpj/detail/${currentPeriodLPJ.id}`, { replace: true })}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Batal
        </Button>
      </PageHeader>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{isEditMode ? 'Edit LPJ' : 'Buat LPJ Baru'}</CardTitle>
          <Button onClick={handleCreateLPJ} disabled={isCreating || !isFormValid}>
            <Save className="w-4 h-4 mr-2" />
            {isEditMode ? 'Simpan Perubahan' : 'Simpan LPJ'}
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pemasukan" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="pemasukan" className="flex-1">Pemasukan</TabsTrigger>
              <TabsTrigger value="pengeluaran" className="flex-1">Pengeluaran</TabsTrigger>
              <TabsTrigger value="summary" className="flex-1">Ringkasan</TabsTrigger>
            </TabsList>
            <TabsContent value="pemasukan" className="space-y-4">
              <div className="flex justify-center mb-4">
                <Button onClick={() => handleAddItem('pemasukan')} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Tambah Pemasukan
                </Button>
              </div>
              {pemasukan.length === 0 ? (
                <div className="text-center p-2 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground">Belum ada data pemasukan</p>
                </div>
              ) : (
                <>
                  {pemasukan.map((item, index) => (
                    <ItemCard 
                      key={item.id}
                      item={item}
                      index={index}
                      type="pemasukan"
                      onRemove={handleRemoveItem}
                      onChangeName={handleChangeName}
                      onChangeRencana={handleChangeRencana}
                      onChangeRealisasi={handleChangeRealisasi}
                      getPersentase={getPersentase}
                    />
                  ))}
                  <SummaryCard
                    title="Total Pemasukan"
                    rencana={totalRencanaPemasukan}
                    realisasi={totalRealisasiPemasukan}
                    formatCurrency={formatCurrency}
                    getPersentase={getPersentase}
                  />
                </>
              )}
            </TabsContent>
            <TabsContent value="pengeluaran" className="space-y-4">
              <div className="flex justify-center mb-4">
                <Button onClick={() => handleAddItem('pengeluaran')} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Tambah Pengeluaran
                </Button>
              </div>
              {pengeluaran.length === 0 ? (
                <div className="text-center p-2 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground">Belum ada data pengeluaran</p>
                </div>
              ) : (
                <>
                  {pengeluaran.map((item, index) => (
                    <ItemCard 
                      key={item.id}
                      item={item}
                      index={index}
                      type="pengeluaran"
                      onRemove={handleRemoveItem}
                      onChangeName={handleChangeName}
                      onChangeRencana={handleChangeRencana}
                      onChangeRealisasi={handleChangeRealisasi}
                      getPersentase={getPersentase}
                    />
                  ))}
                  <SummaryCard
                    title="Total Pengeluaran"
                    rencana={totalRencanaPengeluaran}
                    realisasi={totalRealisasiPengeluaran}
                    formatCurrency={formatCurrency}
                    getPersentase={getPersentase}
                  />
                </>
              )}
            </TabsContent>
            <TabsContent value="summary">
              <Card className="border-none shadow-none">
                <CardContent className="p-0">
                  <div className="space-y-4">
                    <SummaryCard
                      title="Total Pemasukan"
                      rencana={totalRencanaPemasukan}
                      realisasi={totalRealisasiPemasukan}
                      formatCurrency={formatCurrency}
                      getPersentase={getPersentase}
                    />
                    <SummaryCard
                      title="Total Pengeluaran"
                      rencana={totalRencanaPengeluaran}
                      realisasi={totalRealisasiPengeluaran}
                      formatCurrency={formatCurrency}
                      getPersentase={getPersentase}
                    />
                    <Card className="mb-4">
                      <CardContent className="p-4">
                        <h3 className="font-medium text-lg mb-2">Saldo</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Saldo (Rencana)</p>
                            <p className={`font-medium ${totalRencanaPemasukan - totalRencanaPengeluaran >= 0 ? "text-green-600" : "text-red-600"}`}>
                              {formatCurrency(totalRencanaPemasukan - totalRencanaPengeluaran)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Saldo (Realisasi)</p>
                            <p className={`font-medium ${totalRealisasiPemasukan - totalRealisasiPengeluaran >= 0 ? "text-green-600" : "text-red-600"}`}>
                              {formatCurrency(totalRealisasiPemasukan - totalRealisasiPengeluaran)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <div className="flex justify-end">
                      <Button onClick={handleCreateLPJ} disabled={isCreating || !isFormValid}>
                        <Save className="w-4 h-4 mr-2" />
                        {isEditMode ? 'Simpan Perubahan' : 'Simpan LPJ'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PondokLPJEdit;
