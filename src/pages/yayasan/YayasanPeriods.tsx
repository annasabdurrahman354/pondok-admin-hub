import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Save } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { supabase } from '@/lib/client';

// Type definition
type Periode = {
  id: string; // Format YYYYMM
  tahap: "RAB" | "LPJ" | string;
};

const YayasanPeriods = () => {
  const { toast } = useToast();
  const [periods, setPeriods] = useState<Periode[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedTahap, setSelectedTahap] = useState<string>("RAB");
  const [loading, setLoading] = useState(true);

  // Month names in Indonesian
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Fetch periods from Supabase
  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        const { data, error } = await supabase
          .from('periode')
          .select('*');
        
        if (error) throw error;
        
        // Use only id and tahap fields
        const formattedPeriods = data.map(period => ({
          id: period.id,
          tahap: period.tahap,
        }));
        
        setPeriods(formattedPeriods);
      } catch (error) {
        console.error('Error fetching periods:', error);
        toast({
          title: "Gagal Memuat Data",
          description: "Terjadi kesalahan saat memuat periode",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPeriods();
  }, [toast]);

  // Helper to format period ID to readable text
  const formatPeriodIdToReadable = (id: string) => {
    if (!id || id.length !== 6) return id;
    
    const year = id.substring(0, 4);
    const month = parseInt(id.substring(4, 6));
    
    return `${monthNames[month - 1]} ${year}`;
  };

  // Generate period ID in YYYYMM format
  const generatePeriodId = (monthIndex: number, year: string) => {
    const monthNum = monthIndex + 1;
    return `${year}${monthNum.toString().padStart(2, '0')}`;
  };

  const handleAddPeriod = async () => {
    if (!selectedMonth || !selectedYear) {
      toast({
        title: "Validasi Gagal",
        description: "Bulan dan tahun harus dipilih",
        variant: "destructive",
      });
      return;
    }

    const monthIndex = monthNames.findIndex(month => month === selectedMonth);
    if (monthIndex === -1) {
      toast({
        title: "Validasi Gagal",
        description: "Bulan tidak valid",
        variant: "destructive",
      });
      return;
    }

    const periodId = generatePeriodId(monthIndex, selectedYear);
    const tahap = selectedTahap;

    try {
      setLoading(true);
      
      // If adding RAB, clear any existing RAB phase
      // If adding LPJ, clear any existing LPJ phase
      if (tahap === "RAB" || tahap === "LPJ") {
        await supabase
          .from('periode')
          .update({ tahap: "" })
          .eq('tahap', tahap);
      }
      
      // Check if period ID already exists
      const { data: existingPeriod } = await supabase
        .from('periode')
        .select('*')
        .eq('id', periodId)
        .single();
      
      let operation;
      
      if (existingPeriod) {
        // Update existing period
        operation = supabase
          .from('periode')
          .update({
            tahap: tahap
          })
          .eq('id', periodId);
      } else {
        // Insert new period
        operation = supabase
          .from('periode')
          .insert({
            id: periodId,
            tahap: tahap
          });
      }
      
      const { error } = await operation;
      
      if (error) throw error;
      
      // Add to UI state
      const newPeriod = {
        id: periodId,
        tahap
      };
      
      // Filter out any period with the same tahap (should be cleared in DB by now)
      const updatedPeriods = periods
        .map(p => p.tahap === tahap ? { ...p, tahap: "" } : p)
        .filter(p => p.id !== periodId); // Remove existing with same ID if any
      
      setPeriods([...updatedPeriods, newPeriod]);
      
      toast({
        title: "Periode Berhasil Ditambahkan",
        description: `Periode ${formatPeriodIdToReadable(periodId)} (${tahap}) telah berhasil ditambahkan`,
      });
      
      // Reset form
      setSelectedMonth("");
      setSelectedYear(new Date().getFullYear().toString());
      setSelectedTahap("RAB");
      setIsAddDialogOpen(false);
      
    } catch (error) {
      console.error('Error adding period:', error);
      toast({
        title: "Gagal Menambahkan Periode",
        description: "Terjadi kesalahan saat menyimpan periode",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeTahap = async (periodId: string, newTahap: string) => {
    try {
      setLoading(true);
      
      // Clear any existing period with the same tahap
      await supabase
        .from('periode')
        .update({ tahap: "" })
        .eq('tahap', newTahap);
      
      // Update this period's tahap
      const { error } = await supabase
        .from('periode')
        .update({ tahap: newTahap })
        .eq('id', periodId);
      
      if (error) throw error;
      
      // Update UI state
      setPeriods(
        periods.map(period => {
          // Clear tahap from any period that previously had it
          if (period.tahap === newTahap) {
            return { ...period, tahap: "" };
          }
          
          // Set the new tahap for the selected period
          if (period.id === periodId) {
            return { ...period, tahap: newTahap };
          }
          
          return period;
        })
      );
      
      toast({
        title: "Tahap Periode Berhasil Diubah",
        description: `Periode ${formatPeriodIdToReadable(periodId)} sekarang menjadi tahap ${newTahap}`,
      });
    } catch (error) {
      console.error('Error changing period tahap:', error);
      toast({
        title: "Gagal Mengubah Tahap",
        description: "Terjadi kesalahan saat mengubah tahap periode",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate years for dropdown (current year -5 to +5)
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      years.push(i.toString());
    }
    return years;
  };

  // Get tahap badge class
  const getTahapBadgeClass = (tahap: string) => {
    switch (tahap) {
      case "RAB":
        return 'bg-purple-100 text-purple-800';
      case "LPJ":
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Manajemen Periode"
        description="Atur periode RAB dan LPJ untuk semua pondok di bawah yayasan"
      />

      <div className="flex justify-end">
        <Button onClick={() => setIsAddDialogOpen(true)} disabled={loading}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Periode Baru
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Periode</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {periods.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">Belum ada periode yang ditambahkan</p>
              ) : (
                periods.map((period) => (
                  <div key={period.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{formatPeriodIdToReadable(period.id)}</h3>
                      <div className="flex space-x-2 mt-2">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${getTahapBadgeClass(period.tahap)}`}>
                          {period.tahap ? "Pengisian " + period.tahap : "Tidak Aktif"}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant={period.tahap === "RAB" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => handleChangeTahap(period.id, "RAB")}
                        disabled={loading || period.tahap === "RAB"}
                        className={period.tahap === "RAB" ? "bg-purple-600 hover:bg-purple-700" : ""}
                      >
                        RAB
                      </Button>
                      <Button 
                        variant={period.tahap === "LPJ" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => handleChangeTahap(period.id, "LPJ")}
                        disabled={loading || period.tahap === "LPJ"}
                        className={period.tahap === "LPJ" ? "bg-orange-600 hover:bg-orange-700" : ""}
                      >
                        LPJ
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Periode Baru</DialogTitle>
            <DialogDescription>
              Pilih bulan, tahun, dan jenis periode (RAB atau LPJ)
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bulan</Label>
                <Select 
                  value={selectedMonth}
                  onValueChange={setSelectedMonth}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih bulan" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthNames.map((month, index) => (
                      <SelectItem key={index} value={month}>{month}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Tahun</Label>
                <Select 
                  value={selectedYear}
                  onValueChange={setSelectedYear}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tahun" />
                  </SelectTrigger>
                  <SelectContent>
                    {generateYearOptions().map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Jenis Periode</Label>
              <ToggleGroup 
                type="single"
                variant='outline'
                value={selectedTahap}
                onValueChange={(value) => {
                  if (value) setSelectedTahap(value);
                }}
                className="justify-start"
              >
                <ToggleGroupItem value="RAB" className="px-4">
                  RAB
                </ToggleGroupItem>
                <ToggleGroupItem value="LPJ" className="px-4">
                  LPJ
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            
            <div className="p-4 bg-amber-50 rounded-md text-sm">
              <p className="font-medium text-amber-800">Catatan:</p>
              <p className="text-amber-700">
                Saat menambahkan periode baru sebagai {selectedTahap}, semua periode {selectedTahap} yang ada sebelumnya akan dinonaktifkan.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Batal</Button>
            <Button onClick={handleAddPeriod} disabled={loading}>
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