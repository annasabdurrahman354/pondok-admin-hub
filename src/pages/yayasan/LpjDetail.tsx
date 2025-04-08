import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Check, XCircle, ArrowLeft, FileText } from 'lucide-react';
import { useGetLPJDetail, useYayasanMutations } from '@/hooks/use-yayasan-data';
import { formatCurrency, formatDate } from '@/services/formatUtils';
import { LPJDetailResponse } from '@/types/dataTypes';

const LpjDetail = () => {
  const { lpjId } = useParams<{ lpjId: string }>();
  const navigate = useNavigate();
  const [revisionMessage, setRevisionMessage] = useState('');
  const [activeTab, setActiveTab] = useState('pemasukan');
  
  const { data: lpjDetail, isLoading } = useGetLPJDetail(lpjId);
  const { approveLPJMutation, requestLPJRevisionMutation } = useYayasanMutations();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!lpjDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto" />
          <p className="mt-4 text-muted-foreground">LPJ tidak ditemukan</p>
          <Button className="mt-4" onClick={() => navigate('/yayasan/lpj')}>
            Kembali ke Daftar LPJ
          </Button>
        </div>
      </div>
    );
  }
  
  const { lpj, pemasukan, pengeluaran } = lpjDetail as LPJDetailResponse;
  
  const handleApproveLPJ = () => {
    approveLPJMutation.mutate(lpj.id, {
      onSuccess: () => {
        navigate('/yayasan/lpj');
      }
    });
  };
  
  const handleRequestRevision = () => {
    if (!revisionMessage.trim()) return;
    
    requestLPJRevisionMutation.mutate({
      lpjId: lpj.id,
      message: revisionMessage
    }, {
      onSuccess: () => {
        navigate('/yayasan/lpj');
      }
    });
  };
  
  const getStatusBadge = (status) => {
    if (status === 'diajukan') {
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Diajukan</Badge>;
    } else if (status === 'revisi') {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Revisi</Badge>;
    } else if (status === 'diterima') {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Diterima</Badge>;
    }
    return <Badge>{status}</Badge>;
  };
  
  const totalRencanaPemasukan = pemasukan.reduce((sum, item) => sum + item.rencana, 0);
  const totalRealisasiPemasukan = pemasukan.reduce((sum, item) => sum + item.realisasi, 0);
  
  const totalRencanaPengeluaran = pengeluaran.reduce((sum, item) => sum + item.rencana, 0);
  const totalRealisasiPengeluaran = pengeluaran.reduce((sum, item) => sum + item.realisasi, 0);
  
  const getPersentase = (realisasi, rencana) => {
    if (rencana === 0) return '0%';
    return `${Math.round((realisasi / rencana) * 100)}%`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start">
        <Button variant="ghost" onClick={() => navigate('/yayasan/lpj')} className="mr-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
        </Button>
        <PageHeader 
          title="Detail LPJ"
          description={`LPJ Periode ${lpj.periode_id.substring(0, 4)}/${lpj.periode_id.substring(4, 6)}`}
        />
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Informasi LPJ</CardTitle>
            <CardDescription>Pondok: {lpj.pondok?.nama || 'Unknown'}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <div className="bg-muted/30 p-4 rounded-md">
              <h3 className="text-sm font-medium mb-1">Status</h3>
              <div className="font-bold">{getStatusBadge(lpj.status)}</div>
            </div>
            <div className="bg-muted/30 p-4 rounded-md">
              <h3 className="text-sm font-medium mb-1">Tanggal Pengajuan</h3>
              <div className="font-bold">{lpj.submit_at ? formatDate(lpj.submit_at) : '-'}</div>
            </div>
            <div className="bg-muted/30 p-4 rounded-md">
              <h3 className="text-sm font-medium mb-1">Tanggal Persetujuan</h3>
              <div className="font-bold">{lpj.accepted_at ? formatDate(lpj.accepted_at) : '-'}</div>
            </div>
            <div className="bg-muted/30 p-4 rounded-md">
              <h3 className="text-sm font-medium mb-1">Periode</h3>
              <div className="font-bold">{lpj.periode_id.substring(0, 4)}/{lpj.periode_id.substring(4, 6)}</div>
            </div>
          </div>
          
          {lpj.pesan_revisi && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md mb-6">
              <h3 className="font-medium mb-1">Pesan Revisi:</h3>
              <p>{lpj.pesan_revisi}</p>
            </div>
          )}
          
          <Tabs defaultValue="pemasukan" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="pemasukan">Pemasukan</TabsTrigger>
              <TabsTrigger value="pengeluaran">Pengeluaran</TabsTrigger>
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
                      <TableCell className="text-right">{formatCurrency(item.realisasi)}</TableCell>
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
                      <TableCell className="text-right">{formatCurrency(item.realisasi)}</TableCell>
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
          <div className="flex items-center justify-end gap-2 mt-6">
            {lpj.status === 'diajukan' && (
              <div className="flex gap-2">
                <Button size="sm" onClick={handleApproveLPJ} disabled={approveLPJMutation.isPending}>
                  <Check className="w-4 h-4 mr-2" />
                  Setujui LPJ
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="destructive">
                      <XCircle className="w-4 h-4 mr-2" />
                      Minta Revisi
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Permintaan Revisi LPJ</DialogTitle>
                      <DialogDescription>
                        Berikan keterangan tentang revisi yang perlu dilakukan
                      </DialogDescription>
                    </DialogHeader>
                    <Textarea
                      placeholder="Keterangan revisi..."
                      className="min-h-[100px]"
                      value={revisionMessage}
                      onChange={(e) => setRevisionMessage(e.target.value)}
                    />
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Batal</Button>
                      </DialogClose>
                      <Button 
                        onClick={handleRequestRevision}
                        disabled={!revisionMessage.trim() || requestLPJRevisionMutation.isPending}
                      >
                        Kirim Permintaan Revisi
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LpjDetail;
