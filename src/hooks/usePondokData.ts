
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { 
  fetchPondokWithPengurus,
  fetchRABs,
  fetchLPJs,
  fetchRABDetail,
  fetchLPJDetail,
  updatePondokData,
  updatePengurusData,
  deletePengurus,
  createRAB,
  updateRAB,
  submitRAB,
  deleteRAB,
  createLPJ,
  updateLPJ,
  submitLPJ,
  deleteLPJ
} from '@/services/apiService';
import { Pondok, PengurusPondok, RAB, LPJ, RABPemasukan, RABPengeluaran, LPJPemasukan, LPJPengeluaran } from '@/types/dataTypes';

export const usePondokData = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const pondokId = user?.pondokId;

  // Queries
  const useGetPondok = () => {
    return useQuery({
      queryKey: ['pondok', pondokId],
      queryFn: () => fetchPondokWithPengurus(pondokId!),
      enabled: !!pondokId,
    });
  };

  const useGetRABs = (limit = 10) => {
    return useQuery({
      queryKey: ['rabs', pondokId, limit],
      queryFn: () => fetchRABs(pondokId!, limit),
      enabled: !!pondokId,
    });
  };

  const useGetLPJs = (limit = 10) => {
    return useQuery({
      queryKey: ['lpjs', pondokId, limit],
      queryFn: () => fetchLPJs(pondokId!, limit),
      enabled: !!pondokId,
    });
  };

  const useGetRABDetail = (rabId: string) => {
    return useQuery({
      queryKey: ['rab', rabId],
      queryFn: () => fetchRABDetail(rabId),
      enabled: !!rabId,
    });
  };

  const useGetLPJDetail = (lpjId: string) => {
    return useQuery({
      queryKey: ['lpj', lpjId],
      queryFn: () => fetchLPJDetail(lpjId),
      enabled: !!lpjId,
    });
  };

  // Mutations
  const useUpdatePondok = () => {
    return useMutation({
      mutationFn: (data: Partial<Pondok>) => updatePondokData(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['pondok', pondokId] });
      },
    });
  };

  const useUpdatePengurus = () => {
    return useMutation({
      mutationFn: (data: PengurusPondok) => updatePengurusData(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['pondok', pondokId] });
      },
    });
  };

  const useDeletePengurus = () => {
    return useMutation({
      mutationFn: (pengurusId: string) => deletePengurus(pengurusId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['pondok', pondokId] });
      },
    });
  };

  const useCreateRAB = () => {
    return useMutation({
      mutationFn: (data: {
        periodeId: string;
        pemasukan: Omit<RABPemasukan, 'id' | 'rab_id'>[];
        pengeluaran: Omit<RABPengeluaran, 'id' | 'rab_id'>[];
      }) => createRAB(pondokId!, data.periodeId, data.pemasukan, data.pengeluaran),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['rabs', pondokId] });
      },
    });
  };

  const useUpdateRAB = () => {
    return useMutation({
      mutationFn: (data: {
        rabId: string;
        rabData: Partial<RAB>;
        pemasukan?: RABPemasukan[];
        pengeluaran?: RABPengeluaran[];
      }) => updateRAB(data.rabId, data.rabData, data.pemasukan, data.pengeluaran),
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['rab', variables.rabId] });
        queryClient.invalidateQueries({ queryKey: ['rabs', pondokId] });
      },
    });
  };

  const useSubmitRAB = () => {
    return useMutation({
      mutationFn: (rabId: string) => submitRAB(rabId),
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['rab', variables] });
        queryClient.invalidateQueries({ queryKey: ['rabs', pondokId] });
      },
    });
  };

  const useDeleteRAB = () => {
    return useMutation({
      mutationFn: (rabId: string) => deleteRAB(rabId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['rabs', pondokId] });
      },
    });
  };

  const useCreateLPJ = () => {
    return useMutation({
      mutationFn: (data: {
        periodeId: string;
        pemasukan: Omit<LPJPemasukan, 'id' | 'lpj_id'>[];
        pengeluaran: Omit<LPJPengeluaran, 'id' | 'lpj_id'>[];
      }) => createLPJ(pondokId!, data.periodeId, data.pemasukan, data.pengeluaran),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['lpjs', pondokId] });
      },
    });
  };

  const useUpdateLPJ = () => {
    return useMutation({
      mutationFn: (data: {
        lpjId: string;
        lpjData: Partial<LPJ>;
        pemasukan?: LPJPemasukan[];
        pengeluaran?: LPJPengeluaran[];
      }) => updateLPJ(data.lpjId, data.lpjData, data.pemasukan, data.pengeluaran),
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['lpj', variables.lpjId] });
        queryClient.invalidateQueries({ queryKey: ['lpjs', pondokId] });
      },
    });
  };

  const useSubmitLPJ = () => {
    return useMutation({
      mutationFn: (lpjId: string) => submitLPJ(lpjId),
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['lpj', variables] });
        queryClient.invalidateQueries({ queryKey: ['lpjs', pondokId] });
      },
    });
  };

  const useDeleteLPJ = () => {
    return useMutation({
      mutationFn: (lpjId: string) => deleteLPJ(lpjId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['lpjs', pondokId] });
      },
    });
  };

  return {
    useGetPondok,
    useGetRABs,
    useGetLPJs,
    useGetRABDetail,
    useGetLPJDetail,
    useUpdatePondok,
    useUpdatePengurus,
    useDeletePengurus,
    useCreateRAB,
    useUpdateRAB,
    useSubmitRAB,
    useDeleteRAB,
    useCreateLPJ,
    useUpdateLPJ,
    useSubmitLPJ,
    useDeleteLPJ,
  };
};
