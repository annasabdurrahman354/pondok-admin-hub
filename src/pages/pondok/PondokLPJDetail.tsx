import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertCircle, Clock, CheckCircle, AlertTriangle, Edit, ArrowLeft, Send
} from 'lucide-react';
import { formatCurrency, formatDate, formatPeriode } from '@/services/formatUtils';
import { useGetLPJDetail, useLPJMutations } from '@/hooks/use-pondok-data';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableFooter, TableCell } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { useIsMobile } from '@/hooks/use-mobile';

const PondokLPJDetail: React.FC = () => {
  const { lpjId } = useParams<{ lpjId: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRevisionDialogOpen, setIsRevisionDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  // Fetch LPJ detail data
  const { data: lpjDetail, isLoading, isError } = useGetLPJDetail(lpjId || '');
  const { submitLPJMutation, updateLPJMutation } = useLPJMutations();

  // Handle LPJ submission
  const handleSubmitLPJ = async () => {
    if (!lpjId) return;
    try {
      setIsSubmitting(true);
      await submitLPJMutation.mutateAsync(lpjId);
      toast.success('LPJ berhasil diajukan');
    } catch (error) {
      console.error('Failed to submit LPJ:', error);
      toast.error('Gagal mengajukan LPJ');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle revisions after receiving feedback
  const handleRevisionSubmit = async () => {
    if (!lpjId || !lpjDetail) return;
    try {
      setIsSubmitting(true);
      await updateLPJMutation.mutateAsync({
        lpjId,
        lpjData: {
          status: 'diajukan',
          submit_at: new Date().toISOString()
        }
      });
      setIsRevisionDialogOpen(false);
      toast.success('Revisi LPJ berhasil diajukan');
    } catch (error) {
      console.error('Failed to submit LPJ revision:', error);
      toast.error('Gagal mengajukan revisi LPJ');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle navigate to edit page
  const handleEditLPJ = () => {
    navigate(`/pondok/lpj/edit/${lpjId}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Error state
  if (isError || !lpjDetail) {
    return (
      <div className="bg-background">
        <PageHeader
          title="Detail LPJ"
          description="Laporan Pertanggungjawaban"
          className="mb-2"
        >
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Kembali
          </Button>
        </PageHeader>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Gagal memuat data LPJ. Silakan coba lagi nanti atau hubungi admin.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const { lpj, pemasukan, pengeluaran } = lpjDetail;

  // Calculate totals
  const totalRencanaPemasukan = pemasukan.reduce((sum, item) => sum + item.rencana, 0);
  const totalRealisasiPemasukan = pemasukan.reduce((sum, item) => sum + item.realisasi, 0);
  const totalRencanaPengeluaran = pengeluaran.reduce((sum, item) => sum + item.rencana, 0);
  const totalRealisasiPengeluaran = pengeluaran.reduce((sum, item) => sum + item.realisasi, 0);
  const saldoRencana = totalRencanaPemasukan - totalRencanaPengeluaran;
  const saldoRealisasi = totalRealisasiPemasukan - totalRealisasiPengeluaran;

  // Calculate realization percentage
  const calculatePercentage = (realisasi: number, rencana: number) => {
    if (rencana === 0) return 0;
    return Math.min(Math.round((realisasi / rencana) * 100), 100);
  };

  // Get status badge
  const getStatusBadge = () => {
    switch (lpj.status) {
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'diajukan':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Menunggu</Badge>;
      case 'disetujui':
      case 'diterima':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">Disetujui</Badge>;
      case 'revisi':
        return <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">Perlu Revisi</Badge>;
      default:
        return <Badge variant="outline">Draft</Badge>;
    }
  };

  // Get status icon
  const getStatusIcon = () => {
    switch (lpj.status) {
      case 'draft':
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
      case 'diajukan':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'disetujui':
      case 'diterima':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'revisi':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  // Confirmation Dialog Component
  const ConfirmationDialog = () => {
    return (
      <Dialog open={isRevisionDialogOpen} onOpenChange={setIsRevisionDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Ajukan Revisi LPJ</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin mengajukan revisi LPJ ini?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setIsRevisionDialogOpen(false)} className="w-full sm:w-auto">
              Batal
            </Button>
            <Button onClick={handleRevisionSubmit} disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? 'Sedang Diproses...' : 'Ajukan Revisi'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className='space-y-6'>
      <PageHeader
        title="Detail LPJ"
        description={`Periode ${formatPeriode(lpj.periode_id)}`}
        className="mb-2"
      >
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Kembali
        </Button>
      </PageHeader>

      <Card className="bg-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className={isMobile ? "text-base" : "text-lg"}>
                LPJ {formatPeriode(lpj.periode_id)}
              </CardTitle>
              <CardDescription className={isMobile ? "text-xs" : "text-sm"}>
                Dibuat pada: {formatDate(lpj.created_at || '')}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              {getStatusBadge()}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-3 p-2 lg:p-4">
          <div className="space-y-3">
            {lpj.status === 'draft' && (
              <Alert className="p-3">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>LPJ dalam status draft</AlertTitle>
                <AlertDescription>
                  LPJ ini belum diajukan ke Yayasan. Klik tombol "Ajukan LPJ" untuk mengirimkan ke Yayasan.
                </AlertDescription>
              </Alert>
            )}

            {lpj.status === 'revisi' && lpj.pesan_revisi && (
              <Alert variant="destructive" className="p-3">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Perlu Revisi</AlertTitle>
                <AlertDescription>
                  {lpj.pesan_revisi}
                </AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="pemasukan" className="w-full">
              <TabsList className="mb-3 h-9">
                <TabsTrigger value="pemasukan">Pemasukan</TabsTrigger>
                <TabsTrigger value="pengeluaran">Pengeluaran</TabsTrigger>
                <TabsTrigger value="summary">Ringkasan</TabsTrigger>
              </TabsList>

              <TabsContent value="pemasukan">
                <Card className="border-none shadow-none bg-background/50">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nama</TableHead>
                          <TableHead className="text-right">Rencana</TableHead>
                          <TableHead className="text-right">Realisasi</TableHead>
                          <TableHead className="text-right">%</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pemasukan.map((item, index) => {
                          const percentage = calculatePercentage(item.realisasi, item.rencana);
                          return (
                            <TableRow key={index}>
                              <TableCell>{item.nama}</TableCell>
                              <TableCell className="text-right">{formatCurrency(item.rencana)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(item.realisasi)}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <Progress value={percentage} className="h-1.5 w-10" />
                                  <span className="text-xs">{percentage}%</span>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell>Total</TableCell>
                          <TableCell className="text-right">{formatCurrency(totalRencanaPemasukan)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(totalRealisasiPemasukan)}</TableCell>
                          <TableCell className="text-right">
                            {calculatePercentage(totalRealisasiPemasukan, totalRencanaPemasukan)}%
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pengeluaran">
                <Card className="border-none shadow-none bg-background/50">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nama</TableHead>
                          <TableHead className="text-right">Rencana</TableHead>
                          <TableHead className="text-right">Realisasi</TableHead>
                          <TableHead className="text-right">%</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pengeluaran.map((item, index) => {
                          const percentage = calculatePercentage(item.realisasi, item.rencana);
                          return (
                            <TableRow key={index}>
                              <TableCell>{item.nama}</TableCell>
                              <TableCell className="text-right">{formatCurrency(item.rencana)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(item.realisasi)}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <Progress value={percentage} className="h-1.5 w-10" />
                                  <span className="text-xs">{percentage}%</span>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell>Total</TableCell>
                          <TableCell className="text-right">{formatCurrency(totalRencanaPengeluaran)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(totalRealisasiPengeluaran)}</TableCell>
                          <TableCell className="text-right">
                            {calculatePercentage(totalRealisasiPengeluaran, totalRencanaPengeluaran)}%
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="summary">
                <Card className="border-none shadow-none bg-background/50">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead colSpan={2} className="text-center">Ringkasan LPJ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Pemasukan (Rencana)</TableCell>
                          <TableCell className="text-right">{formatCurrency(totalRencanaPemasukan)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Pemasukan (Realisasi)</TableCell>
                          <TableCell className="text-right">{formatCurrency(totalRealisasiPemasukan)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Persentase Pemasukan</TableCell>
                          <TableCell className="text-right">
                            {calculatePercentage(totalRealisasiPemasukan, totalRencanaPemasukan)}%
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Pengeluaran (Rencana)</TableCell>
                          <TableCell className="text-right">{formatCurrency(totalRencanaPengeluaran)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Pengeluaran (Realisasi)</TableCell>
                          <TableCell className="text-right">{formatCurrency(totalRealisasiPengeluaran)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Persentase Pengeluaran</TableCell>
                          <TableCell className="text-right">
                            {calculatePercentage(totalRealisasiPengeluaran, totalRencanaPengeluaran)}%
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Saldo (Rencana)</TableCell>
                          <TableCell className={`text-right font-bold ${saldoRencana >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {formatCurrency(saldoRencana)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Saldo (Realisasi)</TableCell>
                          <TableCell className={`text-right font-bold ${saldoRealisasi >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {formatCurrency(saldoRealisasi)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>

                    {saldoRealisasi < 0 && (
                      <Alert variant="destructive" className="p-3 mt-3">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Peringatan Saldo Negatif</AlertTitle>
                        <AlertDescription>
                          Total realisasi pengeluaran melebihi total realisasi pemasukan.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {lpj.status === 'draft' && (
              <div className="flex justify-end mt-3 space-x-2">
                <Button onClick={handleSubmitLPJ} disabled={isSubmitting} size={isMobile ? "sm" : "default"}>
                  <Send className="w-4 h-4 mr-1" />
                  Ajukan LPJ
                </Button>
              </div>
            )}

            {lpj.status === 'revisi' && (
              <div className="flex justify-end mt-3 space-x-2">
                <Button onClick={handleEditLPJ} variant="outline" size={isMobile ? "sm" : "default"}>
                  <Edit className="w-4 h-4 mr-1" />
                  Edit LPJ
                </Button>
                <Button onClick={() => setIsRevisionDialogOpen(true)} disabled={isSubmitting} size={isMobile ? "sm" : "default"}>
                  <Send className="w-4 h-4 mr-1" />
                  Ajukan Revisi
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <ConfirmationDialog />
    </div>
  );
};

export default PondokLPJDetail;
