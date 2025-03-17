
export type Provinsi = {
  id: number;
  nama: string;
};

export type Kota = {
  id: number;
  nama: string;
  provinsi_id: number;
};

export type Kecamatan = {
  id: number;
  nama: string;
  kota_id: number;
};

export type Kelurahan = {
  id: number;
  nama: string;
  kecamatan_id: number;
};

export type DaerahSambung = {
  id: number;
  nama: string;
};

export type Pondok = {
  id: string;
  nama: string;
  telepon: string;
  alamat: string;
  provinsi_id: number;
  kota_id: number;
  kecamatan_id: number;
  kelurahan_id: number;
  kode_pos: string;
  daerah_sambung_id: number;
  status_acc: boolean;
};

export type PengurusPondok = {
  id: string;
  pondok_id: string;
  nama: string;
  jabatan: "ketua" | "pinisepuh" | "bendahara" | "sekretaris";
};

export type RAB = {
  id: string;
  pondok_id: string;
  periode_id: string; // Format YYYYMM
  status: "diajukan" | "revisi" | "diterima";
  submit_at: string | null; // ISO Date
  accepted_at: string | null; // ISO Date
  pesan_revisi: string | null;
};

export type LPJ = {
  id: string;
  pondok_id: string;
  periode_id: string; // Format YYYYMM
  status: "diajukan" | "revisi" | "diterima";
  submit_at: string | null; // ISO Date
  accepted_at: string | null; // ISO Date
  pesan_revisi: string | null;
};

export type RABPemasukan = {
  id: string;
  rab_id: string;
  nama: "sisa saldo" | "shodqoh" | "uang sewa santri" | string;
  nominal: number;
};

export type RABPengeluaran = {
  id: string;
  rab_id: string;
  kategori: "ukhro" | "sarana prasarana" | "konsumsi" | "administrasi";
  nama: string;
  detail?: string;
  nominal: number;
};

export type LPJPemasukan = {
  id: string;
  lpj_id: string;
  nama: string;
  rencana: number;
  realisasi: number;
};

export type LPJPengeluaran = {
  id: string;
  lpj_id: string;
  nama: string;
  rencana: number;
  realisasi: number;
};

export type UserRole = 'admin_yayasan' | 'admin_pondok';
