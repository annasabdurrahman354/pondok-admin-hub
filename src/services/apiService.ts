import { supabase } from '@/lib/client';
import { 
  Pondok, PengurusPondok, RAB, LPJ, 
  RABPemasukan, RABPengeluaran, 
  LPJPemasukan, LPJPengeluaran,
  PeriodeType
} from '@/types/dataTypes';
import { toast } from 'sonner';

// Pondok API functions
export const fetchUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_profile')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error fetching user data:', error);
    toast.error('Gagal mengambil data user');
    return null;
  }
};

// Periode API functions
export const fetchPeriodes = async (): Promise<PeriodeType[]> => {
  try {
    const { data, error } = await supabase
      .from('periode')
      .select('*')
      .order('id', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching periodes:', error);
    toast.error('Gagal mengambil data periode');
    return [];
  }
};

export const fetchCurrentPeriode = async (): Promise<PeriodeType | null> => {
  try {
    const { data, error } = await supabase
      .from('periode')
      .select('*')
      .order('id', { ascending: false })
      .limit(1)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error fetching current periode:', error);
    return null;
  }
};

// Pondok API functions
export const fetchPondokData = async (pondokId: string): Promise<Pondok | null> => {
  try {
    const { data, error } = await supabase
      .from('pondok')
      .select('*')
      .eq('id', pondokId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error fetching pondok data:', error);
    toast.error('Gagal mengambil data pondok');
    return null;
  }
};

export const fetchPondokWithPengurus = async (pondokId: string): Promise<{ pondok: Pondok, pengurus: PengurusPondok[] } | null> => {
  try {
    // Fetch pondok data
    const { data: pondok, error: pondokError } = await supabase
      .from('pondok')
      .select('*')
      .eq('id', pondokId)
      .single();
    
    if (pondokError) throw pondokError;
    
    // Fetch pengurus pondok data
    const { data: pengurus, error: pengurusError } = await supabase
      .from('pengurus_pondok')
      .select('*')
      .eq('pondok_id', pondokId);
    
    if (pengurusError) throw pengurusError;
    
    return {
      pondok,
      pengurus: pengurus || []
    };
  } catch (error: any) {
    console.error('Error fetching pondok with pengurus:', error);
    toast.error('Gagal mengambil data pondok dan pengurus');
    return null;
  }
};

export const updatePondokData = async (pondokData: Partial<Pondok>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('pondok')
      .update(pondokData)
      .eq('id', pondokData.id);
    
    if (error) throw error;
    toast.success('Data pondok berhasil diperbarui');
    return true;
  } catch (error: any) {
    console.error('Error updating pondok data:', error);
    toast.error('Gagal memperbarui data pondok');
    return false;
  }
};

// Pengurus API functions
export const updatePengurusData = async (pengurusData: PengurusPondok): Promise<boolean> => {
  try {
    // Check if pengurus exists
    const { data: existing, error: checkError } = await supabase
      .from('pengurus_pondok')
      .select('id')
      .eq('id', pengurusData.id)
      .maybeSingle();
    
    if (checkError) throw checkError;
    
    if (existing) {
      // Update existing pengurus
      const { error } = await supabase
        .from('pengurus_pondok')
        .update(pengurusData)
        .eq('id', pengurusData.id);
      
      if (error) throw error;
    } else {
      // Insert new pengurus
      const { error } = await supabase
        .from('pengurus_pondok')
        .insert(pengurusData);
      
      if (error) throw error;
    }
    
    toast.success('Data pengurus berhasil disimpan');
    return true;
  } catch (error: any) {
    console.error('Error updating pengurus data:', error);
    toast.error('Gagal menyimpan data pengurus');
    return false;
  }
};

export const deletePengurus = async (pengurusId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('pengurus_pondok')
      .delete()
      .eq('id', pengurusId);
    
    if (error) throw error;
    toast.success('Pengurus berhasil dihapus');
    return true;
  } catch (error: any) {
    console.error('Error deleting pengurus:', error);
    toast.error('Gagal menghapus pengurus');
    return false;
  }
};

// RAB API functions
export const fetchRABs = async (pondokId: string, limit = 10): Promise<RAB[]> => {
  try {
    const { data, error } = await supabase
      .from('rab')
      .select('*')
      .eq('pondok_id', pondokId)
      .order('submit_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching RABs:', error);
    toast.error('Gagal mengambil data RAB');
    return [];
  }
};

