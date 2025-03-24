
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FilePlus, FileText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetLPJs } from '@/hooks/use-pondok-data';
import { fetchLPJPeriode } from '@/services/apiService';
import { useEffect } from 'react';
import EmptyState from '@/components/pondok/EmptyState';
import { toast } from 'sonner';
import LPJItem from '@/components/pondok/LPJItem';

const PondokLPJList = () => {
  const navigate = useNavigate();
  const [periodeFilter, setPeriodeFilter] = useState<string>('all');
  const [currentPeriodeId, setCurrentPeriodeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { data: lpjs = [], isLoading: isLoadingLpjs } = useGetLPJs(100); // Get all LPJs
  
  // Fetch current periode on component mount
  useEffect(() => {
    const getPeriode = async () => {
      try {
        setIsLoading(true);
        const periode = await fetchLPJPeriode();
        if (periode) {
          setCurrentPeriodeId(periode.id);
        }
      } catch (error) {
        console.error('Failed to fetch periode:', error);
        toast.error('Gagal mengambil periode LPJ saat ini');
      } finally {
        setIsLoading(false);
      }
    };
    
    getPeriode();
  }, []);
  
  // Check if user already has an LPJ for the current period
  const currentPeriodLPJ = lpjs.find(lpj => lpj.periode_id === currentPeriodeId);
  const hasCurrentLPJ = !!currentPeriodLPJ;
  
  // Get unique periods from LPJs for the filter
  const periods = Array.from(new Set(lpjs.map(lpj => lpj.periode_id))).sort((a, b) => b.localeCompare(a));
  
  // Filter LPJs based on selected period
  const filteredLPJs = periodeFilter === 'all' 
    ? lpjs 
    : lpjs.filter(lpj => lpj.periode_id === periodeFilter);
  
  // Format period for display
  const formatPeriode = (periodeId: string) => {
    const year = periodeId.substring(0, 4);
    const month = periodeId.substring(4, 6);
    return `${year}-${month}`;
  };
  
  if (isLoading || isLoadingLpjs) {
    return (
      <div className="flex justify-center align-middle items-center py-6 min-h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title="Laporan Pertanggungjawaban"
        description="Daftar LPJ Pondok"
      />
      
      {!hasCurrentLPJ && currentPeriodeId && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="text-lg font-medium">Periode LPJ Aktif: {formatPeriode(currentPeriodeId)}</h3>
                <p className="text-muted-foreground">Anda belum membuat LPJ untuk periode ini</p>
              </div>
              <Button onClick={() => navigate('/pondok/lpj')}>
                <FilePlus className="w-4 h-4 mr-2" />
                Buat LPJ Bulan Ini
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Daftar LPJ</h2>
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
        {filteredLPJs.length === 0 ? (
          <EmptyState
            title="Belum Ada LPJ"
            description="Anda belum memiliki LPJ yang tersimpan"
            buttonText="Buat LPJ Baru"
            buttonLink="/pondok/lpj"
          />
        ) : (
          filteredLPJs.map((lpj, index) => (
            <LPJItem
              key={lpj.id}
              lpj={lpj}
              index={index}
              onClick={() => navigate(`/pondok/lpj/detail/${lpj.id}`)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PondokLPJList;
