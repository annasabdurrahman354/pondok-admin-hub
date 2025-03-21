
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
import { Pondok, PengurusPondok, RAB, LPJ, RABPemasukan, RABPengeluaran, LPJPemasukan, LPJPengeluaran, RABDetailResponse, LPJDetailResponse } from '@/types/dataTypes';
import { useSession } from '@/context/SessionContext';

// Pondok Queries
export const useGetPondok = () => {
  const { user } = useSession();
  return useQuery({
    queryKey: ['pondok', { id: user?.pondok_id }],
    queryFn: () => fetchPondokData(user!.pondok_id),
    enabled: !!user?.pondok_id,
  });
};

export const useGetPondokWithPengurus = () => {
  const { user } = useSession();
  return useQuery({
    queryKey: ['pondokWithPengurus', { id: user?.pondok_id }],
    queryFn: () => fetchPondokWithPengurus(user!.pondok_id),
    enabled: !!user?.pondok_id,
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
    queryKey: ['rabs', { pondokId: user?.pondok_id, limit }],
    queryFn: () => fetchRABs(user!.pondok_id, limit),
    enabled: !!user?.pondok_id,
  });
};

export const useGetRABDetail = (rabId: string) => {
  return useQuery<RABDetailResponse>({
    queryKey: ['rab', { id: rabId }],
    queryFn: () => fetchRABDetail(rabId),
    enabled: !!rabId,
  });
};

// LPJ Queries
export const useGetLPJs = (limit = 10) => {
  const { user } = useSession();
  return useQuery({
    queryKey: ['lpjs', { pondokId: user?.pondok_id, limit }],
    queryFn: () => fetchLPJs(user!.pondok_id, limit),
    enabled: !!user?.pondok_id,
  });
};

export const useGetLPJDetail = (lpjId: string) => {
  return useQuery<LPJDetailResponse>({
    queryKey: ['lpj', { id: lpjId }],
    queryFn: () => fetchLPJDetail(lpjId),
    enabled: !!lpjId,
  });
};

// Pondok Mutations
export const usePondokMutations = () => {
  const queryClient = useQueryClient();
  const { user } = useSession();
  const pondokId = user?.pondok_id;

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
  const pondokId = user?.pondok_id;

  const createRABMutation = useMutation({
    mutationFn: (data: { periodeId: string; pemasukan: Omit<RABPemasukan, 'id' | 'rab_id'>[]; pengeluaran: Omit<RABPengeluaran, 'id' | 'rab_id'>[] }) => 
      createRAB(pondokId!, data.periodeId, data.pemasukan, data.pengeluaran),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rabs', { pondokId }] });
    },
    onError: (error) => console.error('Failed to create RAB:', error),
  });

  const updateRABMutation = useMutation({
    mutationFn: (data: { rabId: string; rabData: Partial<RAB>; pemasukan?: Omit<RABPemasukan, 'id' | 'rab_id'>[]; pengeluaran?: Omit<RABPengeluaran, 'id' | 'rab_id'>[] }) => 
      updateRAB(data.rabId, data.rabData, data.pemasukan as any, data.pengeluaran as any),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rab', { id: variables.rabId }] });
      queryClient.invalidateQueries({ queryKey: ['rabs', { pondokId }] });
    },
    onError: (error) => console.error('Failed to update RAB:', error),
  });

  const submitRABMutation = useMutation({
    mutationFn: (rabId: string) => submitRAB(rabId),
    onSuccess: (_, rabId) => {
      queryClient.invalidateQueries({ queryKey: ['rab', { id: rabId }] });
      queryClient.invalidateQueries({ queryKey: ['rabs', { pondokId }] });
    },
    onError: (error) => console.error('Failed to submit RAB:', error),
  });

  const deleteRABMutation = useMutation({
    mutationFn: (rabId: string) => deleteRAB(rabId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rabs', { pondokId }] });
    },
    onError: (error) => console.error('Failed to delete RAB:', error),
  });

  return { createRABMutation, updateRABMutation, submitRABMutation, deleteRABMutation };
};

// LPJ Mutations
export const useLPJMutations = () => {
  const queryClient = useQueryClient();
  const { user } = useSession();
  const pondokId = user?.pondok_id;

  const createLPJMutation = useMutation({
    mutationFn: (data: { periodeId: string; pemasukan: Omit<LPJPemasukan, 'id' | 'lpj_id'>[]; pengeluaran: Omit<LPJPengeluaran, 'id' | 'lpj_id'>[] }) => 
      createLPJ(pondokId!, data.periodeId, data.pemasukan, data.pengeluaran),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpjs', { pondokId }] });
    },
    onError: (error) => console.error('Failed to create LPJ:', error),
  });

  const updateLPJMutation = useMutation({
    mutationFn: (data: { lpjId: string; lpjData: Partial<LPJ>; pemasukan?: Omit<LPJPemasukan, 'id' | 'lpj_id'>[]; pengeluaran?: Omit<LPJPengeluaran, 'id' | 'lpj_id'>[] }) => 
      updateLPJ(data.lpjId, data.lpjData, data.pemasukan as any, data.pengeluaran as any),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lpj', { id: variables.lpjId }] });
      queryClient.invalidateQueries({ queryKey: ['lpjs', { pondokId }] });
    },
    onError: (error) => console.error('Failed to update LPJ:', error),
  });

  const submitLPJMutation = useMutation({
    mutationFn: (lpjId: string) => submitLPJ(lpjId),
    onSuccess: (_, lpjId) => {
      queryClient.invalidateQueries({ queryKey: ['lpj', { id: lpjId }] });
      queryClient.invalidateQueries({ queryKey: ['lpjs', { pondokId }] });
    },
    onError: (error) => console.error('Failed to submit LPJ:', error),
  });

  const deleteLPJMutation = useMutation({
    mutationFn: (lpjId: string) => deleteLPJ(lpjId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpjs', { pondokId }] });
    },
    onError: (error) => console.error('Failed to delete LPJ:', error),
  });

  return { createLPJMutation, updateLPJMutation, submitLPJMutation, deleteLPJMutation };
};
