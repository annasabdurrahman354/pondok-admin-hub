import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Save, Trash2, AlertCircle, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetRABs, useRABMutations } from '@/hooks/use-pondok-data';
import { useSession } from '@/context/SessionContext';
import { RABPemasukan, RABPengeluaran, RAB } from '@/types/dataTypes';
import { fetchRABPeriode } from '@/services/apiService';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const PondokRABEdit = () => {
  const navigate = useNavigate();
  const { user } = useSession();
  const [activeTab, setActiveTab] = useState('pemasukan');
  const [currentPeriodeId, setCurrentPeriodeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // RAB data state
  const [pemasukan, setPemasukan] = useState<Omit<RABPemasukan, 'id' | 'rab_id'>[]>([]);
  const [pengeluaran, setPengeluaran] = useState<Omit<RABPengeluaran, 'id' | 'rab_id'>[]>([]);
  const [newPemasukan, setNewPemasukan] = useState({ nama: '', nominal: '' });
  const [newPengeluaran, setNewPengeluaran] = useState({ 
    kategori: 'Ukhro', 
    nama: '', 
    detail: '', 
    nominal: '' 
  });
  
  const { data: rabs = [], isLoading: isLoadingRabs } = useGetRABs();
  const { createRABMutation, updateRABMutation } = useRABMutations();
  const pondokId = user?.pondok_id;

  // Fetch current periode on component mount
  useEffect(() => {
    const getPeriode = async () => {
      try {
        setIsLoading(true);
        const periode = await fetchRABPeriode();
        if (periode) {
          setCurrentPeriodeId(periode.id);
        }
      } catch (error) {
        console.error('Failed to fetch periode:', error);
        toast.error('Gagal mengambil periode RAB saat ini');
      } finally {
        setIsLoading(false);
      }
    };
    
    getPeriode();
  }, []);
  
  // Check if user already has a RAB for the current period
  const currentPeriodRAB = rabs.find(rab => rab.periode_id === currentPeriodeId);
  const isEditMode = currentPeriodRAB && currentPeriodRAB.status === 'revisi';
  
  // Pre-populate pemasukan and pengeluaran if editing
  useEffect(() => {
    if (isEditMode) {
      // Assuming currentPeriodRAB contains `pemasukan` and `pengeluaran` arrays
      setPemasukan(currentPeriodRAB.rabPemasukan || []);
      setPengeluaran(currentPeriodRAB.rabPengeluaran || []);
    }
  }, [isEditMode, currentPeriodRAB]);
  
  const handleAddPemasukan = () => {
    if (!newPemasukan.nama || !newPemasukan.nominal) {
      toast.error('Nama dan nominal harus diisi');
      return;
    }
    
    setPemasukan([...pemasukan, {
      nama: newPemasukan.nama,
      nominal: Number(newPemasukan.nominal)
    }]);
    
    setNewPemasukan({ nama: '', nominal: '' });
    toast.success('Item pemasukan berhasil ditambahkan');
  };
  
  const handleAddPengeluaran = () => {
    if (!newPengeluaran.kategori || !newPengeluaran.nama || !newPengeluaran.nominal) {
      toast.error('Kategori, nama, dan nominal harus diisi');
      return;
    }
    
    setPengeluaran([...pengeluaran, {
      kategori: newPengeluaran.kategori,
      nama: newPengeluaran.nama,
      detail: newPengeluaran.detail,
      nominal: Number(newPengeluaran.nominal)
    }]);
    
    setNewPengeluaran({ kategori: 'Ukhro', nama: '', detail: '', nominal: '' });
    toast.success('Item pengeluaran berhasil ditambahkan');
  };
  
  const handleDeletePemasukan = (index: number) => {
    const newItems = [...pemasukan];
    newItems.splice(index, 1);
    setPemasukan(newItems);
    toast.success('Item pemasukan berhasil dihapus');
  };
  
  const handleDeletePengeluaran = (index: number) => {
    const newItems = [...pengeluaran];
    newItems.splice(index, 1);
    setPengeluaran(newItems);
    toast.success('Item pengeluaran berhasil dihapus');
  };
  
  const handleCreateOrSubmitRAB = async () => {
    if (!currentPeriodeId || !pondokId) {
      toast.error('Periode RAB atau data pondok tidak tersedia');
      return;
    }
    
    if (pemasukan.length === 0 || pengeluaran.length === 0) {
      toast.error('RAB harus memiliki minimal 1 pemasukan dan 1 pengeluaran');
      return;
    }
    
    try {
      setIsCreating(true);
      let isSuccess = false;
      let rabId = '';
      
      // If the RAB is in revisi state, update it using updateRABMutation.
      if (isEditMode) {
        isSuccess = await updateRABMutation.mutateAsync({
          rabId: currentPeriodRAB.id,
          rabData: {}, // Add any additional fields to update as needed
          pemasukan,
          pengeluaran,
        });
      } else {
        rabId = await createRABMutation.mutateAsync({
          periodeId: currentPeriodeId,
          pemasukan,
          pengeluaran,
        });
      }
      
      if (isSuccess || rabId) {
        toast.success('RAB berhasil disimpan');
        navigate(`/pondok/rab/detail/${currentPeriodRAB?.id || rabId}`, { replace: true });
      }
    } catch (error) {
      console.error('Failed to submit RAB:', error);
      toast.error('Gagal menyimpan RAB');
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

  // Calculate totals
  const totalPemasukan = pemasukan.reduce((sum, item) => sum + item.nominal, 0);
  const totalPengeluaran = pengeluaran.reduce((sum, item) => sum + item.nominal, 0);
  const saldo = totalPemasukan - totalPengeluaran;
  
  if (isLoading || isLoadingRabs) {
    return (
      <div className="flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // If there is a RAB and it's not in revisi status, show the alert and redirect option.
  if (!isEditMode) {
    return (
      <div className='space-y-6'>
        <PageHeader
          title="Rencana Anggaran Biaya"
          description="Buat dan kelola RAB Pondok"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/pondok/rab/detail/${currentPeriodRAB.id}`, { replace: true })}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Batal
          </Button>
        </PageHeader>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>RAB sudah dibuat</AlertTitle>
          <AlertDescription>
            Anda sudah membuat RAB untuk periode ini. Silakan lihat detail RAB yang ada.
          </AlertDescription>
        </Alert>
        <div className="flex justify-center mt-4">
          <Button onClick={() => navigate(`/pondok/rab/detail/${currentPeriodRAB.id}`, { replace: true })}>
            Lihat Detail RAB
          </Button>
        </div>
      </div>
    );
  }

  // Render edit form when there's no RAB or when the existing RAB is in "revisi" state.
  return (
    <div className='space-y-6'>
      <PageHeader 
        title="Rencana Anggaran Biaya"
        description={`Buat RAB untuk periode ${currentPeriodeId?.substring(0, 4) || ''}-${currentPeriodeId?.substring(4, 6) || ''}`}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/pondok/rab/detail/${currentPeriodRAB.id}`, { replace: true })}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Batal
        </Button>
      </PageHeader>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {isEditMode ? 'Edit RAB' : 'Buat RAB Baru'}
          </CardTitle>
          <Button onClick={handleCreateOrSubmitRAB} disabled={isCreating || pemasukan.length === 0 || pengeluaran.length === 0}>
            <Save className="w-4 h-4 mr-2" />
            {isEditMode ? 'Simpan Perubahan' : 'Simpan RAB'}
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pemasukan" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="pemasukan">Pemasukan</TabsTrigger>
              <TabsTrigger value="pengeluaran">Pengeluaran</TabsTrigger>
              <TabsTrigger value="summary">Ringkasan</TabsTrigger>
            </TabsList>
            
            {/* Pemasukan Tab */}
            <TabsContent value="pemasukan" className="space-y-4">
              <div className="flex flex-col md:flex-row gap-2 pb-4">
                <Input 
                  placeholder="Nama Pemasukan" 
                  value={newPemasukan.nama}
                  onChange={(e) => setNewPemasukan({ ...newPemasukan, nama: e.target.value })}
                />
                <Input 
                  placeholder="Nominal" 
                  type="number"
                  value={newPemasukan.nominal}
                  onChange={(e) => setNewPemasukan({ ...newPemasukan, nominal: e.target.value })}
                />
                <Button onClick={handleAddPemasukan}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah
                </Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nama Pemasukan</TableHead>
                    <TableHead className="text-right">Nominal</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pemasukan.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        Belum ada data pemasukan
                      </TableCell>
                    </TableRow>
                  ) : (
                    pemasukan.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          {isEditMode ? (
                            <Input 
                              value={item.nama}
                              onChange={(e) => {
                                const updated = [...pemasukan];
                                updated[index] = { ...updated[index], nama: e.target.value };
                                setPemasukan(updated);
                              }}
                            />
                          ) : (
                            item.nama
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {isEditMode ? (
                            <Input 
                              type="number"
                              value={item.nominal}
                              onChange={(e) => {
                                const updated = [...pemasukan];
                                updated[index] = { ...updated[index], nominal: Number(e.target.value) };
                                setPemasukan(updated);
                              }}
                              className="text-right"
                            />
                          ) : (
                            formatCurrency(item.nominal)
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleDeletePemasukan(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                  {pemasukan.length > 0 && (
                    <TableRow className="border-t-2">
                      <TableCell colSpan={2} className="font-bold">Total Pemasukan</TableCell>
                      <TableCell className="text-right font-bold">{formatCurrency(totalPemasukan)}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            
            {/* Pengeluaran Tab */}
            <TabsContent value="pengeluaran" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 pb-4">
                <Select 
                  value={newPengeluaran.kategori}
                  onValueChange={(value) => setNewPengeluaran({ ...newPengeluaran, kategori: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ukhro">Ukhro</SelectItem>
                    <SelectItem value="Sarana Prasarana">Sarana Prasarana</SelectItem>
                    <SelectItem value="Konsumsi">Konsumsi</SelectItem>
                    <SelectItem value="Administrasi">Administrasi</SelectItem>
                  </SelectContent>
                </Select>
                <Input 
                  placeholder="Nama Pengeluaran" 
                  value={newPengeluaran.nama}
                  onChange={(e) => setNewPengeluaran({ ...newPengeluaran, nama: e.target.value })}
                />
                <Input 
                  placeholder="Detail (opsional)" 
                  value={newPengeluaran.detail}
                  onChange={(e) => setNewPengeluaran({ ...newPengeluaran, detail: e.target.value })}
                />
                <div className="flex gap-2">
                  <Input 
                    placeholder="Nominal" 
                    type="number"
                    value={newPengeluaran.nominal}
                    onChange={(e) => setNewPengeluaran({ ...newPengeluaran, nominal: e.target.value })}
                  />
                  <Button onClick={handleAddPengeluaran}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Nama Pengeluaran</TableHead>
                    <TableHead>Detail</TableHead>
                    <TableHead className="text-right">Nominal</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pengeluaran.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        Belum ada data pengeluaran
                      </TableCell>
                    </TableRow>
                  ) : (
                    pengeluaran.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          {isEditMode ? (
                            <Select 
                              value={item.kategori}
                              onValueChange={(value) => {
                                const updated = [...pengeluaran];
                                updated[index] = { ...updated[index], kategori: value };
                                setPengeluaran(updated);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih Kategori" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Ukhro">Ukhro</SelectItem>
                                <SelectItem value="Sarana Prasarana">Sarana Prasarana</SelectItem>
                                <SelectItem value="Konsumsi">Konsumsi</SelectItem>
                                <SelectItem value="Administrasi">Administrasi</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            item.kategori
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditMode ? (
                            <Input 
                              value={item.nama}
                              onChange={(e) => {
                                const updated = [...pengeluaran];
                                updated[index] = { ...updated[index], nama: e.target.value };
                                setPengeluaran(updated);
                              }}
                            />
                          ) : (
                            item.nama
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditMode ? (
                            <Input 
                              value={item.detail}
                              onChange={(e) => {
                                const updated = [...pengeluaran];
                                updated[index] = { ...updated[index], detail: e.target.value };
                                setPengeluaran(updated);
                              }}
                            />
                          ) : (
                            item.detail || '-'
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {isEditMode ? (
                            <Input 
                              type="number"
                              value={item.nominal}
                              onChange={(e) => {
                                const updated = [...pengeluaran];
                                updated[index] = { ...updated[index], nominal: Number(e.target.value) };
                                setPengeluaran(updated);
                              }}
                              className="text-right"
                            />
                          ) : (
                            formatCurrency(item.nominal)
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleDeletePengeluaran(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                  {pengeluaran.length > 0 && (
                    <TableRow className="border-t-2">
                      <TableCell colSpan={4} className="font-bold">Total Pengeluaran</TableCell>
                      <TableCell className="text-right font-bold">{formatCurrency(totalPengeluaran)}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            
            {/* Summary Tab */}
            <TabsContent value="summary">
              <Card className="border-none shadow-none">
                <CardContent className="p-0">
                  <div className="grid gap-4">
                    <div className="bg-muted/30 p-4 rounded-md">
                      <h3 className="font-medium mb-2">Ringkasan Anggaran</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Total Pemasukan:</span>
                          <span className="font-medium">{formatCurrency(totalPemasukan)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Pengeluaran:</span>
                          <span className="font-medium">{formatCurrency(totalPengeluaran)}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-bold">
                          <span>Saldo Akhir:</span>
                          <span className={saldo >= 0 ? "text-green-600" : "text-red-600"}>
                            {formatCurrency(saldo)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {saldo < 0 && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Peringatan Saldo Negatif</AlertTitle>
                        <AlertDescription>
                          Total pengeluaran melebihi total pemasukan. Silakan sesuaikan RAB Anda.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleCreateOrSubmitRAB} 
                        disabled={isCreating || pemasukan.length === 0 || pengeluaran.length === 0}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isEditMode ? 'Simpan Perubahan' : 'Simpan RAB'}
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

export default PondokRABEdit;
