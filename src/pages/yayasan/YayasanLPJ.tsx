
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
  Paperclip,
  Search, 
  XCircle 
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const YayasanLPJ = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPeriode, setSelectedPeriode] = useState('202306');

  // Mock data
  const lpjList = [
    { 
      id: 'l1', 
      pondok: 'Pondok Al-Barokah', 
      amount: 'Rp 14,500,000', 
      date: '2023-06-05',
      status: 'pending',
      periode: '202306',
      hasAttachments: true,
    },
    { 
      id: 'l2', 
      pondok: 'Pondok Al-Hikmah', 
      amount: 'Rp 15,200,000', 
      date: '2023-06-04',
      status: 'approved',
      periode: '202306',
      hasAttachments: true,
    },
    { 
      id: 'l3', 
      pondok: 'Pondok Miftahul Jannah', 
      amount: 'Rp 18,000,000', 
      date: '2023-06-03',
      status: 'revision',
      periode: '202306',
      hasAttachments: true,
    },
    { 
      id: 'l4', 
      pondok: 'Pondok Al-Ikhlas', 
      amount: 'Rp 12,800,000', 
      date: '2023-05-28',
      status: 'approved',
      periode: '202305',
      hasAttachments: true,
    },
  ];

  // Filter by search query, status and periode
  const filteredLPJ = lpjList.filter(lpj => 
    (lpj.pondok.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (statusFilter === 'all' || lpj.status === statusFilter) &&
    (lpj.periode === selectedPeriode)
  );

  const handleViewLPJ = (id) => {
    toast({
      title: "Melihat Detail LPJ",
      description: `Membuka detail LPJ dengan ID: ${id}`,
    });
  };

  const handleApproveLPJ = (id) => {
    toast({
      title: "Persetujuan LPJ",
      description: `LPJ dengan ID: ${id} telah disetujui`,
    });
  };

  const handleRevisionLPJ = (id) => {
    toast({
      title: "Revisi LPJ",
      description: `LPJ dengan ID: ${id} memerlukan revisi`,
      variant: "destructive",
    });
  };

  const handleDownloadLPJ = (id) => {
    toast({
      title: "Mengunduh LPJ",
      description: `LPJ dengan ID: ${id} sedang diunduh`,
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
        title="Manajemen LPJ"
        description="Tinjau dan setujui Laporan Pertanggungjawaban"
      />

      <Card>
        <CardHeader className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <CardTitle>Daftar LPJ</CardTitle>
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
                placeholder="Cari LPJ..."
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
                <TableHead className="hidden md:table-cell">Lampiran</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Tindakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLPJ.length > 0 ? (
                filteredLPJ.map((lpj, index) => (
                  <TableRow key={lpj.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="font-medium">{lpj.pondok}</div>
                      <div className="text-xs text-muted-foreground md:hidden">{lpj.date}</div>
                    </TableCell>
                    <TableCell className="text-right">{lpj.amount}</TableCell>
                    <TableCell className="hidden md:table-cell">{lpj.date}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {lpj.hasAttachments && (
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(lpj.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewLPJ(lpj.id)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only md:not-sr-only md:ml-2">Lihat</span>
                        </Button>
                        
                        {lpj.status === 'pending' && (
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
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleRevisionLPJ(lpj.id)}
                            >
                              <XCircle className="h-4 w-4" />
                              <span className="sr-only md:not-sr-only md:ml-2">Revisi</span>
                            </Button>
                          </>
                        )}
                        
                        {lpj.status === 'approved' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadLPJ(lpj.id)}
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
                  <TableCell colSpan={7} className="text-center py-6">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <FileText className="h-8 w-8 mb-2" />
                      <p>Tidak ada LPJ yang ditemukan</p>
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
            {lpjList.filter(l => l.status === 'pending' && l.periode === selectedPeriode).length > 0 ? (
              lpjList
                .filter(l => l.status === 'pending' && l.periode === selectedPeriode)
                .map((lpj, index) => (
                  <div key={lpj.id} className="flex items-center justify-between p-4 rounded-md bg-muted/50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{lpj.pondok}</p>
                        <p className="text-xs text-muted-foreground">{lpj.amount}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-sm text-muted-foreground">{lpj.date}</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewLPJ(lpj.id)}
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
                  <p>Tidak ada LPJ yang menunggu persetujuan</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default YayasanLPJ;
