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
  Building2, CheckCircle, Download, FileSpreadsheet, 
  PieChart, Search, XCircle 
} from 'lucide-react';
import { 
  rabList, pondokList, periodeList, 
  formatCurrency, formatPeriode, getStatusBadge 
} from '@/data/mockData';

const YayasanRAB = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPondok, setSelectedPondok] = useState('all');
  const [selectedPeriode, setSelectedPeriode] = useState('all');
  const [revisionNote, setRevisionNote] = useState('');

  // Filter by search query, pondok, and periode
  const filteredRAB = rabList.filter(rab => {
    const matchSearchQuery = rab.pondok.toLowerCase().includes(searchQuery.toLowerCase());
    const matchPondok = selectedPondok === 'all' || rab.pondok === selectedPondok;
    const matchPeriode = selectedPeriode === 'all' || rab.periode === selectedPeriode;
    return matchSearchQuery && matchPondok && matchPeriode;
  });

  const handleViewRAB = (rabId) => {
    navigate(`/yayasan/rab/${rabId}`);
  };

  const handleApproveRAB = (id) => {
    toast({
      title: "RAB Disetujui",
      description: `RAB dengan ID: ${id} telah disetujui`,
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
      description: `Catatan revisi untuk RAB dengan ID: ${id} telah dikirim`,
    });
    
    setRevisionNote('');
  };

  const handleExportData = (id) => {
    toast({
      title: "Data Diekspor",
      description: `Data RAB dengan ID: ${id} telah diekspor ke Excel`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Review RAB"
        description="Tinjau dan proses RAB dari pondok"
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Daftar RAB</CardTitle>
          
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
                <TableHead className="hidden md:table-cell">Total Pemasukan</TableHead>
                <TableHead className="hidden md:table-cell">Total Pengeluaran</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tindakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRAB.length > 0 ? (
                filteredRAB.map((rab, index) => (
                  <TableRow key={rab.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="font-medium">{rab.pondok}</div>
                      <div className="text-xs text-muted-foreground md:hidden">
                        {formatPeriode(rab.periode)} • {rab.tanggal}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{formatPeriode(rab.periode)}</TableCell>
                    <TableCell className="hidden md:table-cell">{rab.tanggal}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatCurrency(rab.totalPemasukan)}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatCurrency(rab.totalPengeluaran)}</TableCell>
                    <TableCell>
                      <span className={getStatusBadge(rab.status).className}>
                        {getStatusBadge(rab.status).label}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewRAB(rab.id)}
                        >
                          <PieChart className="h-4 w-4" />
                          <span className="sr-only md:not-sr-only md:ml-2">Detail</span>
                        </Button>
                        
                        {rab.status === 'diajukan' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => handleApproveRAB(rab.id)}
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
                                  <DialogTitle>Kirim Revisi RAB</DialogTitle>
                                  <DialogDescription>
                                    Tambahkan catatan untuk revisi RAB dari {rab.pondok}
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
                                    onClick={() => handleSubmitRevision(rab.id)}
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
                          onClick={() => handleExportData(rab.id)}
                        >
                          <FileSpreadsheet className="h-4 w-4" />
                          <span className="sr-only md:not-sr-only md:ml-2">Ekspor</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Building2 className="h-8 w-8 mb-2" />
                      <p>Tidak ada RAB yang ditemukan</p>
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

export default YayasanRAB;
