
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, Save, Send, AlertCircle, CalendarIcon, 
  Clock, CheckCircle, AlertTriangle, Edit, ArrowLeft
} from 'lucide-react';
import { formatCurrency, formatDate, formatPeriode } from '@/services/formatUtils';
import { useGetLPJDetail, useLPJMutations } from '@/hooks/use-pondok-data';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useIsMobile } from '@/hooks/use-mobile';

const PondokLPJDetail: React.FC = () => {
  const { lpjId } = useParams<{ lpjId: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRevisionDialogOpen, setIsRevisionDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Fetch LPJ detail data
  const { 
    data: lpjDetail, 
    isLoading, 
    isError 
  } = useGetLPJDetail(lpjId || '');
  
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
      <div className="flex justify-center py-8">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Error state
  if (isError || !lpjDetail) {
    return (
      <div className="space-y-4">
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
  
  const textSizeClass = isMobile ? "text-xs" : "text-sm";
  const cardContentPadding = isMobile ? "p-2" : "p-4";

  return (
    <div className="space-y-4">
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
              <CardTitle className={isMobile ? "text-base" : "text-lg"}>LPJ {formatPeriode(lpj.periode_id)}</CardTitle>
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
        <CardContent className={`pb-3 ${cardContentPadding}`}>
          <div className="space-y-3">
            {lpj.status === 'draft' && (
              <Alert className="p-3">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className={textSizeClass}>LPJ dalam status draft</AlertTitle>
                <AlertDescription className={textSizeClass}>
                  LPJ ini belum diajukan ke Yayasan. Klik tombol "Ajukan LPJ" untuk mengirimkan ke Yayasan.
                </AlertDescription>
              </Alert>
            )}
            
            {lpj.status === 'revisi' && lpj.pesan_revisi && (
              <Alert variant="destructive" className="p-3">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className={textSizeClass}>Perlu Revisi</AlertTitle>
                <AlertDescription className={textSizeClass}>
                  {lpj.pesan_revisi}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-4">
              <Tabs defaultValue="pemasukan" className="w-full">
                <TabsList className="mb-3 h-9">
                  <TabsTrigger value="pemasukan" className={textSizeClass}>Pemasukan</TabsTrigger>
                  <TabsTrigger value="pengeluaran" className={textSizeClass}>Pengeluaran</TabsTrigger>
                  <TabsTrigger value="summary" className={textSizeClass}>Ringkasan</TabsTrigger>
                </TabsList>
                
                <TabsContent value="pemasukan">
                  <Card className="border-none shadow-none bg-background/50">
                    <CardContent className="p-0">
                      <div className="space-y-3">
                        <div className="rounded-md border">
                          <div className="bg-muted/50 p-2 grid grid-cols-12 gap-2 font-medium">
                            <div className={`col-span-4 ${textSizeClass}`}>Nama</div>
                            <div className={`col-span-3 ${textSizeClass}`}>Rencana</div>
                            <div className={`col-span-3 ${textSizeClass}`}>Realisasi</div>
                            <div className={`col-span-2 ${textSizeClass}`}>%</div>
                          </div>
                          <div className="divide-y">
                            {pemasukan.map((item, index) => {
                              const percentage = calculatePercentage(item.realisasi, item.rencana);
                              
                              return (
                                <div key={index} className="p-2 grid grid-cols-12 gap-2 items-center">
                                  <div className={`col-span-4 ${textSizeClass}`}>{item.nama}</div>
                                  <div className={`col-span-3 ${textSizeClass}`}>{formatCurrency(item.rencana)}</div>
                                  <div className={`col-span-3 ${textSizeClass}`}>{formatCurrency(item.realisasi)}</div>
                                  <div className="col-span-2">
                                    <div className="flex items-center gap-1">
                                      <Progress value={percentage} className="h-1.5" />
                                      <span className="text-xs">{percentage}%</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="bg-muted/30 p-2 grid grid-cols-12 gap-2 font-medium">
                            <div className={`col-span-4 ${textSizeClass}`}>Total</div>
                            <div className={`col-span-3 ${textSizeClass}`}>{formatCurrency(totalRencanaPemasukan)}</div>
                            <div className={`col-span-3 ${textSizeClass}`}>{formatCurrency(totalRealisasiPemasukan)}</div>
                            <div className="col-span-2">
                              <div className="flex items-center gap-1">
                                <Progress 
                                  value={calculatePercentage(totalRealisasiPemasukan, totalRencanaPemasukan)} 
                                  className="h-1.5" 
                                />
                                <span className="text-xs">
                                  {calculatePercentage(totalRealisasiPemasukan, totalRencanaPemasukan)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="pengeluaran">
                  <Card className="border-none shadow-none bg-background/50">
                    <CardContent className="p-0">
                      <div className="space-y-3">
                        <div className="rounded-md border">
                          <div className="bg-muted/50 p-2 grid grid-cols-12 gap-2 font-medium">
                            <div className={`col-span-4 ${textSizeClass}`}>Nama</div>
                            <div className={`col-span-3 ${textSizeClass}`}>Rencana</div>
                            <div className={`col-span-3 ${textSizeClass}`}>Realisasi</div>
                            <div className={`col-span-2 ${textSizeClass}`}>%</div>
                          </div>
                          <div className="divide-y">
                            {pengeluaran.map((item, index) => {
                              const percentage = calculatePercentage(item.realisasi, item.rencana);
                              
                              return (
                                <div key={index} className="p-2 grid grid-cols-12 gap-2 items-center">
                                  <div className={`col-span-4 ${textSizeClass}`}>{item.nama}</div>
                                  <div className={`col-span-3 ${textSizeClass}`}>{formatCurrency(item.rencana)}</div>
                                  <div className={`col-span-3 ${textSizeClass}`}>{formatCurrency(item.realisasi)}</div>
                                  <div className="col-span-2">
                                    <div className="flex items-center gap-1">
                                      <Progress value={percentage} className="h-1.5" />
                                      <span className="text-xs">{percentage}%</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="bg-muted/30 p-2 grid grid-cols-12 gap-2 font-medium">
                            <div className={`col-span-4 ${textSizeClass}`}>Total</div>
                            <div className={`col-span-3 ${textSizeClass}`}>{formatCurrency(totalRencanaPengeluaran)}</div>
                            <div className={`col-span-3 ${textSizeClass}`}>{formatCurrency(totalRealisasiPengeluaran)}</div>
                            <div className="col-span-2">
                              <div className="flex items-center gap-1">
                                <Progress 
                                  value={calculatePercentage(totalRealisasiPengeluaran, totalRencanaPengeluaran)} 
                                  className="h-1.5" 
                                />
                                <span className="text-xs">
                                  {calculatePercentage(totalRealisasiPengeluaran, totalRencanaPengeluaran)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="summary">
                  <Card className="border-none shadow-none bg-background/50">
                    <CardContent className="p-0">
                      <div className="space-y-3">
                        <div className="bg-muted/30 p-3 rounded-md">
                          <h3 className={`font-medium mb-2 ${isMobile ? "text-sm" : "text-base"}`}>Ringkasan LPJ</h3>
                          
                          <div className="space-y-4">
                            <div>
                              <h4 className={`font-medium mb-1 ${textSizeClass}`}>Pemasukan</h4>
                              <div className="grid grid-cols-2 gap-1 text-xs">
                                <div>Rencana:</div>
                                <div className="text-right font-medium">{formatCurrency(totalRencanaPemasukan)}</div>
                                <div>Realisasi:</div>
                                <div className="text-right font-medium">{formatCurrency(totalRealisasiPemasukan)}</div>
                                <div>Persentase:</div>
                                <div className="text-right font-medium">
                                  {calculatePercentage(totalRealisasiPemasukan, totalRencanaPemasukan)}%
                                </div>
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div>
                              <h4 className={`font-medium mb-1 ${textSizeClass}`}>Pengeluaran</h4>
                              <div className="grid grid-cols-2 gap-1 text-xs">
                                <div>Rencana:</div>
                                <div className="text-right font-medium">{formatCurrency(totalRencanaPengeluaran)}</div>
                                <div>Realisasi:</div>
                                <div className="text-right font-medium">{formatCurrency(totalRealisasiPengeluaran)}</div>
                                <div>Persentase:</div>
                                <div className="text-right font-medium">
                                  {calculatePercentage(totalRealisasiPengeluaran, totalRencanaPengeluaran)}%
                                </div>
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div>
                              <h4 className={`font-medium mb-1 ${textSizeClass}`}>Saldo</h4>
                              <div className="grid grid-cols-2 gap-1 text-xs">
                                <div>Rencana:</div>
                                <div className={`text-right font-medium ${saldoRencana >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {formatCurrency(saldoRencana)}
                                </div>
                                <div>Realisasi:</div>
                                <div className={`text-right font-medium ${saldoRealisasi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {formatCurrency(saldoRealisasi)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {saldoRealisasi < 0 && (
                          <Alert variant="destructive" className="p-3">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle className={textSizeClass}>Peringatan Saldo Negatif</AlertTitle>
                            <AlertDescription className={textSizeClass}>
                              Total realisasi pengeluaran melebihi total realisasi pemasukan.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            {lpj.status === 'draft' && (
              <div className="flex justify-end mt-3 space-x-2">
                <Button 
                  onClick={handleSubmitLPJ} 
                  disabled={isSubmitting}
                  size={isMobile ? "sm" : "default"}
                >
                  <Send className="w-4 h-4 mr-1" />
                  Ajukan LPJ
                </Button>
              </div>
            )}
            
            {lpj.status === 'revisi' && (
              <div className="flex justify-end mt-3 space-x-2">
                <Button 
                  onClick={handleEditLPJ}
                  variant="outline"
                  size={isMobile ? "sm" : "default"}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit LPJ
                </Button>
                
                <Button 
                  onClick={() => setIsRevisionDialogOpen(true)}
                  disabled={isSubmitting}
                  size={isMobile ? "sm" : "default"}
                >
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