export const fetchRABDetail = async (rabId: string): Promise<{
  rab: RAB,
  pemasukan: RABPemasukan[],
  pengeluaran: RABPengeluaran[]
} | null> => {
  try {
    // Fetch RAB data
    const { data: rab, error: rabError } = await supabase
      .from('rab')
      .select('*')
      .eq('id', rabId)
      .single();
    
    if (rabError) throw rabError;
    
    // Fetch RAB pemasukan
    const { data: pemasukan, error: pemasukanError } = await supabase
      .from('rab_pemasukan')
      .select('*')
      .eq('rab_id', rabId);
    
    if (pemasukanError) throw pemasukanError;
    
    // Fetch RAB pengeluaran
    const { data: pengeluaran, error: pengeluaranError } = await supabase
      .from('rab_pengeluaran')
      .select('*')
      .eq('rab_id', rabId);
    
    if (pengeluaranError) throw pengeluaranError;
    
    return {
      rab,
      pemasukan: pemasukan || [],
      pengeluaran: pengeluaran || []
    };
  } catch (error: any) {
    console.error('Error fetching RAB detail:', error);
    toast.error('Gagal mengambil detail RAB');
    return null;
  }
};

export const createRAB = async (
  pondokId: string,
  periodeId: string,
  pemasukan: Omit<RABPemasukan, 'id' | 'rab_id'>[],
  pengeluaran: Omit<RABPengeluaran, 'id' | 'rab_id'>[]
): Promise<string | null> => {
  try {
    // Start a Supabase transaction
    const { data: rabData, error: rabError } = await supabase
      .from('rab')
      .insert({
        pondok_id: pondokId,
        periode_id: periodeId,
        status: 'draft',
        submit_at: null,
        accepted_at: null,
        pesan_revisi: null
      })
      .select()
      .single();
    
    if (rabError) throw rabError;
    
    const rabId = rabData.id;
    
    // Insert pemasukan items
    if (pemasukan.length > 0) {
      const pemasukanWithRabId = pemasukan.map(item => ({
        rab_id: rabId,
        nama: item.nama,
        nominal: item.nominal
      }));
      
      const { error: pemasukanError } = await supabase
        .from('rab_pemasukan')
        .insert(pemasukanWithRabId);
      
      if (pemasukanError) throw pemasukanError;
    }
    
    // Insert pengeluaran items
    if (pengeluaran.length > 0) {
      const pengeluaranWithRabId = pengeluaran.map(item => ({
        rab_id: rabId,
        kategori: item.kategori,
        nama: item.nama,
        detail: item.detail,
        nominal: item.nominal
      }));
      
      const { error: pengeluaranError } = await supabase
        .from('rab_pengeluaran')
        .insert(pengeluaranWithRabId);
      
      if (pengeluaranError) throw pengeluaranError;
    }
    
    toast.success('RAB berhasil dibuat');
    return rabId;
  } catch (error: any) {
    console.error('Error creating RAB:', error);
    toast.error('Gagal membuat RAB');
    return null;
  }
};

export const updateRAB = async (
  rabId: string,
  rabData: Partial<RAB>,
  pemasukan?: RABPemasukan[],
  pengeluaran?: RABPengeluaran[]
): Promise<boolean> => {
  try {
    // Update RAB data
    const { error: rabError } = await supabase
      .from('rab')
      .update(rabData)
      .eq('id', rabId);
    
    if (rabError) throw rabError;
    
    // Update pemasukan items if provided
    if (pemasukan) {
      // First delete existing items
      const { error: deleteError } = await supabase
        .from('rab_pemasukan')
        .delete()
        .eq('rab_id', rabId);
      
      if (deleteError) throw deleteError;
      
      // Then insert new items
      if (pemasukan.length > 0) {
        const { error: insertError } = await supabase
          .from('rab_pemasukan')
          .insert(pemasukan.map(item => ({
            ...item,
            rab_id: rabId
          })));
        
        if (insertError) throw insertError;
      }
    }
    
    // Update pengeluaran items if provided
    if (pengeluaran) {
      // First delete existing items
      const { error: deleteError } = await supabase
        .from('rab_pengeluaran')
        .delete()
        .eq('rab_id', rabId);
      
      if (deleteError) throw deleteError;
      
      // Then insert new items
      if (pengeluaran.length > 0) {
        const { error: insertError } = await supabase
          .from('rab_pengeluaran')
          .insert(pengeluaran.map(item => ({
            ...item,
            rab_id: rabId
          })));
        
        if (insertError) throw insertError;
      }
    }
    
    toast.success('RAB berhasil diperbarui');
    return true;
  } catch (error: any) {
    console.error('Error updating RAB:', error);
    toast.error('Gagal memperbarui RAB');
    return false;
  }
};

