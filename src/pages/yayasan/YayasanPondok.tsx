
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Building2, CheckCircle, Clock, Eye, Search, XCircle } from 'lucide-react';
import { pondokList, getStatusBadge } from '@/data/mockData';

const YayasanPondok = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter by search query
  const filteredPondok = pondokList.filter(pondok => 
    pondok.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pondok.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewPondok = (id) => {
    navigate(`/yayasan/pondok/${id}`);
  };

  const handleApprovePondok = (id) => {
    toast({
      title: "Persetujuan Pondok",
      description: `Pondok dengan ID: ${id} telah disetujui`,
    });
  };

  const handleRejectPondok = (id) => {
    toast({
      title: "Penolakan Pondok",
      description: `Pondok dengan ID: ${id} telah ditolak`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Manajemen Pondok"
        description="Kelola dan pantau pondok dalam sistem"
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Daftar Pondok</CardTitle>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari pondok..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">No</TableHead>
                <TableHead>Nama Pondok</TableHead>
                <TableHead className="hidden md:table-cell">Lokasi</TableHead>
                <TableHead className="hidden md:table-cell">Jumlah Santri</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tindakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPondok.length > 0 ? (
                filteredPondok.map((pondok, index) => (
                  <TableRow key={pondok.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="font-medium">{pondok.name}</div>
                      <div className="text-xs text-muted-foreground md:hidden">{pondok.location}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{pondok.location}</TableCell>
                    <TableCell className="hidden md:table-cell">{pondok.santriCount}</TableCell>
                    <TableCell>
                      {/* Use the updated statusBadge format */}
                      <span className={getStatusBadge(pondok.status).className}>
                        {getStatusBadge(pondok.status).label}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewPondok(pondok.id)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only md:not-sr-only md:ml-2">Lihat</span>
                        </Button>
                        
                        {pondok.status === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => handleApprovePondok(pondok.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span className="sr-only md:not-sr-only md:ml-2">Setuju</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleRejectPondok(pondok.id)}
                            >
                              <XCircle className="h-4 w-4" />
                              <span className="sr-only md:not-sr-only md:ml-2">Tolak</span>
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Building2 className="h-8 w-8 mb-2" />
                      <p>Tidak ada pondok yang ditemukan</p>
                      <p className="text-sm">Coba dengan kata kunci lain</p>
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
          <CardTitle>Persetujuan Pondok Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pondokList.filter(p => p.status === 'pending').length > 0 ? (
              pondokList.filter(p => p.status === 'pending').map((pondok, index) => (
                <div key={pondok.id} className="flex items-center justify-between p-4 rounded-md bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{pondok.name}</p>
                      <p className="text-xs text-muted-foreground">{pondok.location}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-sm text-muted-foreground">{pondok.date}</span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewPondok(pondok.id)}
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
                  <p>Tidak ada pondok yang menunggu persetujuan</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default YayasanPondok;
