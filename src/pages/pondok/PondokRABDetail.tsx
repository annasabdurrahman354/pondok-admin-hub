
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
import { useGetRABDetail, useRABMutations } from '@/hooks/use-pondok-data';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const PondokRABDetail: React.FC = () => {
  const { rabId } = useParams<{ rabId: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRevisionDialogOpen, setIsRevisionDialogOpen] = useState(false);
  
  // Fetch RAB detail data
  const { 
    data: rabDetail, 
    isLoading, 
    isError 
  } = useGetRABDetail(rabId || '');
  
  const { submitRABMutation, updateRABMutation } = useRABMutations();

  // Handle RAB submission
  const handleSubmitRAB = async () => {
    if (!rabId) return;
    
    try {
      setIsSubmitting(true);
      await submitRABMutation.mutateAsync(rabId);
      toast.success('RAB berhasil diajukan');
    } catch (error) {
      console.error('Failed to submit RAB:', error);
      toast.error('Gagal mengajukan RAB');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle revisions after receiving feedback
  const handleRevisionSubmit = async (revisionNote: string) => {
    if (!rabId || !rabDetail) return;
    
    try {
      setIsSubmitting(true);
      await updateRABMutation.mutateAsync({
        rabId,
        rabData: {
          status: 'diajukan',
          submit_at: new Date().toISOString(),
          revisi_note: revisionNote
        }
      });
      
      setIsRevisionDialogOpen(false);
      toast.success('Revisi RAB berhasil diajukan');
    } catch (error) {
      console.error('Failed to submit RAB revision:', error);
      toast.error('Gagal mengajukan revisi RAB');
    } finally {
      setIsSubmitting(false);
    }
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
  if (isError || !rabDetail) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Detail RAB"
          description="Rencana Anggaran Biaya"
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
            Gagal memuat data RAB. Silakan coba lagi nanti atau hubungi admin.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const { rab, pemasukan, pengeluaran } = rabDetail;
  const totalPemasukan = pemasukan.reduce((sum, item) => sum + item.nominal, 0);
  const totalPengeluaran = pengeluaran.reduce((sum, item) => sum + item.nominal, 0);
  const saldo = totalPemasukan - totalPengeluaran;
  
  // Get status badge
  const getStatusBadge = () => {
    switch (rab.status) {
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
    switch (rab.status) {
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
            <DialogTitle>Submit RAB Revision</DialogTitle>
            <DialogDescription>
              After making necessary changes to the RAB, add your revision notes and submit the updated RAB.
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
    <div className="space-y-6">
      <PageHeader
        title="Detail RAB"
        description={`Periode ${formatPeriode(rab.periode_id)}`}
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
              <CardTitle>RAB {formatPeriode(rab.periode_id)}</CardTitle>
              <CardDescription>
                Dibuat pada: {formatDate(rab.created_at || '')}
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
            {rab.status === 'draft' && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>RAB dalam status draft</AlertTitle>
                <AlertDescription>
                  RAB ini belum diajukan ke Yayasan. Klik tombol "Ajukan RAB" untuk mengirimkan ke Yayasan.
                </AlertDescription>
              </Alert>
            )}
            
            {rab.status === 'revisi' && rab.pesan_revisi && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>RAB perlu direvisi</AlertTitle>
                <AlertDescription>
                  Catatan dari Yayasan: {rab.pesan_revisi}
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
                          <div className="bg-muted/50 p-3 flex items-center justify-between font-medium">
                            <div>Nama Pemasukan</div>
                            <div>Nominal</div>
                          </div>
                          <div className="divide-y">
                            {pemasukan.map((item, index) => (
                              <div key={index} className="p-3 flex items-center justify-between">
                                <div>{item.nama}</div>
                                <div>{formatCurrency(item.nominal)}</div>
                              </div>
                            ))}
                          </div>
                          <div className="bg-muted/30 p-3 flex items-center justify-between font-medium">
                            <div>Total Pemasukan</div>
                            <div>{formatCurrency(totalPemasukan)}</div>
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
                            <div className="col-span-3">Kategori</div>
                            <div className="col-span-4">Nama</div>
                            <div className="col-span-3">Detail</div>
                            <div className="col-span-2 text-right">Nominal</div>
                          </div>
                          <div className="divide-y">
                            {pengeluaran.map((item, index) => (
                              <div key={index} className="p-3 grid grid-cols-12 gap-2">
                                <div className="col-span-3">{item.kategori}</div>
                                <div className="col-span-4">{item.nama}</div>
                                <div className="col-span-3">{item.detail || '-'}</div>
                                <div className="col-span-2 text-right">{formatCurrency(item.nominal)}</div>
                              </div>
                            ))}
                          </div>
                          <div className="bg-muted/30 p-3 flex items-center justify-between font-medium">
                            <div>Total Pengeluaran</div>
                            <div>{formatCurrency(totalPengeluaran)}</div>
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
                            <Separator />
                            <div className="flex justify-between font-bold">
                              <span>Saldo Akhir:</span>
                              <span className={saldo >= 0 ? "text-green-600" : "text-red-600"}>
                                {formatCurrency(saldo)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {saldo < 0 && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Peringatan Saldo Negatif</AlertTitle>
                            <AlertDescription>
                              Total pengeluaran melebihi total pemasukan.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            {rab.status === 'draft' && (
              <div className="flex justify-end mt-4">
                <Button 
                  onClick={handleSubmitRAB} 
                  disabled={isSubmitting}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Ajukan RAB
                </Button>
              </div>
            )}
            
            {rab.status === 'revisi' && (
              <div className="flex justify-end mt-4">
                <Button 
                  onClick={() => navigate(`/pondok/rab/edit/${rab.id}`)}
                  variant="outline"
                  className="mr-2"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit RAB
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

export default PondokRABDetail;
