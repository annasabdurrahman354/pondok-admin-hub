import { supabase } from '@/lib/client';
import { 
  Pondok, PengurusPondok, RAB, LPJ, 
  RABPemasukan, RABPengeluaran, 
  LPJPemasukan, LPJPengeluaran,
  Periode,
  UserProfile,
  User
} from '@/types/dataTypes';
import { toast } from 'sonner';

// Pondok API functions
export const fetchUserProfile = async (userId: string): Promise<UserProfile> => {
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

export const fetchAllUserProfie = async (): Promise<UserProfile[]> => {
  try {
    const { data, error } = await supabase
      .from('user_profile')
      .select('*');
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error fetching user data:', error);
    toast.error('Gagal mengambil data user');
    return null;
  }
}

// Periode API functions
export const fetchPeriodes = async (): Promise<Periode[]> => {
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

export const fetchLPJPeriode = async (): Promise<Periode | null> => {
  try {
    const { data, error } = await supabase
      .from('periode')
      .select('*')
      .eq('tahap', 'LPJ')
      .order('id', { ascending: false })
      .limit(1)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error fetching LPJ periode:', error);
    return null;
  }
};

export const fetchRABPeriode = async (): Promise<Periode | null> => {
  try {
    const { data, error } = await supabase
      .from('periode')
      .select('*')
      .eq('tahap', 'RAB')
      .order('id', { ascending: false })
      .limit(1)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error fetching RAB periode:', error);
    return null;
  }
};

export const createOrUpdateAuthUserPondokData = async (user: User, pondokData: Partial<Pondok>, pengurusData) => {
  try {
    let pondokId = user?.pondok_id;
    let newPondok: Pondok;

    if (pondokId) {
      // Update existing pondok
      const { error: updateError } = await supabase
        .from('pondok')
        .update({
          nama: pondokData.nama,
          telepon: pondokData.telepon,
          alamat: pondokData.alamat,
          provinsi: pondokData.provinsi,
          kota: pondokData.kota,
          kecamatan: pondokData.kecamatan,
          kelurahan: pondokData.kelurahan,
          kode_pos: pondokData.kode_pos,
          daerah_sambung: pondokData.daerah_sambung,
          status_acc: false,
        })
        .eq('id', pondokId);

      if (updateError) throw updateError;

      // Delete old pengurus
      await supabase.from('pengurus_pondok').delete().eq('pondok_id', pondokId);
    } else {
      // Insert new pondok
      const { data, error } = await supabase
        .from('pondok')
        .insert({
          nama: pondokData.nama,
          telepon: pondokData.telepon,
          alamat: pondokData.alamat,
          provinsi: pondokData.provinsi,
          kota: pondokData.kota,
          kecamatan: pondokData.kecamatan,
          kelurahan: pondokData.kelurahan,
          kode_pos: pondokData.kode_pos,
          daerah_sambung: pondokData.daerah_sambung,
          status_acc: false,
        })
        .select()
        .single();

      if (error) throw error;
      newPondok = data;
      pondokId = newPondok.id;

      // Update user profile
      await supabase.from('user_profile').update({ pondok_id: pondokId }).eq('id', user.id);
    }

    // Insert new pengurus data
    const pengurusToInsert = [
      { pondok_id: pondokId, nama: pengurusData.ketua, jabatan: 'Ketua' },
      { pondok_id: pondokId, nama: pengurusData.bendahara, jabatan: 'Bendahara' },
      { pondok_id: pondokId, nama: pengurusData.sekretaris, jabatan: 'Sekretaris' },
      { pondok_id: pondokId, nama: pengurusData.pinisepuh, jabatan: 'Pinisepuh' },
    ];

    await supabase.from('pengurus_pondok').insert(pengurusToInsert);

    return { success: true, pondokId };
  } catch (error) {
    console.error('Error in createOrUpdateAuthUserPondokData:', error);
    return { success: false, error };
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
    const { data: rabs, error: rabsError } = await supabase
      .from('rab')
      .select('*')
      .eq('pondok_id', pondokId)
      .order('submit_at', { ascending: false })
      .limit(limit);
    
    if (rabsError) throw rabsError;
    
    // Fetch the related pemasukan and pengeluaran for each RAB
    const rabsWithDetails = await Promise.all(
      rabs.map(async (rab) => {
        const { data: pemasukan, error: pemasukanError } = await supabase
          .from('rab_pemasukan')
          .select('*')
          .eq('rab_id', rab.id);
        
        if (pemasukanError) throw pemasukanError;
        
        const { data: pengeluaran, error: pengeluaranError } = await supabase
          .from('rab_pengeluaran')
          .select('*')
          .eq('rab_id', rab.id);
        
        if (pengeluaranError) throw pengeluaranError;
        
        return {
          ...rab,
          rabPemasukan: pemasukan || [],
          rabPengeluaran: pengeluaran || []
        };
      })
    );
    
    return rabsWithDetails || [];
  } catch (error: any) {
    console.error('Error fetching RABs:', error);
    toast.error('Gagal mengambil data RAB');
    return [];
  }
};

export const fetchRABDetail = async (rabId: string): Promise<RAB | null> => {
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
      ...rab,
      rabPemasukan: pemasukan || [],
      rabPengeluaran: pengeluaran || []
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
    const { data: lpjs, error: lpjsError } = await supabase
      .from('lpj')
      .select('*')
      .eq('pondok_id', pondokId)
      .order('submit_at', { ascending: false })
      .limit(limit);
    
    if (lpjsError) throw lpjsError;
    
    // Fetch the related pemasukan and pengeluaran for each LPJ
    const lpjsWithDetails = await Promise.all(
      lpjs.map(async (lpj) => {
        const { data: pemasukan, error: pemasukanError } = await supabase
          .from('lpj_pemasukan')
          .select('*')
          .eq('lpj_id', lpj.id);
        
        if (pemasukanError) throw pemasukanError;
        
        const { data: pengeluaran, error: pengeluaranError } = await supabase
          .from('lpj_pengeluaran')
          .select('*')
          .eq('lpj_id', lpj.id);
        
        if (pengeluaranError) throw pengeluaranError;
        
        return {
          ...lpj,
          lpjPemasukan: pemasukan || [],
          lpjPengeluaran: pengeluaran || []
        };
      })
    );
    
    return lpjsWithDetails || [];
  } catch (error: any) {
    console.error('Error fetching LPJs:', error);
    toast.error('Gagal mengambil data LPJ');
    return [];
  }
};

export const fetchLPJDetail = async (lpjId: string): Promise<LPJ | null> => {
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
      ...lpj,
      lpjPemasukan: pemasukan || [],
      lpjPengeluaran: pengeluaran || []
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

// Yayasan API functions
export const fetchAllPondoks = async (): Promise<Pondok[]> => {
  try {
    const { data, error } = await supabase
      .from('pondok')
      .select('*')
      .order('nama');
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching all pondoks:', error);
    toast.error('Gagal mengambil data pondok');
    return [];
  }
};

export const fetchPendingPondoks = async (): Promise<Pondok[]> => {
  try {
    const { data, error } = await supabase
      .from('pondok')
      .select('*')
      .eq('status_acc', false)
      .order('nama');
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching pending pondoks:', error);
    toast.error('Gagal mengambil data pondok yang belum disetujui');
    return [];
  }
};

export const approvePondok = async (pondokId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('pondok')
      .update({ status_acc: true })
      .eq('id', pondokId);
    
    if (error) throw error;
    toast.success('Pondok berhasil disetujui');
    return true;
  } catch (error: any) {
    console.error('Error approving pondok:', error);
    toast.error('Gagal menyetujui pondok');
    return false;
  }
};

// Yayasan RAB Management
export const fetchAllRABs = async (status?: string, periodeId?: string, limit = 100): Promise<RAB[]> => {
  try {
    let query = supabase
      .from('rab')
      .select(`
        *,
        pondok:pondok_id (nama)
      `)
      .order('submit_at', { ascending: false });
    
    if (status) {
      query = query.eq('status', status);
    }
    
    if (periodeId) {
      query = query.eq('periode_id', periodeId);
    }
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching all RABs:', error);
    toast.error('Gagal mengambil data RAB');
    return [];
  }
};

export const approveRAB = async (rabId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('rab')
      .update({
        status: 'diterima',
        accepted_at: new Date().toISOString(),
        pesan_revisi: null
      })
      .eq('id', rabId);
    
    if (error) throw error;
    toast.success('RAB berhasil disetujui');
    return true;
  } catch (error: any) {
    console.error('Error approving RAB:', error);
    toast.error('Gagal menyetujui RAB');
    return false;
  }
};

