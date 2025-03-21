import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, Plus, Save, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const YayasanPeriods = () => {
  const { toast } = useToast();
  const [periods, setPeriods] = useState([
    { id: 1, name: 'Semester 1 2023/2024', startDate: new Date(2023, 6, 1), endDate: new Date(2023, 11, 31), status: 'active' },
    { id: 2, name: 'Semester 2 2023/2024', startDate: new Date(2024, 0, 1), endDate: new Date(2024, 5, 30), status: 'upcoming' },
  ]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPeriod, setNewPeriod] = useState({
    name: '',
    startDate: undefined,
    endDate: undefined,
    status: 'upcoming',
  });

  const handleAddPeriod = () => {
    if (!newPeriod.name || !newPeriod.startDate || !newPeriod.endDate) {
      toast({
        title: "Validasi Gagal",
        description: "Nama periode dan tanggal harus diisi",
        variant: "destructive",
      });
      return;
    }

    setPeriods([
      ...periods,
      {
        id: periods.length + 1,
        name: newPeriod.name,
        startDate: newPeriod.startDate,
        endDate: newPeriod.endDate,
        status: newPeriod.status,
      },
    ]);

    toast({
      title: "Periode Berhasil Ditambahkan",
      description: `Periode ${newPeriod.name} telah berhasil ditambahkan`,
    });

    setNewPeriod({
      name: '',
      startDate: undefined,
      endDate: undefined,
      status: 'upcoming',
    });
    setIsAddDialogOpen(false);
  };

  const handleDeletePeriod = (id) => {
    setPeriods(periods.filter(period => period.id !== id));
    toast({
      title: "Periode Berhasil Dihapus",
      description: "Periode telah berhasil dihapus dari sistem",
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Manajemen Periode"
        description="Atur periode anggaran untuk semua pondok di bawah yayasan"
      />

      <div className="flex justify-end">
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Periode Baru
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Periode</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {periods.map((period) => (
              <div key={period.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{period.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(period.startDate, 'dd MMMM yyyy')} - {format(period.endDate, 'dd MMMM yyyy')}
                  </p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${getStatusBadgeClass(period.status)}`}>
                    {period.status === 'active' ? 'Aktif' : period.status === 'upcoming' ? 'Akan Datang' : 'Selesai'}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeletePeriod(period.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Periode Baru</DialogTitle>
            <DialogDescription>
              Buat periode anggaran baru untuk semua pondok di bawah yayasan
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="period-name">Nama Periode</Label>
              <Input 
                id="period-name" 
                placeholder="Contoh: Semester 1 2023/2024"
                value={newPeriod.name}
                onChange={(e) => setNewPeriod({...newPeriod, name: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tanggal Mulai</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newPeriod.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newPeriod.startDate ? format(newPeriod.startDate, "PPP") : "Pilih tanggal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newPeriod.startDate}
                      onSelect={(date) => setNewPeriod({...newPeriod, startDate: date})}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>Tanggal Selesai</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newPeriod.endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newPeriod.endDate ? format(newPeriod.endDate, "PPP") : "Pilih tanggal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newPeriod.endDate}
                      onSelect={(date) => setNewPeriod({...newPeriod, endDate: date})}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={newPeriod.status}
                onValueChange={(value) => setNewPeriod({...newPeriod, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Akan Datang</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Batal</Button>
            <Button onClick={handleAddPeriod}>
              <Save className="w-4 h-4 mr-2" />
              Simpan Periode
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default YayasanPeriods;