export const submitRAB = async (rabId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('rab')
      .update({
        status: 'diajukan',
        submit_at: new Date().toISOString()
      })
      .eq('id', rabId);
    
    if (error) throw error;
    toast.success('RAB berhasil diajukan');
    return true;
  } catch (error: any) {
    console.error('Error submitting RAB:', error);
    toast.error('Gagal mengajukan RAB');
    return false;
  }
};

export const deleteRAB = async (rabId: string): Promise<boolean> => {
  try {
    // Delete pemasukan items first
    const { error: pemasukanError } = await supabase
      .from('rab_pemasukan')
      .delete()
      .eq('rab_id', rabId);
    
    if (pemasukanError) throw pemasukanError;
    
    // Delete pengeluaran items
    const { error: pengeluaranError } = await supabase
      .from('rab_pengeluaran')
      .delete()
      .eq('rab_id', rabId);
    
    if (pengeluaranError) throw pengeluaranError;
    
    // Finally delete the RAB
    const { error: rabError } = await supabase
      .from('rab')
      .delete()
      .eq('id', rabId);
    
    if (rabError) throw rabError;
    
    toast.success('RAB berhasil dihapus');
    return true;
  } catch (error: any) {
    console.error('Error deleting RAB:', error);
    toast.error('Gagal menghapus RAB');
    return false;
  }
};

// LPJ API functions
export const fetchLPJs = async (pondokId: string, limit = 10): Promise<LPJ[]> => {
  try {
    const { data, error } = await supabase
      .from('lpj')
      .select('*')
      .eq('pondok_id', pondokId)
      .order('submit_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching LPJs:', error);
    toast.error('Gagal mengambil data LPJ');
    return [];
  }
};

export const fetchLPJDetail = async (lpjId: string): Promise<{
  lpj: LPJ,
  pemasukan: LPJPemasukan[],
  pengeluaran: LPJPengeluaran[]
} | null> => {
  try {
    // Fetch LPJ data
    const { data: lpj, error: lpjError } = await supabase
      .from('lpj')
      .select('*')
      .eq('id', lpjId)
      .single();
    
    if (lpjError) throw lpjError;
    
    // Fetch LPJ pemasukan
    const { data: pemasukan, error: pemasukanError } = await supabase
      .from('lpj_pemasukan')
      .select('*')
      .eq('lpj_id', lpjId);
    
    if (pemasukanError) throw pemasukanError;
    
    // Fetch LPJ pengeluaran
    const { data: pengeluaran, error: pengeluaranError } = await supabase
      .from('lpj_pengeluaran')
      .select('*')
      .eq('lpj_id', lpjId);
    
    if (pengeluaranError) throw pengeluaranError;
    
    return {
      lpj,
      pemasukan: pemasukan || [],
      pengeluaran: pengeluaran || []
    };
  } catch (error: any) {
    console.error('Error fetching LPJ detail:', error);
    toast.error('Gagal mengambil detail LPJ');
    return null;
  }
};

