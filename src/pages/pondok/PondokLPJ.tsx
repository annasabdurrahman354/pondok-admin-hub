import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Upload, Save, AlertCircle, Trash2, Edit, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useGetLPJs, useLPJMutations } from '@/hooks/use-pondok-data';
import { useSession } from '@/context/SessionContext';
import { LPJPemasukan, LPJPengeluaran } from '@/types/dataTypes';
import { fetchLPJPeriode, fetchRABDetail } from '@/services/apiService';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';

const PondokLPJ = () => {
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const { data: lpjs = [], isLoading: isLoadingLpjs } = useGetLPJs();
  const { createLPJMutation } = useLPJMutations();
  
  // Fetch current periode on component mount
  useEffect(() => {
    const getPeriode = async () => {
      try {
        setIsLoading(true);
        const periode = await fetchLPJPeriode();
        if (periode) {
          setCurrentPeriodeId(periode.id);
          
          // Find the corresponding RAB for this period to use its data
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
  
  const calculatePreviousPeriode = (periodeId: string): string | null => {
    // Format is YYYYMM
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
  
  const fetchPreviousRABData = async (periodeId: string, pondokId: string) => {
    try {
      setIsLoading(true);
      // Try to get the RAB data from API for the previous period
      // This is where we'll load real data from the previous RAB if it exists
      
      // First, let's try to find any RAB from the specified period
      const rabResponse = await fetch(`/api/rab?period=${periodeId}&pondok=${pondokId}`);
      
      if (rabResponse.ok) {
        const rabData = await rabResponse.json();
        
        if (rabData && rabData.id) {
          // We found a RAB, now get its details
          const rabDetail = await fetchRABDetail(rabData.id);
          
          if (rabDetail) {
            setRabId(rabDetail.rab.id);
            
            // Map RAB pemasukan to LPJ pemasukan format
            const lpjPemasukan = rabDetail.pemasukan.map(item => ({
              id: `temp-${Math.random().toString(36).substr(2, 9)}`,
              lpj_id: 'temp',
              nama: item.nama,
              rencana: item.nominal,
              realisasi: item.nominal // Default to the planned amount, user will edit
            }));
            
            // Map RAB pengeluaran to LPJ pengeluaran format
            const lpjPengeluaran = rabDetail.pengeluaran.map(item => ({
              id: `temp-${Math.random().toString(36).substr(2, 9)}`,
              lpj_id: 'temp',
              nama: item.nama,
              rencana: item.nominal,
              realisasi: item.nominal // Default to the planned amount, user will edit
            }));
            
            setPemasukan(lpjPemasukan);
            setPengeluaran(lpjPengeluaran);
            return;
          }
        }
      }
      
      // If we're here, it means we couldn't find a RAB or get its details
      // Let's set up some default empty items or sample data
      toast.info('Tidak ditemukan RAB dari periode sebelumnya. Anda dapat menambahkan item secara manual.');
      setPemasukan([]);
      setPengeluaran([]);
      
    } catch (error) {
      console.error('Failed to fetch previous RAB data:', error);
      toast.error('Gagal mengambil data RAB periode sebelumnya');
      
      // Set default empty arrays
      setPemasukan([]);
      setPengeluaran([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChangeRealisasi = (id: string, type: 'pemasukan' | 'pengeluaran', value: string) => {
    const numValue = parseFloat(value) || 0;
    
    if (type === 'pemasukan') {
      setPemasukan(pemasukan.map(item => 
        item.id === id ? { ...item, realisasi: numValue } : item
      ));
    } else {
      setPengeluaran(pengeluaran.map(item => 
        item.id === id ? { ...item, realisasi: numValue } : item
      ));
    }
  };
  
  const handleAddItem = (type: 'pemasukan' | 'pengeluaran') => {
    const newItem = {
      id: `temp-${Math.random().toString(36).substr(2, 9)}`,
      lpj_id: 'temp',
      nama: '',
      rencana: 0,
      realisasi: 0
    };
    
    if (type === 'pemasukan') {
      setPemasukan([...pemasukan, newItem]);
    } else {
      setPengeluaran([...pengeluaran, newItem]);
    }
  };
  
  const handleRemoveItem = (id: string, type: 'pemasukan' | 'pengeluaran') => {
    if (type === 'pemasukan') {
      setPemasukan(pemasukan.filter(item => item.id !== id));
    } else {
      setPengeluaran(pengeluaran.filter(item => item.id !== id));
    }
  };
  
  const handleChangeName = (id: string, type: 'pemasukan' | 'pengeluaran', value: string) => {
    if (type === 'pemasukan') {
      setPemasukan(pemasukan.map(item => 
        item.id === id ? { ...item, nama: value } : item
      ));
    } else {
      setPengeluaran(pengeluaran.map(item => 
        item.id === id ? { ...item, nama: value } : item
      ));
    }
  };
  
  const handleChangeRencana = (id: string, type: 'pemasukan' | 'pengeluaran', value: string) => {
    const numValue = parseFloat(value) || 0;
    
    if (type === 'pemasukan') {
      setPemasukan(pemasukan.map(item => 
        item.id === id ? { ...item, rencana: numValue } : item
      ));
    } else {
      setPengeluaran(pengeluaran.map(item => 
        item.id === id ? { ...item, rencana: numValue } : item
      ));
    }
  };
  
  const handleUploadBukti = () => {
    if (!selectedFile) {
      toast.error('Pilih file terlebih dahulu');
      return;
    }
    
    // In a real implementation, you would upload the file to your server/storage
    toast.success('Bukti berhasil diunggah');
    setSelectedFile(null);
  };
  
  const handleCreateLPJ = async () => {
    if (!currentPeriodeId || !user?.pondok_id) {
      toast.error('Periode LPJ atau data pondok tidak tersedia');
      return;
    }
    
    if (pemasukan.length === 0 || pengeluaran.length === 0) {
      toast.error('LPJ harus memiliki minimal 1 pemasukan dan 1 pengeluaran');
      return;
    }
    
    // Validate that all items have names
    const emptyPemasukan = pemasukan.find(item => !item.nama.trim());
    const emptyPengeluaran = pengeluaran.find(item => !item.nama.trim());
    
    if (emptyPemasukan || emptyPengeluaran) {
      toast.error('Semua item harus memiliki nama');
      return;
    }
    
    try {
      setIsCreating(true);
      
      // Extract the data without the temporary IDs
      const pemasukanData = pemasukan.map(({ id, lpj_id, ...rest }) => rest);
      const pengeluaranData = pengeluaran.map(({ id, lpj_id, ...rest }) => rest);
      
      const lpjId = await createLPJMutation.mutateAsync({
        periodeId: currentPeriodeId,
        pemasukan: pemasukanData,
        pengeluaran: pengeluaranData
      });
      
      if (lpjId) {
        toast.success('LPJ berhasil dibuat');
        // Navigate to detail page
        navigate(`/pondok/lpj/detail/${lpjId}`);
      }
    } catch (error) {
      console.error('Failed to create LPJ:', error);
      toast.error('Gagal membuat LPJ');
    } finally {
      setIsCreating(false);
    }
  };
  
  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num || 0);
  };

  const getPersentase = (realisasi: number, rencana: number) => {
    if (rencana === 0) return '0%';
    return `${Math.round((realisasi / rencana) * 100)}%`;
  };

  // Toggle edit mode for an item
  const toggleEditMode = (id: string | null) => {
    setEditingId(id);
  };

  // Calculate totals
  const totalRencanaPemasukan = pemasukan.reduce((sum, item) => sum + item.rencana, 0);
  const totalRealisasiPemasukan = pemasukan.reduce((sum, item) => sum + item.realisasi, 0);
  
  const totalRencanaPengeluaran = pengeluaran.reduce((sum, item) => sum + item.rencana, 0);
  const totalRealisasiPengeluaran = pengeluaran.reduce((sum, item) => sum + item.realisasi, 0);
  
  if (isLoading || isLoadingLpjs) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!currentPeriodeId) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Laporan Pertanggungjawaban"
          description="Buat dan kelola LPJ Pondok"
        />
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
  
  if (currentPeriodLPJ) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Laporan Pertanggungjawaban"
          description="Buat dan kelola LPJ Pondok"
        />
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>LPJ sudah dibuat</AlertTitle>
          <AlertDescription>
            Anda sudah membuat LPJ untuk periode ini. Silakan lihat detail LPJ yang ada.
          </AlertDescription>
        </Alert>
        <div className="flex justify-center">
          <Button onClick={() => navigate(`/pondok/lpj/detail/${currentPeriodLPJ.id}`)}>
            Lihat Detail LPJ
          </Button>
        </div>
      </div>
    );
  }

  // Item Card Component for Pemasukan and Pengeluaran
  const ItemCard = ({ 
    item, 
    index, 
    type, 
    onRemove 
  }: { 
    item: LPJPemasukan | LPJPengeluaran, 
    index: number, 
    type: 'pemasukan' | 'pengeluaran',
    onRemove: () => void
  }) => {
    const isEditing = editingId === item.id;
    const handleSave = () => toggleEditMode(null);
    
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
              {isEditing ? (
                <Input 
                  value={item.nama}
                  onChange={(e) => handleChangeName(item.id, type, e.target.value)}
                  className="w-full mr-2"
                  placeholder="Nama item"
                />
              ) : (
                <p className="font-medium truncate">{item.nama || 'Untitled'}</p>
              )}
              <div className="flex items-center space-x-1">
                {isEditing ? (
                  <Button variant="ghost" size="icon" onClick={handleSave}>
                    <Check className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="icon" onClick={() => toggleEditMode(item.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={onRemove}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Rencana</p>
                {isEditing ? (
                  <Input 
                    type="number"
                    value={item.rencana}
                    onChange={(e) => handleChangeRencana(item.id, type, e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <p className="font-medium">{formatCurrency(item.rencana)}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Realisasi</p>
                {isEditing ? (
                  <Input 
                    type="number"
                    value={item.realisasi}
                    onChange={(e) => handleChangeRealisasi(item.id, type, e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <p className="font-medium">{formatCurrency(item.realisasi)}</p>
                )}
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
  };

  // Summary Card Component
  const SummaryCard = ({ 
    title, 
    rencana, 
    realisasi 
  }: { 
    title: string, 
    rencana: number, 
    realisasi: number 
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
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Laporan Pertanggungjawaban"
        description={`Buat LPJ untuk periode ${currentPeriodeId?.substring(0, 4) || ''}-${currentPeriodeId?.substring(4, 6) || ''}`}
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Buat LPJ Baru</CardTitle>
          <Button onClick={handleCreateLPJ} disabled={isCreating || pemasukan.length === 0 || pengeluaran.length === 0}>
            <Save className="w-4 h-4 mr-2" />
            Simpan LPJ
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pemasukan" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="pemasukan" className="flex-1">Pemasukan</TabsTrigger>
              <TabsTrigger value="pengeluaran" className="flex-1">Pengeluaran</TabsTrigger>
              <TabsTrigger value="bukti" className="flex-1">Bukti</TabsTrigger>
              <TabsTrigger value="summary" className="flex-1">Ringkasan</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pemasukan" className="space-y-4">
              <div className="flex justify-end mb-4">
                <Button onClick={() => handleAddItem('pemasukan')} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Tambah Pemasukan
                </Button>
              </div>
              
              {pemasukan.length === 0 ? (
                <div className="text-center p-8 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground">Belum ada data pemasukan</p>
                  <Button onClick={() => handleAddItem('pemasukan')} variant="outline" className="mt-4">
                    <Plus className="h-4 w-4 mr-2" /> Tambah Item
                  </Button>
                </div>
              ) : (
                <>
                  {pemasukan.map((item, index) => (
                    <ItemCard 
                      key={item.id}
                      item={item}
                      index={index}
                      type="pemasukan"
                      onRemove={() => handleRemoveItem(item.id, 'pemasukan')}
                    />
                  ))}
                  
                  <SummaryCard
                    title="Total Pemasukan"
                    rencana={totalRencanaPemasukan}
                    realisasi={totalRealisasiPemasukan}
                  />
                </>
              )}
            </TabsContent>
            
            <TabsContent value="pengeluaran" className="space-y-4">
              <div className="flex justify-end mb-4">
                <Button onClick={() => handleAddItem('pengeluaran')} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Tambah Pengeluaran
                </Button>
              </div>
              
              {pengeluaran.length === 0 ? (
                <div className="text-center p-8 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground">Belum ada data pengeluaran</p>
                  <Button onClick={() => handleAddItem('pengeluaran')} variant="outline" className="mt-4">
                    <Plus className="h-4 w-4 mr-2" /> Tambah Item
                  </Button>
                </div>
              ) : (
                <>
                  {pengeluaran.map((item, index) => (
                    <ItemCard 
                      key={item.id}
                      item={item}
                      index={index}
                      type="pengeluaran"
                      onRemove={() => handleRemoveItem(item.id, 'pengeluaran')}
                    />
                  ))}
                  
                  <SummaryCard
                    title="Total Pengeluaran"
                    rencana={totalRencanaPengeluaran}
                    realisasi={totalRealisasiPengeluaran}
                  />
                </>
              )}
            </TabsContent>
            
            <TabsContent value="bukti" className="space-y-4">
              <Card className="border-none shadow-none">
                <CardContent className="p-0">
                  <div className="space-y-4">
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])}
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer block"
                      >
                        <Upload className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                        <span className="text-lg font-medium block">
                          {selectedFile ? selectedFile.name : "Unggah Bukti LPJ"}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Klik untuk memilih file atau seret file ke sini
                        </span>
                      </label>
                    </div>
                    
                    {selectedFile && (
                      <div className="flex justify-end">
                        <Button onClick={handleUploadBukti}>
                          Unggah Bukti
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="summary">
              <Card className="border-none shadow-none">
                <CardContent className="p-0">
                  <div className="space-y-4">
                    <SummaryCard
                      title="Total Pemasukan"
                      rencana={totalRencanaPemasukan}
                      realisasi={totalRealisasiPemasukan}
                    />
                    
                    <SummaryCard
                      title="Total Pengeluaran"
                      rencana={totalRencanaPengeluaran}
                      realisasi={totalRealisasiPengeluaran}
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
                      <Button 
                        onClick={handleCreateLPJ} 
                        disabled={isCreating || pemasukan.length === 0 || pengeluaran.length === 0}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Simpan LPJ
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

export default PondokLPJ;

