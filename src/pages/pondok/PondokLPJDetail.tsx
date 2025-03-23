
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Send, AlertCircle, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { formatCurrency, formatDate, formatPeriode, getStatusBadge } from '@/services/formatUtils';
import { useGetLPJDetail, useLPJMutations } from '@/hooks/use-pondok-data';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

const PondokLPJDetail: React.FC = () => {
  const { lpjId } = useParams<{ lpjId: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch LPJ detail data
  const { 
    data: lpjDetail, 
    isLoading, 
    isError 
  } = useGetLPJDetail(lpjId || '');
  
  const { submitLPJMutation } = useLPJMutations();

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

  // Calculate percentage of realization compared to plan
  const calculatePercentage = (realisasi: number, rencana: number) => {
    if (rencana === 0) return 0;
    const percentage = Math.min(100, Math.round((realisasi / rencana) * 100));
    return percentage;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Error state
  if (isError || !lpjDetail) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Detail LPJ"
          description="Laporan Pertanggungjawaban"
          className="mb-2"
        >
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ChevronLeft className="mr-2 h-4 w-4" />
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

  const statusBadge = getStatusBadge(lpj.status);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Detail LPJ"
        description={`Periode ${formatPeriode(lpj.periode_id)}`}
        className="mb-2"
      >
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
      </PageHeader>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle>LPJ {formatPeriode(lpj.periode_id)}</CardTitle>
              <CardDescription>
                Dibuat pada: {formatDate(lpj.created_at || '')}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className={statusBadge.className}>{statusBadge.label}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lpj.status === 'draft' && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>LPJ dalam status draft</AlertTitle>
                <AlertDescription>
                  LPJ ini belum diajukan ke Yayasan. Klik tombol "Ajukan LPJ" untuk mengirimkan ke Yayasan.
                </AlertDescription>
              </Alert>
            )}
            
            {lpj.status === 'revisi' && lpj.revisi_note && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>LPJ perlu direvisi</AlertTitle>
                <AlertDescription>
                  Catatan: {lpj.revisi_note}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-6">
              <Tabs defaultValue="pemasukan" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="pemasukan">Pemasukan</TabsTrigger>
                  <TabsTrigger value="pengeluaran">Pengeluaran</TabsTrigger>
                  <TabsTrigger value="summary">Ringkasan</TabsTrigger>
                </TabsList>
                
                <TabsContent value="pemasukan">
                  <Card className="border-none shadow-none">
                    <CardContent className="p-0">
                      <div className="space-y-4">
                        {pemasukan.map((item, index) => (
                          <Card key={index} className="overflow-hidden">
                            <CardHeader className="p-3 bg-muted/30">
                              <CardTitle className="text-base">{item.nama}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-3">
                              <div className="grid grid-cols-2 gap-3 mb-2">
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Rencana</p>
                                  <p className="font-medium">{formatCurrency(item.rencana)}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Realisasi</p>
                                  <p className="font-medium">{formatCurrency(item.realisasi)}</p>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Persentase Realisasi</p>
                                <Progress value={calculatePercentage(item.realisasi, item.rencana)} className="h-2 mb-1" />
                                <p className="text-xs text-right">
                                  {calculatePercentage(item.realisasi, item.rencana)}%
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        
                        <Card className="bg-muted/20">
                          <CardContent className="p-4">
                            <h3 className="font-medium text-lg mb-2">Total Pemasukan</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-muted-foreground">Rencana</p>
                                <p className="font-medium">{formatCurrency(totalRencanaPemasukan)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Realisasi</p>
                                <p className="font-medium">{formatCurrency(totalRealisasiPemasukan)}</p>
                              </div>
                            </div>
                            <div className="mt-2">
                              <p className="text-xs text-muted-foreground mb-1">Persentase Realisasi</p>
                              <Progress 
                                value={calculatePercentage(totalRealisasiPemasukan, totalRencanaPemasukan)} 
                                className="h-2 mb-1" 
                              />
                              <p className="text-xs text-right">
                                {calculatePercentage(totalRealisasiPemasukan, totalRencanaPemasukan)}%
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="pengeluaran">
                  <Card className="border-none shadow-none">
                    <CardContent className="p-0">
                      <div className="space-y-4">
                        {pengeluaran.map((item, index) => (
                          <Card key={index} className="overflow-hidden">
                            <CardHeader className="p-3 bg-muted/30">
                              <CardTitle className="text-base">{item.nama}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-3">
                              <div className="grid grid-cols-2 gap-3 mb-2">
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Rencana</p>
                                  <p className="font-medium">{formatCurrency(item.rencana)}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Realisasi</p>
                                  <p className="font-medium">{formatCurrency(item.realisasi)}</p>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Persentase Realisasi</p>
                                <Progress value={calculatePercentage(item.realisasi, item.rencana)} className="h-2 mb-1" />
                                <p className="text-xs text-right">
                                  {calculatePercentage(item.realisasi, item.rencana)}%
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        
                        <Card className="bg-muted/20">
                          <CardContent className="p-4">
                            <h3 className="font-medium text-lg mb-2">Total Pengeluaran</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-muted-foreground">Rencana</p>
                                <p className="font-medium">{formatCurrency(totalRencanaPengeluaran)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Realisasi</p>
                                <p className="font-medium">{formatCurrency(totalRealisasiPengeluaran)}</p>
                              </div>
                            </div>
                            <div className="mt-2">
                              <p className="text-xs text-muted-foreground mb-1">Persentase Realisasi</p>
                              <Progress 
                                value={calculatePercentage(totalRealisasiPengeluaran, totalRencanaPengeluaran)} 
                                className="h-2 mb-1" 
                              />
                              <p className="text-xs text-right">
                                {calculatePercentage(totalRealisasiPengeluaran, totalRencanaPengeluaran)}%
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="summary">
                  <Card className="border-none shadow-none">
                    <CardContent className="p-0">
                      <div className="space-y-4">
                        <Card className="bg-muted/20">
                          <CardContent className="p-4">
                            <h3 className="font-medium text-lg mb-2">Total Pemasukan</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-muted-foreground">Rencana</p>
                                <p className="font-medium">{formatCurrency(totalRencanaPemasukan)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Realisasi</p>
                                <p className="font-medium">{formatCurrency(totalRealisasiPemasukan)}</p>
                              </div>
                            </div>
                            <div className="mt-2">
                              <p className="text-xs text-muted-foreground mb-1">Persentase Realisasi</p>
                              <Progress 
                                value={calculatePercentage(totalRealisasiPemasukan, totalRencanaPemasukan)} 
                                className="h-2 mb-1" 
                              />
                              <p className="text-xs text-right">
                                {calculatePercentage(totalRealisasiPemasukan, totalRencanaPemasukan)}%
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-muted/20">
                          <CardContent className="p-4">
                            <h3 className="font-medium text-lg mb-2">Total Pengeluaran</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-muted-foreground">Rencana</p>
                                <p className="font-medium">{formatCurrency(totalRencanaPengeluaran)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Realisasi</p>
                                <p className="font-medium">{formatCurrency(totalRealisasiPengeluaran)}</p>
                              </div>
                            </div>
                            <div className="mt-2">
                              <p className="text-xs text-muted-foreground mb-1">Persentase Realisasi</p>
                              <Progress 
                                value={calculatePercentage(totalRealisasiPengeluaran, totalRencanaPengeluaran)} 
                                className="h-2 mb-1" 
                              />
                              <p className="text-xs text-right">
                                {calculatePercentage(totalRealisasiPengeluaran, totalRencanaPengeluaran)}%
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-4">
                            <h3 className="font-medium text-lg mb-2">Saldo</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-muted-foreground">Saldo (Rencana)</p>
                                <p className={`font-medium ${saldoRencana >= 0 ? "text-green-600" : "text-red-600"}`}>
                                  {formatCurrency(saldoRencana)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Saldo (Realisasi)</p>
                                <p className={`font-medium ${saldoRealisasi >= 0 ? "text-green-600" : "text-red-600"}`}>
                                  {formatCurrency(saldoRealisasi)}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            {lpj.status === 'draft' && (
              <div className="flex justify-end mt-4">
                <Button 
                  onClick={handleSubmitLPJ} 
                  disabled={isSubmitting}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Ajukan LPJ
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PondokLPJDetail;
