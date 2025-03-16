
import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle, 
  Clock, 
  Download, 
  Eye, 
  FileText, 
  Filter, 
  Search, 
  Trash2, 
  XCircle 
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const YayasanRAB = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPeriode, setSelectedPeriode] = useState('202306');

  // Mock data
  const rabList = [
    { 
      id: 'r1', 
      pondok: 'Pondok Al-Hikmah', 
      amount: 'Rp 15,000,000', 
      date: '2023-06-15',
      status: 'pending',
      periode: '202306',
    },
    { 
      id: 'r2', 
      pondok: 'Pondok Al-Ikhlas', 
      amount: 'Rp 12,500,000', 
      date: '2023-06-14',
      status: 'pending',
      periode: '202306',
    },
    { 
      id: 'r3', 
      pondok: 'Pondok Miftahul Jannah', 
      amount: 'Rp 18,200,000', 
      date: '2023-06-13',
      status: 'revision',
      periode: '202306',
    },
    { 
      id: 'r4', 
      pondok: 'Pondok Al-Barokah', 
      amount: 'Rp 14,500,000', 
      date: '2023-06-10',
      status: 'approved',
      periode: '202306',
    },
    { 
      id: 'r5', 
      pondok: 'Pondok Daarul Qur\'an', 
      amount: 'Rp 22,000,000', 
      date: '2023-05-25',
      status: 'approved',
      periode: '202305',
    },
  ];

  // Filter by search query, status and periode
  const filteredRAB = rabList.filter(rab => 
    (rab.pondok.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (statusFilter === 'all' || rab.status === statusFilter) &&
    (rab.periode === selectedPeriode)
  );

  const handleViewRAB = (id) => {
    toast({
      title: "Melihat Detail RAB",
      description: `Membuka detail RAB dengan ID: ${id}`,
    });
  };

  const handleApproveRAB = (id) => {
    toast({
      title: "Persetujuan RAB",
      description: `RAB dengan ID: ${id} telah disetujui`,
    });
  };

  const handleRevisionRAB = (id) => {
    toast({
      title: "Revisi RAB",
      description: `RAB dengan ID: ${id} memerlukan revisi`,
      variant: "destructive",
    });
  };

  const handleDownloadRAB = (id) => {
    toast({
      title: "Mengunduh RAB",
      description: `RAB dengan ID: ${id} sedang diunduh`,
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Disetujui</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">Menunggu</span>;
      case 'revision':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Perlu Revisi</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Manajemen RAB"
        description="Tinjau dan setujui Rencana Anggaran Biaya"
      />

      <Card>
        <CardHeader className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <CardTitle>Daftar RAB</CardTitle>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <Select defaultValue={selectedPeriode} onValueChange={setSelectedPeriode}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Pilih Periode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="202306">Juni 2023</SelectItem>
                <SelectItem value="202305">Mei 2023</SelectItem>
                <SelectItem value="202304">April 2023</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending">Menunggu</SelectItem>
                <SelectItem value="approved">Disetujui</SelectItem>
                <SelectItem value="revision">Perlu Revisi</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="relative w-full md:w-[240px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari RAB..."
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
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead className="hidden md:table-cell">Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Tindakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRAB.length > 0 ? (
                filteredRAB.map((rab, index) => (
                  <TableRow key={rab.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="font-medium">{rab.pondok}</div>
                      <div className="text-xs text-muted-foreground md:hidden">{rab.date}</div>
                    </TableCell>
                    <TableCell className="text-right">{rab.amount}</TableCell>
                    <TableCell className="hidden md:table-cell">{rab.date}</TableCell>
                    <TableCell>{getStatusBadge(rab.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewRAB(rab.id)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only md:not-sr-only md:ml-2">Lihat</span>
                        </Button>
                        
                        {rab.status === 'pending' && (
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
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleRevisionRAB(rab.id)}
                            >
                              <XCircle className="h-4 w-4" />
                              <span className="sr-only md:not-sr-only md:ml-2">Revisi</span>
                            </Button>
                          </>
                        )}
                        
                        {rab.status === 'approved' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadRAB(rab.id)}
                          >
                            <Download className="h-4 w-4" />
                            <span className="sr-only md:not-sr-only md:ml-2">Unduh</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <FileText className="h-8 w-8 mb-2" />
                      <p>Tidak ada RAB yang ditemukan</p>
                      <p className="text-sm">Coba ubah filter atau kata kunci pencarian</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Menunggu Persetujuan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rabList.filter(r => r.status === 'pending' && r.periode === selectedPeriode).length > 0 ? (
              rabList
                .filter(r => r.status === 'pending' && r.periode === selectedPeriode)
                .map((rab, index) => (
                  <div key={rab.id} className="flex items-center justify-between p-4 rounded-md bg-muted/50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{rab.pondok}</p>
                        <p className="text-xs text-muted-foreground">{rab.amount}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-sm text-muted-foreground">{rab.date}</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewRAB(rab.id)}
                      >
                        Review
                      </Button>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-6">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <Clock className="h-8 w-8 mb-2" />
                  <p>Tidak ada RAB yang menunggu persetujuan</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default YayasanRAB;
