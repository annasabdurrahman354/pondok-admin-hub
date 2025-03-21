
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, AlertTriangle, FileText, FileBarChart, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetPendingPondoks, useGetAllRABs, useGetAllLPJs, useYayasanMutations } from '@/hooks/use-yayasan-data';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/services/formatUtils';

const YayasanDashboard = () => {
  const { data: pendingPondoks, isLoading: isPondoksLoading } = useGetPendingPondoks();
  const { data: pendingRABs, isLoading: isRABsLoading } = useGetAllRABs('diajukan', undefined, 5);
  const { data: pendingLPJs, isLoading: isLPJsLoading } = useGetAllLPJs('diajukan', undefined, 5);
  
  const { approvePondokMutation } = useYayasanMutations();

  const handleApprovePondok = (pondokId: string) => {
    approvePondokMutation.mutate(pondokId);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Yayasan"
        description="Pantau dan kelola semua Pondok dalam naungan Yayasan"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pondok</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPondoks?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {pendingPondoks?.filter(p => p.status_acc).length || 0} Aktif
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Persetujuan Pondok</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPondoks?.filter(p => !p.status_acc).length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Menunggu persetujuan
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RAB Baru</CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRABs?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Menunggu persetujuan
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">LPJ Baru</CardTitle>
            <FileBarChart className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingLPJs?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Menunggu persetujuan
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Pending Pondok Approvals */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Persetujuan Pondok</CardTitle>
            <CardDescription>
              Pondok yang menunggu persetujuan untuk diaktifkan
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isPondoksLoading ? (
              <div className="flex justify-center py-4">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : pendingPondoks?.filter(p => !p.status_acc).length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                Tidak ada Pondok yang menunggu persetujuan
              </div>
            ) : (
              <div className="space-y-4">
                {pendingPondoks?.filter(p => !p.status_acc).map((pondok) => (
                  <div key={pondok.id} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h4 className="font-medium">{pondok.nama}</h4>
                      <p className="text-sm text-muted-foreground">{pondok.alamat}, {pondok.kota}</p>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => handleApprovePondok(pondok.id)}
                      disabled={approvePondokMutation.isPending}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Setujui
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link to="/yayasan/pondok">Lihat Semua Pondok</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent RAB Submissions */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>RAB Terbaru</CardTitle>
            <CardDescription>
              RAB yang baru diajukan oleh Pondok
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isRABsLoading ? (
              <div className="flex justify-center py-4">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : pendingRABs?.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                Tidak ada RAB yang baru diajukan
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRABs?.map((rab: any) => (
                  <div key={rab.id} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h4 className="font-medium">{rab.pondok?.nama || 'Unknown Pondok'}</h4>
                      <p className="text-sm text-muted-foreground">
                        Periode: {rab.periode_id.substring(0, 4)}/{rab.periode_id.substring(4, 6)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Diajukan: {formatDate(rab.submit_at)}
                      </p>
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <Link to={`/yayasan/rab/${rab.id}`}>Detail</Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link to="/yayasan/rab">Lihat Semua RAB</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent LPJ Submissions */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>LPJ Terbaru</CardTitle>
            <CardDescription>
              LPJ yang baru diajukan oleh Pondok
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLPJsLoading ? (
              <div className="flex justify-center py-4">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : pendingLPJs?.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                Tidak ada LPJ yang baru diajukan
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingLPJs?.map((lpj: any) => (
                  <div key={lpj.id} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h4 className="font-medium">{lpj.pondok?.nama || 'Unknown Pondok'}</h4>
                      <p className="text-sm text-muted-foreground">
                        Periode: {lpj.periode_id.substring(0, 4)}/{lpj.periode_id.substring(4, 6)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Diajukan: {formatDate(lpj.submit_at)}
                      </p>
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <Link to={`/yayasan/lpj/${lpj.id}`}>Detail</Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link to="/yayasan/lpj">Lihat Semua LPJ</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default YayasanDashboard;
