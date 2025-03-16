
import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Save, Send, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PondokLPJ = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('pemasukan');
  const [periode, setPeriode] = useState('202306');
  const [status, setStatus] = useState('draft');
  
  const [pemasukan, setPemasukan] = useState([
    { id: 1, nama: 'Shodaqoh', rencana: 5000000, realisasi: 5200000 },
    { id: 2, nama: 'Uang Sewa Santri', rencana: 15000000, realisasi: 14800000 },
  ]);
  
  const [pengeluaran, setPengeluaran] = useState([
    { id: 1, nama: 'Kebutuhan Dapur', rencana: 8000000, realisasi: 8250000 },
    { id: 2, nama: 'Listrik dan Air', rencana: 3000000, realisasi: 2850000 },
    { id: 3, nama: 'Gaji Pengajar', rencana: 7500000, realisasi: 7500000 },
  ]);

  const handleUpdateRealisasi = (id, value, type) => {
    if (type === 'pemasukan') {
      setPemasukan(pemasukan.map(item => 
        item.id === id ? {...item, realisasi: parseInt(value) || 0} : item
      ));
    } else {
      setPengeluaran(pengeluaran.map(item => 
        item.id === id ? {...item, realisasi: parseInt(value) || 0} : item
      ));
    }
  };

  const handleSubmit = () => {
    setStatus('diajukan');
    toast({
      title: "LPJ Berhasil Diajukan",
      description: "LPJ untuk periode Juni 2023 telah diajukan ke Yayasan",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculatePercentage = (realisasi, rencana) => {
    return rencana === 0 ? 0 : Math.round((realisasi / rencana) * 100);
  };

  const totalRencanaPemasukan = pemasukan.reduce((sum, item) => sum + item.rencana, 0);
  const totalRealisasiPemasukan = pemasukan.reduce((sum, item) => sum + item.realisasi, 0);
  
  const totalRencanaPengeluaran = pengeluaran.reduce((sum, item) => sum + item.rencana, 0);
  const totalRealisasiPengeluaran = pengeluaran.reduce((sum, item) => sum + item.realisasi, 0);
  
  const rencanaSaldo = totalRencanaPemasukan - totalRencanaPengeluaran;
  const realisasiSaldo = totalRealisasiPemasukan - totalRealisasiPengeluaran;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Laporan Pertanggungjawaban"
        description="Kelola LPJ untuk periode Juni 2023"
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Detail LPJ</CardTitle>
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
                Ajukan LPJ
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
              <TabsTrigger value="lampiran">Lampiran</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pemasukan" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nama Pemasukan</TableHead>
                    <TableHead className="text-right">Rencana</TableHead>
                    <TableHead className="text-right">Realisasi</TableHead>
                    <TableHead className="text-right">%</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pemasukan.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.nama}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.rencana)}</TableCell>
                      <TableCell className="text-right">
                        {status === 'draft' ? (
                          <Input 
                            type="number" 
                            value={item.realisasi}
                            onChange={(e) => handleUpdateRealisasi(item.id, e.target.value, 'pemasukan')}
                            className="w-32 text-right ml-auto"
                          />
                        ) : (
                          formatCurrency(item.realisasi)
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {calculatePercentage(item.realisasi, item.rencana)}%
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-t-2">
                    <TableCell colSpan={2} className="font-bold">Total Pemasukan</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(totalRencanaPemasukan)}</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(totalRealisasiPemasukan)}</TableCell>
                    <TableCell className="text-right font-bold">
                      {calculatePercentage(totalRealisasiPemasukan, totalRencanaPemasukan)}%
                    </TableCell>
                  </TableRow>
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
                    <TableHead className="text-right">%</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pengeluaran.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.nama}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.rencana)}</TableCell>
                      <TableCell className="text-right">
                        {status === 'draft' ? (
                          <Input 
                            type="number" 
                            value={item.realisasi}
                            onChange={(e) => handleUpdateRealisasi(item.id, e.target.value, 'pengeluaran')}
                            className="w-32 text-right ml-auto"
                          />
                        ) : (
                          formatCurrency(item.realisasi)
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {calculatePercentage(item.realisasi, item.rencana)}%
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-t-2">
                    <TableCell colSpan={2} className="font-bold">Total Pengeluaran</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(totalRencanaPengeluaran)}</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(totalRealisasiPengeluaran)}</TableCell>
                    <TableCell className="text-right font-bold">
                      {calculatePercentage(totalRealisasiPengeluaran, totalRencanaPengeluaran)}%
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="summary">
              <Card className="border-none shadow-none">
                <CardContent className="p-0">
                  <div className="grid gap-4">
                    <div className="bg-muted/30 p-4 rounded-md">
                      <h3 className="font-medium mb-2">Ringkasan Laporan</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Kategori</h4>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Rencana</h4>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Realisasi</h4>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <span>Total Pemasukan</span>
                          </div>
                          <div>
                            <span className="font-medium">{formatCurrency(totalRencanaPemasukan)}</span>
                          </div>
                          <div>
                            <span className="font-medium">{formatCurrency(totalRealisasiPemasukan)}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <span>Total Pengeluaran</span>
                          </div>
                          <div>
                            <span className="font-medium">{formatCurrency(totalRencanaPengeluaran)}</span>
                          </div>
                          <div>
                            <span className="font-medium">{formatCurrency(totalRealisasiPengeluaran)}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 border-t pt-2">
                          <div>
                            <span className="font-bold">Saldo Akhir</span>
                          </div>
                          <div>
                            <span className={`font-bold ${rencanaSaldo >= 0 ? "text-green-600" : "text-red-600"}`}>
                              {formatCurrency(rencanaSaldo)}
                            </span>
                          </div>
                          <div>
                            <span className={`font-bold ${realisasiSaldo >= 0 ? "text-green-600" : "text-red-600"}`}>
                              {formatCurrency(realisasiSaldo)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="lampiran">
              <div className="grid gap-4">
                <div className="bg-muted/30 p-6 rounded-md flex flex-col items-center justify-center">
                  <FileText className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg mb-2">Upload Bukti Pendukung</h3>
                  <p className="text-sm text-muted-foreground mb-4 text-center">
                    Upload nota, kwitansi, dan dokumen pendukung LPJ dalam format PDF, JPG, atau PNG
                  </p>
                  <Button variant="outline" className="mb-2">
                    <Upload className="w-4 h-4 mr-2" />
                    Pilih Berkas
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Maksimal 5MB per file
                  </p>
                </div>
                
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Lampiran yang Diunggah</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Nota Belanja Dapur.pdf</span>
                      </div>
                      <span className="text-xs text-muted-foreground">1.2 MB</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Bukti Transfer Gaji.jpg</span>
                      </div>
                      <span className="text-xs text-muted-foreground">0.8 MB</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PondokLPJ;
