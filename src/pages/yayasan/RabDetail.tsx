
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
import { Check, XCircle, ArrowLeft } from 'lucide-react';
import { useGetRABDetail, useYayasanMutations } from '@/hooks/use-yayasan-data';
import { formatCurrency, formatDate } from '@/services/formatUtils';

const RabDetail = () => {
  const { rabId } = useParams<{ rabId: string }>();
  const navigate = useNavigate();
  const [revisionMessage, setRevisionMessage] = useState('');
  const [activeTab, setActiveTab] = useState('pemasukan');
  
  const { data: rabDetail, isLoading } = useGetRABDetail(rabId);
  const { approveRABMutation, requestRABRevisionMutation } = useYayasanMutations();
  
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
  
  if (!rabDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto" />
          <p className="mt-4 text-muted-foreground">RAB tidak ditemukan</p>
          <Button className="mt-4" onClick={() => navigate('/yayasan/rab')}>
            Kembali ke Daftar RAB
          </Button>
        </div>
      </div>
    );
  }
  
  const { rab, pemasukan, pengeluaran } = rabDetail;
  
  const handleApproveRAB = () => {
    approveRABMutation.mutate(rab.id, {
      onSuccess: () => {
        navigate('/yayasan/rab');
      }
    });
  };
  
  const handleRequestRevision = () => {
    if (!revisionMessage.trim()) return;
    
    requestRABRevisionMutation.mutate({
      rabId: rab.id,
      message: revisionMessage
    }, {
      onSuccess: () => {
        navigate('/yayasan/rab');
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
  
  const totalPemasukan = pemasukan.reduce((sum, item) => sum + item.nominal, 0);
  const totalPengeluaran = pengeluaran.reduce((sum, item) => sum + item.nominal, 0);
  const saldo = totalPemasukan - totalPengeluaran;

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => navigate('/yayasan/rab')} className="mr-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
        <PageHeader 
          title="Detail RAB"
          description={`RAB Periode ${rab.periode_id.substring(0, 4)}/${rab.periode_id.substring(4, 6)}`}
        />
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Informasi RAB</CardTitle>
            <CardDescription>Pondok: {rab.pondok?.nama || 'Unknown'}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(rab.status)}
            {rab.status === 'diajukan' && (
              <div className="flex gap-2">
                <Button size="sm" onClick={handleApproveRAB} disabled={approveRABMutation.isPending}>
                  <Check className="w-4 h-4 mr-2" />
                  Setujui RAB
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
                      <DialogTitle>Permintaan Revisi RAB</DialogTitle>
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
                        disabled={!revisionMessage.trim() || requestRABRevisionMutation.isPending}
                      >
                        Kirim Permintaan Revisi
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <div className="bg-muted/30 p-4 rounded-md">
              <h3 className="text-sm font-medium mb-1">Status</h3>
              <div className="font-bold">{getStatusBadge(rab.status)}</div>
            </div>
            <div className="bg-muted/30 p-4 rounded-md">
              <h3 className="text-sm font-medium mb-1">Tanggal Pengajuan</h3>
              <div className="font-bold">{rab.submit_at ? formatDate(rab.submit_at) : '-'}</div>
            </div>
            <div className="bg-muted/30 p-4 rounded-md">
              <h3 className="text-sm font-medium mb-1">Tanggal Persetujuan</h3>
              <div className="font-bold">{rab.accepted_at ? formatDate(rab.accepted_at) : '-'}</div>
            </div>
            <div className="bg-muted/30 p-4 rounded-md">
              <h3 className="text-sm font-medium mb-1">Periode</h3>
              <div className="font-bold">{rab.periode_id.substring(0, 4)}/{rab.periode_id.substring(4, 6)}</div>
            </div>
          </div>
          
          {rab.pesan_revisi && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md mb-6">
              <h3 className="font-medium mb-1">Pesan Revisi:</h3>
              <p>{rab.pesan_revisi}</p>
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
                    <TableHead className="text-right">Nominal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pemasukan.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.nama}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.nominal)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-t-2">
                    <TableCell colSpan={2} className="font-bold">Total Pemasukan</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(totalPemasukan)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="pengeluaran" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Nama Pengeluaran</TableHead>
                    <TableHead className="text-right">Nominal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pengeluaran.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.kategori}</TableCell>
                      <TableCell>
                        {item.nama}
                        {item.detail && (
                          <div className="text-xs text-muted-foreground">{item.detail}</div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(item.nominal)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-t-2">
                    <TableCell colSpan={3} className="font-bold">Total Pengeluaran</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(totalPengeluaran)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="summary">
              <Card className="border-none shadow-none">
                <CardContent className="p-0">
                  <div className="grid gap-4">
                    <div className="bg-muted/30 p-4 rounded-md">
                      <h3 className="font-medium mb-2">Ringkasan Anggaran</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Total Pemasukan:</span>
                          <span className="font-medium">{formatCurrency(totalPemasukan)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Pengeluaran:</span>
                          <span className="font-medium">{formatCurrency(totalPengeluaran)}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-bold">
                          <span>Saldo Akhir:</span>
                          <span className={saldo >= 0 ? "text-green-600" : "text-red-600"}>
                            {formatCurrency(saldo)}
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

export default RabDetail;
