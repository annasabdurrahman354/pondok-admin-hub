
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FilePlus, FileText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetRABs } from '@/hooks/use-pondok-data';
import { fetchRABPeriode } from '@/services/apiService';
import { useEffect } from 'react';
import EmptyState from '@/components/pondok/EmptyState';
import { toast } from 'sonner';
import RABItem from '@/components/pondok/RABItem';

const PondokRABList = () => {
  const navigate = useNavigate();
  const [periodeFilter, setPeriodeFilter] = useState<string>('all');
  const [currentPeriodeId, setCurrentPeriodeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { data: rabs = [], isLoading: isLoadingRabs } = useGetRABs(100); // Get all RABs
  
  // Fetch current periode on component mount
  useEffect(() => {
    const getPeriode = async () => {
      try {
        setIsLoading(true);
        const periode = await fetchRABPeriode();
        if (periode) {
          setCurrentPeriodeId(periode.id);
        }
      } catch (error) {
        console.error('Failed to fetch periode:', error);
        toast.error('Gagal mengambil periode RAB saat ini');
      } finally {
        setIsLoading(false);
      }
    };
    
    getPeriode();
  }, []);
  
  // Check if user already has a RAB for the current period
  const currentPeriodRAB = rabs.find(rab => rab.periode_id === currentPeriodeId);
  const hasCurrentRAB = !!currentPeriodRAB;
  
  // Get unique periods from RABs for the filter
  const periods = Array.from(new Set(rabs.map(rab => rab.periode_id))).sort((a, b) => b.localeCompare(a));
  
  // Filter RABs based on selected period
  const filteredRABs = periodeFilter === 'all' 
    ? rabs 
    : rabs.filter(rab => rab.periode_id === periodeFilter);
  
  // Format period for display
  const formatPeriode = (periodeId: string) => {
    const year = periodeId.substring(0, 4);
    const month = periodeId.substring(4, 6);
    return `${year}-${month}`;
  };
  
  if (isLoading || isLoadingRabs) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Rencana Anggaran Biaya"
        description="Daftar RAB Pondok"
      />
      
      {!hasCurrentRAB && currentPeriodeId && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="text-lg font-medium">Periode RAB Aktif: {formatPeriode(currentPeriodeId)}</h3>
                <p className="text-muted-foreground">Anda belum membuat RAB untuk periode ini</p>
              </div>
              <Button onClick={() => navigate('/pondok/rab')}>
                <FilePlus className="w-4 h-4 mr-2" />
                Buat RAB Periode Ini
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar RAB</h2>
        <Select value={periodeFilter} onValueChange={setPeriodeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Pilih Periode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Periode</SelectItem>
            {periods.map((period) => (
              <SelectItem key={period} value={period}>
                {formatPeriode(period)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-4">
        {filteredRABs.length === 0 ? (
          <EmptyState
            title="Belum Ada RAB"
            description="Anda belum memiliki RAB yang tersimpan"
            buttonText="Buat RAB Baru"
            buttonLink="/pondok/rab"
          />
        ) : (
          filteredRABs.map((rab, index) => (
            <RABItem
              key={rab.id}
              rab={rab}
              index={index}
              onClick={() => navigate(`/pondok/rab/detail/${rab.id}`)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PondokRABList;
