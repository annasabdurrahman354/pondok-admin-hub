
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

const PondokLPJDetail: React.FC = () => {
  const { lpjId } = useParams<{ lpjId: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRevisionDialogOpen, setIsRevisionDialogOpen] = useState(false);
  
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
  const handleRevisionSubmit = async (revisionNote: string) => {
    if (!lpjId || !lpjDetail) return;
    
    try {
      setIsSubmitting(true);
      await updateLPJMutation.mutateAsync({
        lpjId,
        lpjData: {
          status: 'diajukan',
          submit_at: new Date().toISOString(),
          revisi_note: revisionNote
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

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center align-middle items-center">
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
            <ArrowLeft className="mr-2 h-4 w-4" />
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

  // Revision Dialog Component
  const RevisionDialog = () => {
    const [revisionNote, setRevisionNote] = useState("");
    
    return (
      <Dialog open={isRevisionDialogOpen} onOpenChange={setIsRevisionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit LPJ Revision</DialogTitle>
            <DialogDescription>
              After making necessary changes to the LPJ, add your revision notes and submit the updated LPJ.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Textarea
              placeholder="Catatan revisi (opsional)"
              value={revisionNote}
              onChange={(e) => setRevisionNote(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRevisionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleRevisionSubmit(revisionNote)} disabled={isSubmitting}>
              Submit Revision
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="bg-background">
      <PageHeader
        title="Detail LPJ"
        description={`Periode ${formatPeriode(lpj.periode_id)}`}
        className="mb-2"
      >
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
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
              {getStatusBadge()}
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
            
            {lpj.status === 'revisi' && lpj.pesan_revisi && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>LPJ perlu direvisi</AlertTitle>
                <AlertDescription>
                  Catatan dari Yayasan: {lpj.pesan_revisi}
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
                        <div className="rounded-md border">
                          <div className="bg-muted/50 p-3 grid grid-cols-12 gap-2 font-medium">
                            <div className="col-span-4">Nama</div>
                            <div className="col-span-3">Rencana</div>
                            <div className="col-span-3">Realisasi</div>
                            <div className="col-span-2">Persentase</div>
                          </div>
                          <div className="divide-y">
                            {pemasukan.map((item, index) => {
                              const percentage = calculatePercentage(item.realisasi, item.rencana);
                              
                              return (
                                <div key={index} className="p-3 grid grid-cols-12 gap-2 items-center">
                                  <div className="col-span-4">{item.nama}</div>
                                  <div className="col-span-3">{formatCurrency(item.rencana)}</div>
                                  <div className="col-span-3">{formatCurrency(item.realisasi)}</div>
                                  <div className="col-span-2">
                                    <div className="flex items-center gap-2">
                                      <Progress value={percentage} className="h-2" />
                                      <span className="text-xs">{percentage}%</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="bg-muted/30 p-3 grid grid-cols-12 gap-2 font-medium">
                            <div className="col-span-4">Total</div>
                            <div className="col-span-3">{formatCurrency(totalRencanaPemasukan)}</div>
                            <div className="col-span-3">{formatCurrency(totalRealisasiPemasukan)}</div>
                            <div className="col-span-2">
                              <div className="flex items-center gap-2">
                                <Progress 
                                  value={calculatePercentage(totalRealisasiPemasukan, totalRencanaPemasukan)} 
                                  className="h-2" 
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
                  <Card className="border-none shadow-none">
                    <CardContent className="p-0">
                      <div className="space-y-4">
                        <div className="rounded-md border">
                          <div className="bg-muted/50 p-3 grid grid-cols-12 gap-2 font-medium">
                            <div className="col-span-4">Nama</div>
                            <div className="col-span-3">Rencana</div>
                            <div className="col-span-3">Realisasi</div>
                            <div className="col-span-2">Persentase</div>
                          </div>
                          <div className="divide-y">
                            {pengeluaran.map((item, index) => {
                              const percentage = calculatePercentage(item.realisasi, item.rencana);
                              
                              return (
                                <div key={index} className="p-3 grid grid-cols-12 gap-2 items-center">
                                  <div className="col-span-4">{item.nama}</div>
                                  <div className="col-span-3">{formatCurrency(item.rencana)}</div>
                                  <div className="col-span-3">{formatCurrency(item.realisasi)}</div>
                                  <div className="col-span-2">
                                    <div className="flex items-center gap-2">
                                      <Progress value={percentage} className="h-2" />
                                      <span className="text-xs">{percentage}%</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="bg-muted/30 p-3 grid grid-cols-12 gap-2 font-medium">
                            <div className="col-span-4">Total</div>
                            <div className="col-span-3">{formatCurrency(totalRencanaPengeluaran)}</div>
                            <div className="col-span-3">{formatCurrency(totalRealisasiPengeluaran)}</div>
                            <div className="col-span-2">
                              <div className="flex items-center gap-2">
                                <Progress 
                                  value={calculatePercentage(totalRealisasiPengeluaran, totalRencanaPengeluaran)} 
                                  className="h-2" 
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
                  <Card className="border-none shadow-none">
                    <CardContent className="p-0">
                      <div className="space-y-4">
                        <div className="bg-muted/30 p-4 rounded-md">
                          <h3 className="font-medium mb-4">Ringkasan LPJ</h3>
                          
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-sm font-medium mb-2">Pemasukan</h4>
                              <div className="grid grid-cols-2 gap-2 text-sm">
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
                              <h4 className="text-sm font-medium mb-2">Pengeluaran</h4>
                              <div className="grid grid-cols-2 gap-2 text-sm">
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
                              <h4 className="text-sm font-medium mb-2">Saldo</h4>
                              <div className="grid grid-cols-2 gap-2 text-sm">
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
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Peringatan Saldo Negatif</AlertTitle>
                            <AlertDescription>
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
            
            {lpj.status === 'revisi' && (
              <div className="flex justify-end mt-4">
                <Button 
                  onClick={() => navigate(`/pondok/lpj/edit/${lpj.id}`)}
                  variant="outline"
                  className="mr-2"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit LPJ
                </Button>
                
                <Button 
                  onClick={() => setIsRevisionDialogOpen(true)}
                  disabled={isSubmitting}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Ajukan Revisi
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <RevisionDialog />
    </div>
  );
};

export default PondokLPJDetail;
