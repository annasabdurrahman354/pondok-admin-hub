
import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Save, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PondokRAB = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('pemasukan');
  const [periode, setPeriode] = useState('202306');
  const [status, setStatus] = useState('draft');
  const [pemasukan, setPemasukan] = useState([
    { id: 1, nama: 'Shodaqoh', nominal: 5000000 },
    { id: 2, nama: 'Uang Sewa Santri', nominal: 15000000 },
  ]);
  const [pengeluaran, setPengeluaran] = useState([
    { id: 1, nama: 'Kebutuhan Dapur', nominal: 8000000 },
    { id: 2, nama: 'Listrik dan Air', nominal: 3000000 },
    { id: 3, nama: 'Gaji Pengajar', nominal: 7500000 },
  ]);
  const [newItem, setNewItem] = useState({ nama: '', nominal: '' });

  const handleAddItem = () => {
    if (!newItem.nama || !newItem.nominal) {
      toast({
        title: "Validasi Gagal",
        description: "Nama dan nominal harus diisi",
        variant: "destructive",
      });
      return;
    }

    if (activeTab === 'pemasukan') {
      setPemasukan([...pemasukan, { 
        id: pemasukan.length + 1, 
        nama: newItem.nama, 
        nominal: parseInt(newItem.nominal) 
      }]);
    } else {
      setPengeluaran([...pengeluaran, { 
        id: pengeluaran.length + 1, 
        nama: newItem.nama, 
        nominal: parseInt(newItem.nominal) 
      }]);
    }

    setNewItem({ nama: '', nominal: '' });
    
    toast({
      title: "Item Berhasil Ditambahkan",
      description: `Item ${newItem.nama} telah ditambahkan ke ${activeTab}`,
    });
  };

  const handleSubmit = () => {
    setStatus('diajukan');
    toast({
      title: "RAB Berhasil Diajukan",
      description: "RAB untuk periode Juni 2023 telah diajukan ke Yayasan",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const totalPemasukan = pemasukan.reduce((sum, item) => sum + item.nominal, 0);
  const totalPengeluaran = pengeluaran.reduce((sum, item) => sum + item.nominal, 0);
  const saldo = totalPemasukan - totalPengeluaran;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Rencana Anggaran Biaya"
        description="Kelola RAB untuk periode Juni 2023"
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Detail RAB</CardTitle>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs rounded-full ${
              status === 'draft' ? 'bg-muted text-muted-foreground' :
              status === 'diajukan' ? 'bg-amber-100 text-amber-800' :
              status === 'diterima' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {status === 'draft' ? 'Draft' :
               status === 'diajukan' ? 'Diajukan' :
               status === 'diterima' ? 'Diterima' : 'Revisi'}
            </span>
            {status === 'draft' && (
              <Button onClick={handleSubmit} size="sm">
                <Send className="w-4 h-4 mr-2" />
                Ajukan RAB
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pemasukan" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="pemasukan">Pemasukan</TabsTrigger>
              <TabsTrigger value="pengeluaran">Pengeluaran</TabsTrigger>
              <TabsTrigger value="summary">Ringkasan</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pemasukan" className="space-y-4">
              {status === 'draft' && (
                <div className="flex gap-2 pb-4">
                  <Input 
                    placeholder="Nama Pemasukan" 
                    value={newItem.nama}
                    onChange={(e) => setNewItem({...newItem, nama: e.target.value})}
                  />
                  <Input 
                    placeholder="Nominal" 
                    type="number"
                    value={newItem.nominal}
                    onChange={(e) => setNewItem({...newItem, nominal: e.target.value})}
                  />
                  <Button onClick={handleAddItem}>
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah
                  </Button>
                </div>
              )}
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nama Pemasukan</TableHead>
                    <TableHead className="text-right">Nominal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pemasukan.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.nama}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.nominal)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-t-2">
                    <TableCell colSpan={2} className="font-bold">Total Pemasukan</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(totalPemasukan)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="pengeluaran" className="space-y-4">
              {status === 'draft' && (
                <div className="flex gap-2 pb-4">
                  <Input 
                    placeholder="Nama Pengeluaran" 
                    value={newItem.nama}
                    onChange={(e) => setNewItem({...newItem, nama: e.target.value})}
                  />
                  <Input 
                    placeholder="Nominal" 
                    type="number"
                    value={newItem.nominal}
                    onChange={(e) => setNewItem({...newItem, nominal: e.target.value})}
                  />
                  <Button onClick={handleAddItem}>
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah
                  </Button>
                </div>
              )}
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nama Pengeluaran</TableHead>
                    <TableHead className="text-right">Nominal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pengeluaran.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.nama}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.nominal)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-t-2">
                    <TableCell colSpan={2} className="font-bold">Total Pengeluaran</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(totalPengeluaran)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
            
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

export default PondokRAB;
