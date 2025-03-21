import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Building2, FileText, Check, X, Download, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LpjDetail = () => {
  const { lpjId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [commentText, setCommentText] = useState('');
  const [status, setStatus] = useState('pending');
  const [comments, setComments] = useState([
    { id: 1, user: 'Admin Pondok', text: 'LPJ telah dilengkapi dengan bukti transaksi.', date: '2023-06-10 14:22' }
  ]);

  // Mock LPJ data
  const lpjData = {
    id: lpjId || 'lpj-2023-1',
    pondokName: 'Pondok Al-Hikmah',
    pondokId: 'p1',
    period: 'Semester 1 2023/2024',
    submissionDate: '2023-06-10',
    status: 'pending',
    description: 'Laporan Pertanggungjawaban kegiatan operasional Pondok Al-Hikmah pada Semester 1 tahun ajaran 2023/2024.',
    attachments: [
      { id: 1, name: 'Bukti_Transaksi.pdf', size: '2.4 MB' },
      { id: 2, name: 'Nota_Pengeluaran.pdf', size: '1.8 MB' }
    ]
  };

  // Mock pemasukan data
  const pemasukan = [
    { id: 1, nama: 'Shodaqoh', rencana: 5000000, realisasi: 4800000 },
    { id: 2, nama: 'Uang Sewa Santri', rencana: 15000000, realisasi: 15000000 },
    { id: 3, nama: 'Kontribusi Wali Santri', rencana: 8000000, realisasi: 7500000 },
    { id: 4, nama: 'Donasi Alumni', rencana: 3500000, realisasi: 4200000 },
  ];

  // Mock pengeluaran data
  const pengeluaran = [
    { id: 1, nama: 'Kebutuhan Dapur', rencana: 8000000, realisasi: 8200000 },
    { id: 2, nama: 'Listrik dan Air', rencana: 3000000, realisasi: 2800000 },
    { id: 3, nama: 'Gaji Pengajar', rencana: 7500000, realisasi: 7500000 },
    { id: 4, nama: 'Perawatan Gedung', rencana: 5000000, realisasi: 4800000 },
    { id: 5, nama: 'ATK dan Keperluan Administrasi', rencana: 1500000, realisasi: 1450000 },
    { id: 6, nama: 'Kegiatan Ekstrakurikuler', rencana: 2000000, realisasi: 1950000 },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getPersentase = (realisasi, rencana) => {
    if (rencana === 0) return '0%';
    return `${Math.round((realisasi / rencana) * 100)}%`;
  };

  const totalRencanaPemasukan = pemasukan.reduce((sum, item) => sum + item.rencana, 0);
  const totalRealisasiPemasukan = pemasukan.reduce((sum, item) => sum + item.realisasi, 0);
  
  const totalRencanaPengeluaran = pengeluaran.reduce((sum, item) => sum + item.rencana, 0);
  const totalRealisasiPengeluaran = pengeluaran.reduce((sum, item) => sum + item.realisasi, 0);

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
      description: "Komentar berhasil ditambahkan ke LPJ",
    });
  };

  const handleApprove = () => {
    setStatus('approved');
    toast({
      title: "LPJ Disetujui",
      description: `LPJ untuk ${lpjData.pondokName} telah disetujui`,
    });
  };

  const handleReject = () => {
    setStatus('rejected');
    toast({
      title: "LPJ Ditolak",
      description: `LPJ untuk ${lpjData.pondokName} telah ditolak`,
      variant: "destructive",
    });
  };

  const handleDownload = (id) => {
    const file = lpjData.attachments.find(f => f.id === id);
    toast({
      title: "Mengunduh File",
      description: `Sedang mengunduh ${file.name}`,
    });
  };

  const handleViewPondok = () => {
    navigate(`/yayasan/pondok/${lpjData.pondokId}`);
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
        <Button variant="outline" size="sm" onClick={() => navigate('/yayasan/lpj')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        <PageHeader
          title={`Detail LPJ: ${lpjData.period}`}
          description={`Laporan Pertanggungjawaban untuk ${lpjData.pondokName}`}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Informasi LPJ</CardTitle>
              <CardDescription>Detail pengajuan LPJ</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(status === 'pending' ? lpjData.status : status)}
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
                  <span className="text-muted-foreground">ID LPJ:</span>
                  <span>{lpjData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nama Pondok:</span>
                  <span>{lpjData.pondokName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Periode:</span>
                  <span>{lpjData.period}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tanggal Pengajuan:</span>
                  <span>{new Date(lpjData.submissionDate).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Deskripsi</h3>
              <p className="text-muted-foreground">{lpjData.description}</p>
            </div>
          </div>

          <Tabs defaultValue="pemasukan" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="pemasukan">Pemasukan</TabsTrigger>
              <TabsTrigger value="pengeluaran">Pengeluaran</TabsTrigger>
              <TabsTrigger value="summary">Ringkasan</TabsTrigger>
              <TabsTrigger value="lampiran">Lampiran</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pemasukan">
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
                      <TableCell className="text-right">{getPersentase(item.realisasi, item.rencana)}</TableCell>
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
            
            <TabsContent value="pengeluaran">
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
                      <TableCell className="text-right">{getPersentase(item.realisasi, item.rencana)}</TableCell>
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
                        <span>Persentase Pemasukan:</span>
                        <span className="font-medium">{getPersentase(totalRealisasiPemasukan, totalRencanaPemasukan)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Pengeluaran (Rencana):</span>
                        <span className="font-medium">{formatCurrency(totalRencanaPengeluaran)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Pengeluaran (Realisasi):</span>
                        <span className="font-medium">{formatCurrency(totalRealisasiPengeluaran)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Persentase Pengeluaran:</span>
                        <span className="font-medium">{getPersentase(totalRealisasiPengeluaran, totalRencanaPengeluaran)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-bold">
                        <span>Saldo Akhir (Rencana):</span>
                        <span className={(totalRencanaPemasukan - totalRencanaPengeluaran) >= 0 ? "text-green-600" : "text-red-600"}>
                          {formatCurrency(totalRencanaPemasukan - totalRencanaPengeluaran)}
                        </span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Saldo Akhir (Realisasi):</span>
                        <span className={(totalRealisasiPemasukan - totalRealisasiPengeluaran) >= 0 ? "text-green-600" : "text-red-600"}>
                          {formatCurrency(totalRealisasiPemasukan - totalRealisasiPengeluaran)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="lampiran">
              <div className="space-y-4">
                {lpjData.attachments.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{file.size}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownload(file.id)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Unduh
                    </Button>
                  </div>
                ))}
              </div>
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
                placeholder="Tambahkan komentar atau catatan untuk LPJ ini..."
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
              Tolak LPJ
            </Button>
            <Button 
              className="w-full sm:w-auto"
              onClick={handleApprove}
            >
              <Check className="h-4 w-4 mr-2" />
              Setujui LPJ
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default LpjDetail;
