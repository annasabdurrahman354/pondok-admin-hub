import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  deleteLPJ,
  fetchAllUserProfie,
  fetchUserProfile,
  fetchPondokData
} from '@/services/apiService';
import { Pondok, PengurusPondok, RAB, LPJ, RABPemasukan, RABPengeluaran, LPJPemasukan, LPJPengeluaran } from '@/types/dataTypes';
import { useSession } from '@/context/SessionContext';

// Pondok Queries
export const useGetPondok = () => {
  const { user } = useSession();
  return useQuery({
    queryKey: ['pondok', { id: user?.pondokId }],
    queryFn: () => fetchPondokData(user!.pondokId),
    enabled: !!user?.pondokId,
  });
};

export const useGetPondokWithPengurus = () => {
  const { user } = useSession();
  return useQuery({
    queryKey: ['pondokWithPengurus', { id: user?.pondokId }],
    queryFn: () => fetchPondokWithPengurus(user!.pondokId),
    enabled: !!user?.pondokId,
  });
};

// User Queries
export const useGetUserProfile = (userId: string) => {
  return useQuery({
    queryKey: ['userProfile', { id: userId }],
    queryFn: () => fetchUserProfile(userId),
    enabled: !!userId,
  });
};

export const useGetAllUserProfiles = () => {
  return useQuery({
    queryKey: ['allUserProfiles'],
    queryFn: fetchAllUserProfie,
  });
};

// RAB Queries
export const useGetRABs = (limit = 10) => {
  const { user } = useSession();
  return useQuery({
    queryKey: ['rabs', { pondokId: user?.pondokId, limit }],
    queryFn: () => fetchRABs(user!.pondokId, limit),
    enabled: !!user?.pondokId,
  });
};

export const useGetRABDetail = (rabId: string) => {
  return useQuery({
    queryKey: ['rab', { id: rabId }],
    queryFn: () => fetchRABDetail(rabId),
    enabled: !!rabId,
  });
};

// LPJ Queries
export const useGetLPJs = (limit = 10) => {
  const { user } = useSession();
  return useQuery({
    queryKey: ['lpjs', { pondokId: user?.pondokId, limit }],
    queryFn: () => fetchLPJs(user!.pondokId, limit),
    enabled: !!user?.pondokId,
  });
};

export const useGetLPJDetail = (lpjId: string) => {
  return useQuery({
    queryKey: ['lpj', { id: lpjId }],
    queryFn: () => fetchLPJDetail(lpjId),
    enabled: !!lpjId,
  });
};

// Pondok Mutations
export const usePondokMutations = () => {
  const queryClient = useQueryClient();
  const { user } = useSession();
  const pondokId = user?.pondokId;

  const updatePondok = useMutation({
    mutationFn: (data: Partial<Pondok>) => updatePondokData(data),
    onSuccess: () => {
      if (pondokId) queryClient.invalidateQueries({ queryKey: ['pondok', { id: pondokId }] });
    },
    onError: (error) => console.error('Failed to update pondok:', error),
  });

  const updatePengurus = useMutation({
    mutationFn: (data: PengurusPondok) => updatePengurusData(data),
    onSuccess: () => {
      if (pondokId) queryClient.invalidateQueries({ queryKey: ['pondokWithPengurus', { id: pondokId }] });
    },
    onError: (error) => console.error('Failed to update pengurus:', error),
  });

  const deletePengurusMutation = useMutation({
    mutationFn: (pengurusId: string) => deletePengurus(pengurusId),
    onSuccess: () => {
      if (pondokId) queryClient.invalidateQueries({ queryKey: ['pondokWithPengurus', { id: pondokId }] });
    },
    onError: (error) => console.error('Failed to delete pengurus:', error),
  });

  return { updatePondok, updatePengurus, deletePengurusMutation };
};

// RAB Mutations
export const useRABMutations = () => {
  const queryClient = useQueryClient();
  const { user } = useSession();
  const pondokId = user?.pondokId;

  const createRAB = useMutation({
    mutationFn: (data: { periodeId: string; pemasukan: RABPemasukan[]; pengeluaran: RABPengeluaran[] }) => 
      createRAB(pondokId!, data.periodeId, data.pemasukan, data.pengeluaran),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rabs', { pondokId }] }),
    onError: (error) => console.error('Failed to create RAB:', error),
  });

  const updateRAB = useMutation({
    mutationFn: (data: { rabId: string; rabData: Partial<RAB>; pemasukan?: RABPemasukan[]; pengeluaran?: RABPengeluaran[] }) => 
      updateRAB(data.rabId, data.rabData, data.pemasukan, data.pengeluaran),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rab', { id: variables.rabId }] });
      queryClient.invalidateQueries({ queryKey: ['rabs', { pondokId }] });
    },
    onError: (error) => console.error('Failed to update RAB:', error),
  });

  return { createRAB, updateRAB };
};

// LPJ Mutations
export const useLPJMutations = () => {
  const queryClient = useQueryClient();
  const { user } = useSession();
  const pondokId = user?.pondokId;

  const createLPJ = useMutation({
    mutationFn: (data: { periodeId: string; pemasukan: LPJPemasukan[]; pengeluaran: LPJPengeluaran[] }) => 
      createLPJ(pondokId!, data.periodeId, data.pemasukan, data.pengeluaran),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lpjs', { pondokId }] }),
    onError: (error) => console.error('Failed to create LPJ:', error),
  });

  const updateLPJ = useMutation({
    mutationFn: (data: { lpjId: string; lpjData: Partial<LPJ>; pemasukan?: LPJPemasukan[]; pengeluaran?: LPJPengeluaran[] }) => 
      updateLPJ(data.lpjId, data.lpjData, data.pemasukan, data.pengeluaran),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lpj', { id: variables.lpjId }] });
      queryClient.invalidateQueries({ queryKey: ['lpjs', { pondokId }] });
    },
    onError: (error) => console.error('Failed to update LPJ:', error),
  });

  return { createLPJ, updateLPJ };
};



