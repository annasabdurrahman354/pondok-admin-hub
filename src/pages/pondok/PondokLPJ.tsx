
import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PondokLPJ = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('pemasukan');
  const [periode, setPeriode] = useState('202306');
  const [status, setStatus] = useState('draft');
  
  // Mock data based on RAB
  const [pemasukan, setPemasukan] = useState([
    { id: 1, nama: 'Shodaqoh', rencana: 5000000, realisasi: 4800000 },
    { id: 2, nama: 'Uang Sewa Santri', rencana: 15000000, realisasi: 15000000 },
  ]);
  
  const [pengeluaran, setPengeluaran] = useState([
    { id: 1, nama: 'Kebutuhan Dapur', rencana: 8000000, realisasi: 8200000 },
    { id: 2, nama: 'Listrik dan Air', rencana: 3000000, realisasi: 2800000 },
    { id: 3, nama: 'Gaji Pengajar', rencana: 7500000, realisasi: 7500000 },
  ]);
  
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChangeRealisasi = (id, type, value) => {
    if (type === 'pemasukan') {
      setPemasukan(pemasukan.map(item => 
        item.id === id ? { ...item, realisasi: parseInt(value) } : item
      ));
    } else {
      setPengeluaran(pengeluaran.map(item => 
        item.id === id ? { ...item, realisasi: parseInt(value) } : item
      ));
    }
  };

  const handleUploadBukti = () => {
    toast({
      title: "Bukti Berhasil Diunggah",
      description: "File bukti telah berhasil diunggah ke sistem",
    });
    setSelectedFile(null);
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

  const getPersentase = (realisasi, rencana) => {
    if (rencana === 0) return '0%';
    return `${Math.round((realisasi / rencana) * 100)}%`;
  };

  const totalRencanaPemasukan = pemasukan.reduce((sum, item) => sum + item.rencana, 0);
  const totalRealisasiPemasukan = pemasukan.reduce((sum, item) => sum + item.realisasi, 0);
  
  const totalRencanaPengeluaran = pengeluaran.reduce((sum, item) => sum + item.rencana, 0);
  const totalRealisasiPengeluaran = pengeluaran.reduce((sum, item) => sum + item.realisasi, 0);

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
                <Upload className="w-4 h-4 mr-2" />
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
                            onChange={(e) => handleChangeRealisasi(item.id, 'pemasukan', e.target.value)}
                            className="w-32 text-right ml-auto"
                          />
                        ) : (
                          formatCurrency(item.realisasi)
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {getPersentase(item.realisasi, item.rencana)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-t-2">
                    <TableCell colSpan={2} className="font-bold">Total Pemasukan</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(totalRencanaPemasukan)}</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(totalRealisasiPemasukan)}</TableCell>
                    <TableCell className="text-right font-bold">{getPersentase(totalRealisasiPemasukan, totalRencanaPemasukan)}</TableCell>
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
                    <TableHead className="text-right">Persentase</TableHead>
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
                            onChange={(e) => handleChangeRealisasi(item.id, 'pengeluaran', e.target.value)}
                            className="w-32 text-right ml-auto"
                          />
                        ) : (
                          formatCurrency(item.realisasi)
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {getPersentase(item.realisasi, item.rencana)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-t-2">
                    <TableCell colSpan={2} className="font-bold">Total Pengeluaran</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(totalRencanaPengeluaran)}</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(totalRealisasiPengeluaran)}</TableCell>
                    <TableCell className="text-right font-bold">{getPersentase(totalRealisasiPengeluaran, totalRencanaPengeluaran)}</TableCell>
                  </TableRow>
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
                        onChange={(e) => setSelectedFile(e.target.files[0])}
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