export const createLPJ = async (
  pondokId: string,
  periodeId: string,
  pemasukan: Omit<LPJPemasukan, 'id' | 'lpj_id'>[],
  pengeluaran: Omit<LPJPengeluaran, 'id' | 'lpj_id'>[]
): Promise<string | null> => {
  try {
    // Start a Supabase transaction
    const { data: lpjData, error: lpjError } = await supabase
      .from('lpj')
      .insert({
        pondok_id: pondokId,
        periode_id: periodeId,
        status: 'draft',
        submit_at: null,
        accepted_at: null,
        pesan_revisi: null
      })
      .select()
      .single();
    
    if (lpjError) throw lpjError;
    
    const lpjId = lpjData.id;
    
    // Insert pemasukan items
    if (pemasukan.length > 0) {
      const pemasukanWithLpjId = pemasukan.map(item => ({
        lpj_id: lpjId,
        nama: item.nama,
        rencana: item.rencana,
        realisasi: item.realisasi
      }));
      
      const { error: pemasukanError } = await supabase
        .from('lpj_pemasukan')
        .insert(pemasukanWithLpjId);
      
      if (pemasukanError) throw pemasukanError;
    }
    
    // Insert pengeluaran items
    if (pengeluaran.length > 0) {
      const pengeluaranWithLpjId = pengeluaran.map(item => ({
        lpj_id: lpjId,
        nama: item.nama,
        rencana: item.rencana,
        realisasi: item.realisasi
      }));
      
      const { error: pengeluaranError } = await supabase
        .from('lpj_pengeluaran')
        .insert(pengeluaranWithLpjId);
      
      if (pengeluaranError) throw pengeluaranError;
    }
    
    toast.success('LPJ berhasil dibuat');
    return lpjId;
  } catch (error: any) {
    console.error('Error creating LPJ:', error);
    toast.error('Gagal membuat LPJ');
    return null;
  }
};

export const updateLPJ = async (
  lpjId: string,
  lpjData: Partial<LPJ>,
  pemasukan?: LPJPemasukan[],
  pengeluaran?: LPJPengeluaran[]
): Promise<boolean> => {
  try {
    // Update LPJ data
    const { error: lpjError } = await supabase
      .from('lpj')
      .update(lpjData)
      .eq('id', lpjId);
    
    if (lpjError) throw lpjError;
    
    // Update pemasukan items if provided
    if (pemasukan) {
      // First delete existing items
      const { error: deleteError } = await supabase
        .from('lpj_pemasukan')
        .delete()
        .eq('lpj_id', lpjId);
      
      if (deleteError) throw deleteError;
      
      // Then insert new items
      if (pemasukan.length > 0) {
        const { error: insertError } = await supabase
          .from('lpj_pemasukan')
          .insert(pemasukan.map(item => ({
            ...item,
            lpj_id: lpjId
          })));
        
        if (insertError) throw insertError;
      }
    }
    
    // Update pengeluaran items if provided
    if (pengeluaran) {
      // First delete existing items
      const { error: deleteError } = await supabase
        .from('lpj_pengeluaran')
        .delete()
        .eq('lpj_id', lpjId);
      
      if (deleteError) throw deleteError;
      
      // Then insert new items
      if (pengeluaran.length > 0) {
        const { error: insertError } = await supabase
          .from('lpj_pengeluaran')
          .insert(pengeluaran.map(item => ({
            ...item,
            lpj_id: lpjId
          })));
        
        if (insertError) throw insertError;
      }
    }
    
    toast.success('LPJ berhasil diperbarui');
    return true;
  } catch (error: any) {
    console.error('Error updating LPJ:', error);
    toast.error('Gagal memperbarui LPJ');
    return false;
  }
};

export const submitLPJ = async (lpjId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('lpj')
      .update({
        status: 'diajukan',
        submit_at: new Date().toISOString()
      })
      .eq('id', lpjId);
    
    if (error) throw error;
    toast.success('LPJ berhasil diajukan');
    return true;
  } catch (error: any) {
    console.error('Error submitting LPJ:', error);
    toast.error('Gagal mengajukan LPJ');
    return false;
  }
};

export const deleteLPJ = async (lpjId: string): Promise<boolean> => {
  try {
    // Delete pemasukan items first
    const { error: pemasukanError } = await supabase
      .from('lpj_pemasukan')
      .delete()
      .eq('lpj_id', lpjId);
    
    if (pemasukanError) throw pemasukanError;
    
    // Delete pengeluaran items
    const { error: pengeluaranError } = await supabase
      .from('lpj_pengeluaran')
      .delete()
      .eq('lpj_id', lpjId);
    
    if (pengeluaranError) throw pengeluaranError;
    
    // Finally delete the LPJ
    const { error: lpjError } = await supabase
      .from('lpj')
      .delete()
      .eq('id', lpjId);
    
    if (lpjError) throw lpjError;
    
    toast.success('LPJ berhasil dihapus');
    return true;
  } catch (error: any) {
    console.error('Error deleting LPJ:', error);
    toast.error('Gagal menghapus LPJ');
    return false;
  }
};
