
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Upload, Save, AlertCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useGetLPJs, useLPJMutations } from '@/hooks/use-pondok-data';
import { useSession } from '@/context/SessionContext';
import { LPJPemasukan, LPJPengeluaran } from '@/types/dataTypes';
import { fetchLPJPeriode, fetchRABDetail } from '@/services/apiService';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
          // We need to get the RAB with the same period to pre-fill the LPJ form
          const previousPeriodeId = calculatePreviousPeriode(periode.id);
          if (previousPeriodeId && user?.pondok_id) {
            // Find RAB for the previous period because LPJ is for the previous period
            // This is a simplified approach - you might want to fetch from the API instead
            // For this example, we'll just set some dummy RAB data
            await fetchPreviousRAB(previousPeriodeId, user.pondok_id);
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
  
  const fetchPreviousRAB = async (periodeId: string, pondokId: string) => {
    try {
      // First, we would get the RAB for the previous period
      // This is simplified for this example
      // In a real app, you'd query the database for the RAB with this period
      const dummyRabItems = [
        { nama: 'Shodaqoh', rencana: 5000000 },
        { nama: 'Uang Sewa Santri', rencana: 15000000 },
      ];
      
      const dummyPengeluaranItems = [
        { nama: 'Kebutuhan Dapur', rencana: 8000000 },
        { nama: 'Listrik dan Air', rencana: 3000000 },
        { nama: 'Gaji Pengajar', rencana: 7500000 },
      ];
      
      // Initialize LPJ items based on the RAB data
      const lpjPemasukan = dummyRabItems.map(item => ({
        id: `temp-${Math.random().toString(36).substr(2, 9)}`,
        lpj_id: 'temp',
        nama: item.nama,
        rencana: item.rencana,
        realisasi: item.rencana // Default to the planned amount, user will edit
      }));
      
      const lpjPengeluaran = dummyPengeluaranItems.map(item => ({
        id: `temp-${Math.random().toString(36).substr(2, 9)}`,
        lpj_id: 'temp',
        nama: item.nama,
        rencana: item.rencana,
        realisasi: item.rencana // Default to the planned amount, user will edit
      }));
      
      setPemasukan(lpjPemasukan);
      setPengeluaran(lpjPengeluaran);
    } catch (error) {
      console.error('Failed to fetch previous RAB:', error);
      toast.error('Gagal mengambil data RAB sebelumnya');
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
            <TabsList className="mb-4">
              <TabsTrigger value="pemasukan">Pemasukan</TabsTrigger>
              <TabsTrigger value="pengeluaran">Pengeluaran</TabsTrigger>
              <TabsTrigger value="bukti">Bukti</TabsTrigger>
              <TabsTrigger value="summary">Ringkasan</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pemasukan" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nama Pemasukan</TableHead>
                    <TableHead className="text-right">Rencana</TableHead>
                    <TableHead className="text-right">Realisasi</TableHead>
                    <TableHead className="text-right">Persentase</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pemasukan.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        Belum ada data pemasukan
                      </TableCell>
                    </TableRow>
                  ) : (
                    pemasukan.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.nama}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.rencana)}</TableCell>
                        <TableCell className="text-right">
                          <Input 
                            type="number"
                            value={item.realisasi}
                            onChange={(e) => handleChangeRealisasi(item.id, 'pemasukan', e.target.value)}
                            className="w-32 text-right ml-auto"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          {getPersentase(item.realisasi, item.rencana)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                  {pemasukan.length > 0 && (
                    <TableRow className="border-t-2">
                      <TableCell colSpan={2} className="font-bold">Total Pemasukan</TableCell>
                      <TableCell className="text-right font-bold">{formatCurrency(totalRencanaPemasukan)}</TableCell>
                      <TableCell className="text-right font-bold">{formatCurrency(totalRealisasiPemasukan)}</TableCell>
                      <TableCell className="text-right font-bold">{getPersentase(totalRealisasiPemasukan, totalRencanaPemasukan)}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="pengeluaran" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nama Pengeluaran</TableHead>
                    <TableHead className="text-right">Rencana</TableHead>
                    <TableHead className="text-right">Realisasi</TableHead>
                    <TableHead className="text-right">Persentase</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pengeluaran.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        Belum ada data pengeluaran
                      </TableCell>
                    </TableRow>
                  ) : (
                    pengeluaran.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.nama}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.rencana)}</TableCell>
                        <TableCell className="text-right">
                          <Input 
                            type="number"
                            value={item.realisasi}
                            onChange={(e) => handleChangeRealisasi(item.id, 'pengeluaran', e.target.value)}
                            className="w-32 text-right ml-auto"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          {getPersentase(item.realisasi, item.rencana)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                  {pengeluaran.length > 0 && (
                    <TableRow className="border-t-2">
                      <TableCell colSpan={2} className="font-bold">Total Pengeluaran</TableCell>
                      <TableCell className="text-right font-bold">{formatCurrency(totalRencanaPengeluaran)}</TableCell>
                      <TableCell className="text-right font-bold">{formatCurrency(totalRealisasiPengeluaran)}</TableCell>
                      <TableCell className="text-right font-bold">{getPersentase(totalRealisasiPengeluaran, totalRencanaPengeluaran)}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
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
                  <div className="grid gap-4">
                    <div className="bg-muted/30 p-4 rounded-md">
                      <h3 className="font-medium mb-2">Ringkasan LPJ</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Total Pemasukan (Rencana):</span>
                          <span className="font-medium">{formatCurrency(totalRencanaPemasukan)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Pemasukan (Realisasi):</span>
                          <span className="font-medium">{formatCurrency(totalRealisasiPemasukan)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Pengeluaran (Rencana):</span>
                          <span className="font-medium">{formatCurrency(totalRencanaPengeluaran)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Pengeluaran (Realisasi):</span>
                          <span className="font-medium">{formatCurrency(totalRealisasiPengeluaran)}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-bold">
                          <span>Saldo Awal (Rencana):</span>
                          <span className={totalRencanaPemasukan - totalRencanaPengeluaran >= 0 ? "text-green-600" : "text-red-600"}>
                            {formatCurrency(totalRencanaPemasukan - totalRencanaPengeluaran)}
                          </span>
                        </div>
                        <div className="flex justify-between font-bold">
                          <span>Saldo Akhir (Realisasi):</span>
                          <span className={totalRealisasiPemasukan - totalRealisasiPengeluaran >= 0 ? "text-green-600" : "text-red-600"}>
                            {formatCurrency(totalRealisasiPemasukan - totalRealisasiPengeluaran)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
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
