export type Pondok = {
  id: string;
  nama: string;
  telepon: string;
  alamat: string;
  provinsi: string;
  kota: string;
  kecamatan: string;
  kelurahan: string;
  kode_pos: string;
  daerah_sambung: string;
  status_acc: boolean;
};

export type PengurusPondok = {
  id: string;
  pondok_id: string;
  nama: string;
  jabatan: "Ketua" | "Pinisepuh" | "Bendahara" | "Sekretaris" | string;
};

export type RAB = {
  id: string;
  pondok_id: string;
  periode_id: string; // Format YYYYMM
  status: "Diajukan" | "Revisi" | "Diterima";
  submit_at: string | null; // ISO Date
  accepted_at: string | null; // ISO Date
  pesan_revisi: string | null;
  rabPemasukan: RABPemasukan[];
  rabPengeluaran: RABPengeluaran[];
};

export type LPJ = {
  id: string;
  pondok_id: string;
  periode_id: string; // Format YYYYMM
  status: "Diajukan" | "Revisi" | "Diterima";
  submit_at: string | null; // ISO Date
  accepted_at: string | null; // ISO Date
  pesan_revisi: string | null;
  lpjPemasukan: LPJPemasukan[];
  lpjPengeluaran: LPJPengeluaran[];
};

export type RABPemasukan = {
  id: string;
  rab_id: string;
  nama: "Sisa Saldo" | "Shodaqoh" | "Uang Sewa Santri" | string;
  nominal: number;
};

export type RABPengeluaran = {
  id: string;
  rab_id: string;
  kategori: "Ukhro" | "Sarana Prasarana" | "Konsumsi" | "Administrasi" | string;
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

export type PeriodeType = {
  id: string;  // Format YYYYMM
};
