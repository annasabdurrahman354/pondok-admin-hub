import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchAllPondoks,
  fetchPendingPondoks,
  approvePondok,
  fetchAllRABs,
  approveRAB,
  requestRABRevision,
  fetchAllLPJs,
  approveLPJ,
  requestLPJRevision,
  fetchRABDetail,
  fetchLPJDetail
} from '@/services/apiService';
import { RAB, LPJ, Pondok, RABDetailResponse, LPJDetailResponse } from '@/types/dataTypes';

// Pondok Queries
export const useGetAllPondoks = () => {
  return useQuery({
    queryKey: ['allPondoks'],
    queryFn: fetchAllPondoks,
  });
};

export const useGetPendingPondoks = () => {
  return useQuery({
    queryKey: ['pendingPondoks'],
    queryFn: fetchPendingPondoks,
  });
};

// RAB Queries
export const useGetRABDetail = (rabId: string) => {
  return useQuery<RABDetailResponse>({
    queryKey: ['rab', { id: rabId }],
    queryFn: () => fetchRABDetail(rabId),
    enabled: !!rabId,
  });
};

// LPJ Queries
export const useGetAllLPJs = (status?: string, periodeId?: string, limit = 100) => {
  return useQuery({
    queryKey: ['allLPJs', { status, periodeId, limit }],
    queryFn: () => fetchAllLPJs(status, periodeId, limit),
  });
};

export const useGetLPJDetail = (lpjId: string) => {
  return useQuery<LPJDetailResponse>({
    queryKey: ['lpj', { id: lpjId }],
    queryFn: () => fetchLPJDetail(lpjId),
    enabled: !!lpjId,
  });
};

// Yayasan Mutations
export const useYayasanMutations = () => {
  const queryClient = useQueryClient();

  const approvePondokMutation = useMutation({
    mutationFn: (pondokId: string) => approvePondok(pondokId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allPondoks'] });
      queryClient.invalidateQueries({ queryKey: ['pendingPondoks'] });
    },
    onError: (error) => console.error('Failed to approve pondok:', error),
  });

  const approveRABMutation = useMutation({
    mutationFn: (rabId: string) => approveRAB(rabId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allRABs'] });
      queryClient.invalidateQueries({ queryKey: ['rab'] });
    },
    onError: (error) => console.error('Failed to approve RAB:', error),
  });

  const requestRABRevisionMutation = useMutation({
    mutationFn: ({ rabId, message }: { rabId: string; message: string }) => 
      requestRABRevision(rabId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allRABs'] });
      queryClient.invalidateQueries({ queryKey: ['rab'] });
    },
    onError: (error) => console.error('Failed to request RAB revision:', error),
  });

  const approveLPJMutation = useMutation({
    mutationFn: (lpjId: string) => approveLPJ(lpjId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allLPJs'] });
      queryClient.invalidateQueries({ queryKey: ['lpj'] });
    },
    onError: (error) => console.error('Failed to approve LPJ:', error),
  });

  const requestLPJRevisionMutation = useMutation({
    mutationFn: ({ lpjId, message }: { lpjId: string; message: string }) => 
      requestLPJRevision(lpjId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allLPJs'] });
      queryClient.invalidateQueries({ queryKey: ['lpj'] });
    },
    onError: (error) => console.error('Failed to request LPJ revision:', error),
  });

  return { 
    approvePondokMutation, 
    approveRABMutation,
    requestRABRevisionMutation,
    approveLPJMutation,
    requestLPJRevisionMutation
  };
};
