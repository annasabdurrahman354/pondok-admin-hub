import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Building2, CheckCircle, FileDown, Eye, XCircle, Search
} from 'lucide-react';
import { 
  lpjList, pondokList, periodeList, 
  formatCurrency, formatPeriode, getStatusBadge 
} from '@/data/mockData';

const YayasanLPJ = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPondok, setSelectedPondok] = useState('all');
  const [selectedPeriode, setSelectedPeriode] = useState('all');
  const [revisionNote, setRevisionNote] = useState('');

  // Filter by search query, pondok, and periode
  const filteredLPJ = lpjList.filter(lpj => {
    const matchSearchQuery = lpj.pondok.toLowerCase().includes(searchQuery.toLowerCase());
    const matchPondok = selectedPondok === 'all' || lpj.pondok === selectedPondok;
    const matchPeriode = selectedPeriode === 'all' || lpj.periode === selectedPeriode;
    return matchSearchQuery && matchPondok && matchPeriode;
  });

  const handleViewLPJ = (lpjId) => {
    navigate(`/yayasan/lpj/${lpjId}`);
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
                    <TableCell>
                      <span className={getStatusBadge(lpj.status).className}>
                        {getStatusBadge(lpj.status).label}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewLPJ(lpj.id)}
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
    </div>
  );
};

export default YayasanLPJ;