export const requestRABRevision = async (rabId: string, message: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('rab')
      .update({
        status: 'revisi',
        pesan_revisi: message
      })
      .eq('id', rabId);
    
    if (error) throw error;
    toast.success('Permintaan revisi RAB berhasil dikirim');
    return true;
  } catch (error: any) {
    console.error('Error requesting RAB revision:', error);
    toast.error('Gagal mengirim permintaan revisi RAB');
    return false;
  }
};

// Yayasan LPJ Management
export const fetchAllLPJs = async (status?: string, periodeId?: string, limit = 100): Promise<LPJ[]> => {
  try {
    let query = supabase
      .from('lpj')
      .select(`
        *,
        pondok:pondok_id (nama)
      `)
      .order('submit_at', { ascending: false });
    
    if (status) {
      query = query.eq('status', status);
    }
    
    if (periodeId) {
      query = query.eq('periode_id', periodeId);
    }
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching all LPJs:', error);
    toast.error('Gagal mengambil data LPJ');
    return [];
  }
};

export const approveLPJ = async (lpjId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('lpj')
      .update({
        status: 'diterima',
        accepted_at: new Date().toISOString(),
        pesan_revisi: null
      })
      .eq('id', lpjId);
    
    if (error) throw error;
    toast.success('LPJ berhasil disetujui');
    return true;
  } catch (error: any) {
    console.error('Error approving LPJ:', error);
    toast.error('Gagal menyetujui LPJ');
    return false;
  }
};

export const requestLPJRevision = async (lpjId: string, message: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('lpj')
      .update({
        status: 'revisi',
        pesan_revisi: message
      })
      .eq('id', lpjId);
    
    if (error) throw error;
    toast.success('Permintaan revisi LPJ berhasil dikirim');
    return true;
  } catch (error: any) {
    console.error('Error requesting LPJ revision:', error);
    toast.error('Gagal mengirim permintaan revisi LPJ');
    return false;
  }
};
