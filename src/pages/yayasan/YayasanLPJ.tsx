
import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from 'react-router-dom';
import { useGetAllLPJs, useGetAllPondoks } from '@/hooks/use-yayasan-data';
import { formatDate } from '@/services/formatUtils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

const YayasanLPJ = () => {
  const [activeTab, setActiveTab] = useState('diajukan');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPondok, setSelectedPondok] = useState('all');
  
  const { data: lpjs, isLoading } = useGetAllLPJs(activeTab);
  const { data: pondoks } = useGetAllPondoks();
  
  // Filter LPJs based on search term and selected pondok
  const filteredLPJs = lpjs?.filter(lpj => {
    const pondokMatch = selectedPondok === 'all' ? true : (lpj.pondok_id === selectedPondok);
    const searchMatch = searchTerm 
      ? (lpj.pondok?.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         lpj.periode_id.includes(searchTerm))
      : true;
    return pondokMatch && searchMatch;
  });
  
  const getStatusBadge = (status: string) => {
    if (status === 'diajukan') {
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Diajukan</Badge>;
    } else if (status === 'revisi') {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Revisi</Badge>;
    } else if (status === 'diterima') {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Diterima</Badge>;
    }
    return <Badge>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Laporan Pertanggungjawaban"
        description="Kelola LPJ dari semua Pondok"
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Daftar LPJ</CardTitle>
          <div className="flex items-center gap-2">
            <Tabs defaultValue="diajukan" className="w-[400px]" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="diajukan">Diajukan</TabsTrigger>
                <TabsTrigger value="revisi">Revisi</TabsTrigger>
                <TabsTrigger value="diterima">Diterima</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari LPJ berdasarkan nama pondok atau periode..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedPondok} onValueChange={setSelectedPondok}>
              <SelectTrigger className="w-full md:w-1/2">
                <SelectValue placeholder="Filter berdasarkan Pondok" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Pondok</SelectItem>
                {pondoks?.map((pondok) => (
                  <SelectItem key={pondok.id} value={pondok.id}>
                    {pondok.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredLPJs?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Tidak ada LPJ yang {activeTab === 'diajukan' ? 'diajukan' : activeTab === 'revisi' ? 'perlu direvisi' : 'diterima'}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pondok</TableHead>
                  <TableHead>Periode</TableHead>
                  <TableHead>Tanggal Pengajuan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLPJs?.map((lpj: any) => (
                  <TableRow key={lpj.id}>
                    <TableCell className="font-medium">{lpj.pondok?.nama || 'Unknown Pondok'}</TableCell>
                    <TableCell>{lpj.periode_id.substring(0, 4)}/{lpj.periode_id.substring(4, 6)}</TableCell>
                    <TableCell>{formatDate(lpj.submit_at)}</TableCell>
                    <TableCell>{getStatusBadge(lpj.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm" variant="outline">
                        <Link to={`/yayasan/lpj/${lpj.id}`}>Detail</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default YayasanLPJ;
