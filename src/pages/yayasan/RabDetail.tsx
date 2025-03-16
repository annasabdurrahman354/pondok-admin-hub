
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Building2, FileText, Check, X, Send, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RabDetail = () => {
  const { rabId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [commentText, setCommentText] = useState('');
  const [status, setStatus] = useState('pending');
  const [comments, setComments] = useState([
    { id: 1, user: 'Admin Yayasan', text: 'Mohon cek kembali anggaran untuk kebutuhan dapur.', date: '2023-06-05 10:30' }
  ]);

  // Mock RAB data
  const rabData = {
    id: rabId || 'rab-2023-1',
    pondokName: 'Pondok Al-Hikmah',
    pondokId: 'p1',
    period: 'Semester 1 2023/2024',
    submissionDate: '2023-05-28',
    status: 'pending',
    description: 'Rencana Anggaran Biaya untuk kegiatan operasional Pondok Al-Hikmah pada Semester 1 tahun ajaran 2023/2024.',
  };

  // Mock pemasukan data
  const pemasukan = [
    { id: 1, nama: 'Shodaqoh', nominal: 5000000 },
    { id: 2, nama: 'Uang Sewa Santri', nominal: 15000000 },
    { id: 3, nama: 'Kontribusi Wali Santri', nominal: 8000000 },
    { id: 4, nama: 'Donasi Alumni', nominal: 3500000 },
  ];

  // Mock pengeluaran data
  const pengeluaran = [
    { id: 1, nama: 'Kebutuhan Dapur', nominal: 8000000 },
    { id: 2, nama: 'Listrik dan Air', nominal: 3000000 },
    { id: 3, nama: 'Gaji Pengajar', nominal: 7500000 },
    { id: 4, nama: 'Perawatan Gedung', nominal: 5000000 },
    { id: 5, nama: 'ATK dan Keperluan Administrasi', nominal: 1500000 },
    { id: 6, nama: 'Kegiatan Ekstrakurikuler', nominal: 2000000 },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const totalPemasukan = pemasukan.reduce((sum, item) => sum + item.nominal, 0);
  const totalPengeluaran = pengeluaran.reduce((sum, item) => sum + item.nominal, 0);
  const saldo = totalPemasukan - totalPengeluaran;

  const handleAddComment = () => {
    if (!commentText.trim()) {
      toast({
        title: "Komentar Kosong",
        description: "Silakan masukkan komentar terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    const newComment = {
      id: comments.length + 1,
      user: 'Admin Yayasan',
      text: commentText,
      date: new Date().toLocaleString('id-ID')
    };

    setComments([...comments, newComment]);
    setCommentText('');

    toast({
      title: "Komentar Ditambahkan",
      description: "Komentar berhasil ditambahkan ke RAB",
    });
  };

  const handleApprove = () => {
    setStatus('approved');
    toast({
      title: "RAB Disetujui",
      description: `RAB untuk ${rabData.pondokName} telah disetujui`,
    });
  };

  const handleReject = () => {
    setStatus('rejected');
    toast({
      title: "RAB Ditolak",
      description: `RAB untuk ${rabData.pondokName} telah ditolak`,
      variant: "destructive",
    });
  };

  const handleViewPondok = () => {
    navigate(`/yayasan/pondok/${rabData.pondokId}`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Menunggu Persetujuan</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Disetujui</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Ditolak</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/yayasan/rab')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        <PageHeader
          title={`Detail RAB: ${rabData.period}`}
          description={`Rencana Anggaran Biaya untuk ${rabData.pondokName}`}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Informasi RAB</CardTitle>
              <CardDescription>Detail pengajuan RAB</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(status === 'pending' ? rabData.status : status)}
              <Button variant="outline" size="sm" onClick={handleViewPondok}>
                <Building2 className="h-4 w-4 mr-2" />
                Lihat Pondok
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium mb-2">Informasi Dasar</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID RAB:</span>
                  <span>{rabData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nama Pondok:</span>
                  <span>{rabData.pondokName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Periode:</span>
                  <span>{rabData.period}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tanggal Pengajuan:</span>
                  <span>{new Date(rabData.submissionDate).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Deskripsi</h3>
              <p className="text-muted-foreground">{rabData.description}</p>
            </div>
          </div>

          <Tabs defaultValue="pemasukan" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="pemasukan">Pemasukan</TabsTrigger>
              <TabsTrigger value="pengeluaran">Pengeluaran</TabsTrigger>
              <TabsTrigger value="summary">Ringkasan</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pemasukan">
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
            
            <TabsContent value="pengeluaran">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nama Pengeluaran</TableHead>
                    <TableHead className="text-right">Nominal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pengeluaran.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.nama}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.nominal)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-t-2">
                    <TableCell colSpan={2} className="font-bold">Total Pengeluaran</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(totalPengeluaran)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="summary">
              <Card className="border-none shadow-none">
                <CardContent className="p-0">
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
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Komentar & Persetujuan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-muted/30 p-3 rounded-md">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{comment.user}</span>
                  <span className="text-sm text-muted-foreground">{comment.date}</span>
                </div>
                <p>{comment.text}</p>
              </div>
            ))}
            
            <div className="space-y-2">
              <Textarea
                placeholder="Tambahkan komentar atau catatan untuk RAB ini..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Button 
                variant="secondary" 
                onClick={handleAddComment}
                className="w-full sm:w-auto"
              >
                Tambah Komentar
              </Button>
            </div>
          </div>
        </CardContent>
        
        {status === 'pending' && (
          <CardFooter className="flex flex-col sm:flex-row items-center gap-3 border-t pt-6">
            <Button
              variant="outline"
              className="w-full sm:w-auto bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:text-red-800"
              onClick={handleReject}
            >
              <X className="h-4 w-4 mr-2" />
              Tolak RAB
            </Button>
            <Button 
              className="w-full sm:w-auto"
              onClick={handleApprove}
            >
              <Check className="h-4 w-4 mr-2" />
              Setujui RAB
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default RabDetail;
