import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { FileUp, Save, Upload } from 'lucide-react';

const PondokCreate = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('rab');
  const [documentType, setDocumentType] = useState('rab');
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentDesc, setDocumentDesc] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleCreateDocument = () => {
    if (!documentTitle) {
      toast({
        title: "Validasi Gagal",
        description: "Judul dokumen harus diisi",
        variant: "destructive",
      });
      return;
    }

    const docTypeText = documentType === 'rab' ? 'RAB' : 'LPJ';
    
    toast({
      title: `${docTypeText} Berhasil Dibuat`,
      description: `${docTypeText} dengan judul "${documentTitle}" telah dibuat`,
    });

    // Reset form
    setDocumentTitle('');
    setDocumentDesc('');
    setSelectedFile(null);
  };

  const handleImportTemplate = () => {
    toast({
      title: "Template Berhasil Diimpor",
      description: "Template telah berhasil diimpor ke dalam dokumen Anda",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Buat Dokumen Baru"
        description="Buat RAB atau LPJ baru untuk pondok Anda"
      />

      <Card>
        <CardHeader>
          <CardTitle>Dokumen Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="rab" className="w-full" onValueChange={(value) => {
            setActiveTab(value);
            setDocumentType(value);
          }}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="rab">Rencana Anggaran Biaya</TabsTrigger>
              <TabsTrigger value="lpj">Laporan Pertanggungjawaban</TabsTrigger>
            </TabsList>
            
            <TabsContent value="rab" className="space-y-6">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="rab-title">Judul RAB</Label>
                  <Input 
                    id="rab-title"
                    placeholder="Contoh: RAB Kegiatan Ramadhan 2023"
                    value={documentTitle}
                    onChange={(e) => setDocumentTitle(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="rab-desc">Deskripsi (Opsional)</Label>
                  <Textarea 
                    id="rab-desc"
                    placeholder="Deskripsi lengkap tentang RAB ini"
                    rows={4}
                    value={documentDesc}
                    onChange={(e) => setDocumentDesc(e.target.value)}
                  />
                </div>
                
                <div className="border-2 border-dashed rounded-lg p-6 text-center mt-4">
                  <input
                    type="file"
                    id="file-upload-rab"
                    className="hidden"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                  />
                  <label
                    htmlFor="file-upload-rab"
                    className="cursor-pointer block"
                  >
                    <FileUp className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <span className="text-lg font-medium block">
                      {selectedFile ? selectedFile.name : "Impor Template RAB (Opsional)"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Klik untuk memilih file spreadsheet atau seret file ke sini
                    </span>
                  </label>
                </div>
                
                {selectedFile && (
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setSelectedFile(null)}>
                      Batal
                    </Button>
                    <Button onClick={handleImportTemplate} variant="secondary">
                      <Upload className="w-4 h-4 mr-2" />
                      Impor Template
                    </Button>
                  </div>
                )}
                
                <div className="flex justify-end mt-4">
                  <Button onClick={handleCreateDocument} size="lg">
                    <Save className="w-4 h-4 mr-2" />
                    Buat RAB Baru
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="lpj" className="space-y-6">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="lpj-title">Judul LPJ</Label>
                  <Input 
                    id="lpj-title"
                    placeholder="Contoh: LPJ Kegiatan Ramadhan 2023"
                    value={documentTitle}
                    onChange={(e) => setDocumentTitle(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="lpj-desc">Deskripsi (Opsional)</Label>
                  <Textarea 
                    id="lpj-desc"
                    placeholder="Deskripsi lengkap tentang LPJ ini"
                    rows={4}
                    value={documentDesc}
                    onChange={(e) => setDocumentDesc(e.target.value)}
                  />
                </div>
                
                <div className="border-2 border-dashed rounded-lg p-6 text-center mt-4">
                  <input
                    type="file"
                    id="file-upload-lpj"
                    className="hidden"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                  />
                  <label
                    htmlFor="file-upload-lpj"
                    className="cursor-pointer block"
                  >
                    <FileUp className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <span className="text-lg font-medium block">
                      {selectedFile ? selectedFile.name : "Impor Data dari RAB (Opsional)"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Klik untuk memilih file RAB atau seret file ke sini
                    </span>
                  </label>
                </div>
                
                {selectedFile && (
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setSelectedFile(null)}>
                      Batal
                    </Button>
                    <Button onClick={handleImportTemplate} variant="secondary">
                      <Upload className="w-4 h-4 mr-2" />
                      Impor Data RAB
                    </Button>
                  </div>
                )}
                
                <div className="flex justify-end mt-4">
                  <Button onClick={handleCreateDocument} size="lg">
                    <Save className="w-4 h-4 mr-2" />
                    Buat LPJ Baru
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PondokCreate;
