
import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Building2, CheckCircle, Download, Eye, FileDown, 
  Filter, PieChart, Search, SlidersHorizontal, XCircle 
} from 'lucide-react';

const YayasanLPJ = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPondok, setSelectedPondok] = useState('all');
  const [selectedPeriode, setSelectedPeriode] = useState('all');
  const [selectedLPJ, setSelectedLPJ] = useState(null);
  const [revisionNote, setRevisionNote] = useState('');

  // Mock data
  const lpjList = [
    { 
      id: 'lpj1', 
      pondok: 'Pondok Al-Hikmah', 
      periode: '202305', 
      tanggal: '2023-06-15',
      status: 'diajukan',
      totalRencanaPemasukan: 20000000,
      totalRealisasiPemasukan: 19200000,
      totalRencanaPengeluaran: 18500000,
      totalRealisasiPengeluaran: 18300000,
      bukti: 'bukti_lpj_alhikmah_202305.pdf'
    },
    { 
      id: 'lpj2', 
      pondok: 'Pondok Daarul Qur\'an', 
      periode: '202305', 
      tanggal: '2023-06-18',
      status: 'revisi',
      totalRencanaPemasukan: 15000000,
      totalRealisasiPemasukan: 14800000,
      totalRencanaPengeluaran: 13800000,
      totalRealisasiPengeluaran: 14200000,
      bukti: 'bukti_lpj_dq_202305.pdf'
    },
    { 
      id: 'lpj3', 
      pondok: 'Pondok Al-Barokah', 
      periode: '202305', 
      tanggal: '2023-06-10',
      status: 'diterima',
      totalRencanaPemasukan: 25000000,
      totalRealisasiPemasukan: 24800000,
      totalRencanaPengeluaran: 23500000,
      totalRealisasiPengeluaran: 23100000,
      bukti: 'bukti_lpj_albarokah_202305.pdf'
    },
    { 
      id: 'lpj4', 
      pondok: 'Pondok Nurul Hidayah', 
      periode: '202304', 
      tanggal: '2023-05-15',
      status: 'diterima',
      totalRencanaPemasukan: 18000000,
      totalRealisasiPemasukan: 18000000,
      totalRencanaPengeluaran: 16500000,
      totalRealisasiPengeluaran: 16400000,
      bukti: 'bukti_lpj_nurulhidayah_202304.pdf'
    },
  ];

  const pondokList = [
    { id: 'p1', name: 'Pondok Al-Hikmah' },
    { id: 'p2', name: 'Pondok Daarul Qur\'an' },
    { id: 'p3', name: 'Pondok Al-Barokah' },
    { id: 'p4', name: 'Pondok Nurul Hidayah' },
  ];

  const periodeList = [
    { id: '202306', name: 'Juni 2023' },
    { id: '202305', name: 'Mei 2023' },
    { id: '202304', name: 'April 2023' },
  ];

  // Filter by search query, pondok, and periode
  const filteredLPJ = lpjList.filter(lpj => {
    const matchSearchQuery = lpj.pondok.toLowerCase().includes(searchQuery.toLowerCase());
    const matchPondok = selectedPondok === 'all' || lpj.pondok === selectedPondok;
    const matchPeriode = selectedPeriode === 'all' || lpj.periode === selectedPeriode;
    return matchSearchQuery && matchPondok && matchPeriode;
  });

  const handleViewLPJ = (lpj) => {
    setSelectedLPJ(lpj);
  };

  const handleApproveLPJ = (id) => {
    toast({
      title: "LPJ Disetujui",
      description: `LPJ dengan ID: ${id} telah disetujui`,
    });
  };

  const handleSubmitRevision = (id) => {
    if (!revisionNote.trim()) {
      toast({
        title: "Catatan Revisi Kosong",
        description: "Harap masukkan catatan revisi untuk ditambahkan",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Revisi Dikirim",
      description: `Catatan revisi untuk LPJ dengan ID: ${id} telah dikirim`,
    });
    
    setRevisionNote('');
  };

  const handleDownloadBukti = (bukti) => {
    toast({
      title: "Bukti Diunduh",
      description: `File bukti ${bukti} telah diunduh`,
    });
  };

  const handleExportData = (id) => {
    toast({
      title: "Data Diekspor",
      description: `Data LPJ dengan ID: ${id} telah diekspor ke Excel`,
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPeriode = (periode) => {
    const year = periode.substring(0, 4);
    const month = periode.substring(4, 6);
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'diajukan':
        return <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">Diajukan</span>;
      case 'revisi':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Revisi</span>;
      case 'diterima':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Diterima</span>;
      default:
        return null;
    }
  };

  const getPersentase = (realisasi, rencana) => {
    if (rencana === 0) return '0%';
    return `${Math.round((realisasi / rencana) * 100)}%`;
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Review LPJ"
        description="Tinjau dan proses LPJ dari pondok"
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Daftar LPJ</CardTitle>
          
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex gap-2">
              <div>
                <select 
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={selectedPondok}
                  onChange={(e) => setSelectedPondok(e.target.value)}
                >
                  <option value="all">Semua Pondok</option>
                  {pondokList.map(pondok => (
                    <option key={pondok.id} value={pondok.name}>{pondok.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <select 
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={selectedPeriode}
                  onChange={(e) => setSelectedPeriode(e.target.value)}
                >
                  <option value="all">Semua Periode</option>
                  {periodeList.map(periode => (
                    <option key={periode.id} value={periode.id}>{periode.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari pondok..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">No</TableHead>
                <TableHead>Pondok</TableHead>
                <TableHead className="hidden md:table-cell">Periode</TableHead>
                <TableHead className="hidden md:table-cell">Tanggal</TableHead>
                <TableHead className="hidden lg:table-cell">Saldo Akhir</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tindakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLPJ.length > 0 ? (
                filteredLPJ.map((lpj, index) => (
                  <TableRow key={lpj.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="font-medium">{lpj.pondok}</div>
                      <div className="text-xs text-muted-foreground md:hidden">
                        {formatPeriode(lpj.periode)} • {lpj.tanggal}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{formatPeriode(lpj.periode)}</TableCell>
                    <TableCell className="hidden md:table-cell">{lpj.tanggal}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className={lpj.totalRealisasiPemasukan - lpj.totalRealisasiPengeluaran >= 0 ? "text-green-600" : "text-red-600"}>
                        {formatCurrency(lpj.totalRealisasiPemasukan - lpj.totalRealisasiPengeluaran)}
                      </span>
                    </TableCell>
                    <TableCell>{getStatusBadge(lpj.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewLPJ(lpj)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only md:not-sr-only md:ml-2">Detail</span>
                        </Button>
                        
                        {lpj.status === 'diajukan' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => handleApproveLPJ(lpj.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span className="sr-only md:not-sr-only md:ml-2">Setuju</span>
                            </Button>
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <XCircle className="h-4 w-4" />
                                  <span className="sr-only md:not-sr-only md:ml-2">Revisi</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Kirim Revisi LPJ</DialogTitle>
                                  <DialogDescription>
                                    Tambahkan catatan untuk revisi LPJ dari {lpj.pondok}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div>
                                    <label htmlFor="revision-note" className="text-sm font-medium">
                                      Catatan Revisi
                                    </label>
                                    <Textarea
                                      id="revision-note"
                                      placeholder="Masukkan catatan revisi untuk pondok"
                                      value={revisionNote}
                                      onChange={(e) => setRevisionNote(e.target.value)}
                                      rows={5}
                                    />
                                  </div>
                                  <Button 
                                    className="w-full" 
                                    onClick={() => handleSubmitRevision(lpj.id)}
                                  >
                                    Kirim Revisi
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </>
                        )}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadBukti(lpj.bukti)}
                        >
                          <FileDown className="h-4 w-4" />
                          <span className="sr-only md:not-sr-only md:ml-2">Bukti</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Building2 className="h-8 w-8 mb-2" />
                      <p>Tidak ada LPJ yang ditemukan</p>
                      <p className="text-sm">Coba dengan filter lain atau ulangi pencarian</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedLPJ && (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Detail LPJ {selectedLPJ.pondok}</span>
              <Button variant="outline" size="sm" onClick={() => setSelectedLPJ(null)}>
                Tutup Detail
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted/50 p-4 rounded-md">
                  <div className="text-sm text-muted-foreground">Pondok</div>
                  <div className="text-lg font-medium">{selectedLPJ.pondok}</div>
                </div>
                <div className="bg-muted/50 p-4 rounded-md">
                  <div className="text-sm text-muted-foreground">Periode</div>
                  <div className="text-lg font-medium">{formatPeriode(selectedLPJ.periode)}</div>
                </div>
                <div className="bg-muted/50 p-4 rounded-md">
                  <div className="text-sm text-muted-foreground">Status</div>
                  <div className="text-lg font-medium">{getStatusBadge(selectedLPJ.status)}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Pemasukan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Rencana:</span>
                      <span className="text-sm font-medium">{formatCurrency(selectedLPJ.totalRencanaPemasukan)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Realisasi:</span>
                      <span className="text-sm font-medium">{formatCurrency(selectedLPJ.totalRealisasiPemasukan)}</span>
                    </div>
                    <div className="flex justify-between mt-2 pb-2 border-b">
                      <span className="text-sm">Persentase:</span>
                      <span className="text-sm font-medium">
                        {getPersentase(selectedLPJ.totalRealisasiPemasukan, selectedLPJ.totalRencanaPemasukan)}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-green-600 mt-2">
                      {formatCurrency(selectedLPJ.totalRealisasiPemasukan)}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Pengeluaran</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Rencana:</span>
                      <span className="text-sm font-medium">{formatCurrency(selectedLPJ.totalRencanaPengeluaran)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Realisasi:</span>
                      <span className="text-sm font-medium">{formatCurrency(selectedLPJ.totalRealisasiPengeluaran)}</span>
                    </div>
                    <div className="flex justify-between mt-2 pb-2 border-b">
                      <span className="text-sm">Persentase:</span>
                      <span className="text-sm font-medium">
                        {getPersentase(selectedLPJ.totalRealisasiPengeluaran, selectedLPJ.totalRencanaPengeluaran)}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-red-600 mt-2">
                      {formatCurrency(selectedLPJ.totalRealisasiPengeluaran)}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-md">
                <div>
                  <div className="text-sm text-muted-foreground">Saldo Akhir (Realisasi)</div>
                  <div className={`text-xl font-bold ${selectedLPJ.totalRealisasiPemasukan - selectedLPJ.totalRealisasiPengeluaran >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(selectedLPJ.totalRealisasiPemasukan - selectedLPJ.totalRealisasiPengeluaran)}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleDownloadBukti(selectedLPJ.bukti)}
                    className="gap-2"
                  >
                    <FileDown className="h-4 w-4" />
                    Unduh Bukti
                  </Button>
                  <Button onClick={() => handleExportData(selectedLPJ.id)} className="gap-2">
                    <Download className="h-4 w-4" />
                    Unduh LPJ Lengkap
                  </Button>
                </div>
              </div>
              
              {selectedLPJ.status === 'diajukan' && (
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    className="text-green-600 border-green-600 hover:bg-green-50"
                    onClick={() => handleApproveLPJ(selectedLPJ.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Setujui LPJ
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Kirim Revisi
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Kirim Revisi LPJ</DialogTitle>
                        <DialogDescription>
                          Tambahkan catatan untuk revisi LPJ dari {selectedLPJ.pondok}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <label htmlFor="revision-note-detail" className="text-sm font-medium">
                            Catatan Revisi
                          </label>
                          <Textarea
                            id="revision-note-detail"
                            placeholder="Masukkan catatan revisi untuk pondok"
                            value={revisionNote}
                            onChange={(e) => setRevisionNote(e.target.value)}
                            rows={5}
                          />
                        </div>
                        <Button 
                          className="w-full" 
                          onClick={() => handleSubmitRevision(selectedLPJ.id)}
                        >
                          Kirim Revisi
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default YayasanLPJ;
