
// Mock data for the application

// Pondok data
export const pondokList = [
  { 
    id: 'p1', 
    name: 'Pondok Al-Hikmah', 
    location: 'Bandung, Jawa Barat', 
    date: '2023-06-10',
    status: 'active',
    santriCount: 120,
    description: 'Pondok pesantren yang berfokus pada pendidikan Al-Quran dan Hadist',
    address: 'Jl. Pesantren No. 45, Bandung',
    email: 'alhikmah@pondok.id',
    phone: '022-87654321',
    headmaster: 'KH. Ahmad Fauzi'
  },
  { 
    id: 'p2', 
    name: 'Pondok Daarul Qur\'an', 
    location: 'Semarang, Jawa Tengah', 
    date: '2023-06-12',
    status: 'pending',
    santriCount: 85,
    description: 'Pondok dengan fokus pada hafalan Al-Quran',
    address: 'Jl. Qur\'an No. 12, Semarang',
    email: 'dq@pondok.id',
    phone: '024-76543210',
    headmaster: 'KH. Muhammad Zaini'
  },
  { 
    id: 'p3', 
    name: 'Pondok Al-Barokah', 
    location: 'Surabaya, Jawa Timur', 
    date: '2023-05-20',
    status: 'active',
    santriCount: 150,
    description: 'Pondok dengan kurikulum modern dan tradisional',
    address: 'Jl. Barokah No. 78, Surabaya',
    email: 'albarokah@pondok.id',
    phone: '031-65432109',
    headmaster: 'KH. Anwar Syafii'
  },
  { 
    id: 'p4', 
    name: 'Pondok Nurul Hidayah', 
    location: 'Jakarta Selatan, DKI Jakarta', 
    date: '2023-04-15',
    status: 'active',
    santriCount: 95,
    description: 'Pondok pesantren dengan fasilitas modern',
    address: 'Jl. Hidayah No. 34, Jakarta Selatan',
    email: 'nurulhidayah@pondok.id',
    phone: '021-54321098',
    headmaster: 'KH. Ridwan Kamil'
  },
  { 
    id: 'p5', 
    name: 'Pondok Al-Ikhlas', 
    location: 'Bekasi, Jawa Barat', 
    date: '2023-06-08',
    status: 'inactive',
    santriCount: 0,
    description: 'Pondok pesantren baru yang sedang dalam pembangunan',
    address: 'Jl. Ikhlas No. 56, Bekasi',
    email: 'alikhlas@pondok.id',
    phone: '021-43210987',
    headmaster: '-'
  },
];

// Period data
export const periodeList = [
  { id: '202306', name: 'Juni 2023' },
  { id: '202305', name: 'Mei 2023' },
  { id: '202304', name: 'April 2023' },
];

// RAB data with detailed items
export const rabList = [
  { 
    id: 'rab1', 
    pondok: 'Pondok Al-Hikmah', 
    pondokId: 'p1',
    periode: '202306', 
    tanggal: '2023-06-10',
    status: 'diajukan',
    totalPemasukan: 20000000,
    totalPengeluaran: 18500000,
    pemasukanItems: [
      { id: 'pi1', kategori: 'Yayasan', nama: 'Dana Rutin Yayasan', jumlah: 10000000 },
      { id: 'pi2', kategori: 'Donatur', nama: 'Sumbangan Donatur Tetap', jumlah: 5000000 },
      { id: 'pi3', kategori: 'SPP', nama: 'Iuran Santri', jumlah: 5000000 }
    ],
    pengeluaranItems: [
      { id: 'pe1', kategori: 'Operasional', nama: 'Listrik dan Air', jumlah: 3000000 },
      { id: 'pe2', kategori: 'Konsumsi', nama: 'Makan Santri', jumlah: 8000000 },
      { id: 'pe3', kategori: 'Gaji', nama: 'Honor Ustadz/Ustadzah', jumlah: 5000000 },
      { id: 'pe4', kategori: 'Sarana', nama: 'Perbaikan Kamar Mandi', jumlah: 2500000 }
    ]
  },
  { 
    id: 'rab2', 
    pondok: 'Pondok Daarul Qur\'an',
    pondokId: 'p2', 
    periode: '202306', 
    tanggal: '2023-06-12',
    status: 'revisi',
    totalPemasukan: 15000000,
    totalPengeluaran: 13800000,
    pemasukanItems: [
      { id: 'pi4', kategori: 'Yayasan', nama: 'Dana Rutin Yayasan', jumlah: 8000000 },
      { id: 'pi5', kategori: 'Donatur', nama: 'Sumbangan Donatur Tetap', jumlah: 3000000 },
      { id: 'pi6', kategori: 'SPP', nama: 'Iuran Santri', jumlah: 4000000 }
    ],
    pengeluaranItems: [
      { id: 'pe5', kategori: 'Operasional', nama: 'Listrik dan Air', jumlah: 2500000 },
      { id: 'pe6', kategori: 'Konsumsi', nama: 'Makan Santri', jumlah: 6000000 },
      { id: 'pe7', kategori: 'Gaji', nama: 'Honor Ustadz/Ustadzah', jumlah: 4500000 },
      { id: 'pe8', kategori: 'Sarana', nama: 'Pengadaan Buku Pelajaran', jumlah: 800000 }
    ]
  },
  { 
    id: 'rab3', 
    pondok: 'Pondok Al-Barokah',
    pondokId: 'p3', 
    periode: '202306', 
    tanggal: '2023-06-15',
    status: 'diterima',
    totalPemasukan: 25000000,
    totalPengeluaran: 23500000,
    pemasukanItems: [
      { id: 'pi7', kategori: 'Yayasan', nama: 'Dana Rutin Yayasan', jumlah: 12000000 },
      { id: 'pi8', kategori: 'Donatur', nama: 'Sumbangan Donatur Tetap', jumlah: 7000000 },
      { id: 'pi9', kategori: 'SPP', nama: 'Iuran Santri', jumlah: 6000000 }
    ],
    pengeluaranItems: [
      { id: 'pe9', kategori: 'Operasional', nama: 'Listrik dan Air', jumlah: 3500000 },
      { id: 'pe10', kategori: 'Konsumsi', nama: 'Makan Santri', jumlah: 10000000 },
      { id: 'pe11', kategori: 'Gaji', nama: 'Honor Ustadz/Ustadzah', jumlah: 6000000 },
      { id: 'pe12', kategori: 'Sarana', nama: 'Renovasi Masjid', jumlah: 4000000 }
    ]
  },
  { 
    id: 'rab4', 
    pondok: 'Pondok Nurul Hidayah',
    pondokId: 'p4', 
    periode: '202305', 
    tanggal: '2023-05-15',
    status: 'diterima',
    totalPemasukan: 18000000,
    totalPengeluaran: 16500000,
    pemasukanItems: [
      { id: 'pi10', kategori: 'Yayasan', nama: 'Dana Rutin Yayasan', jumlah: 9000000 },
      { id: 'pi11', kategori: 'Donatur', nama: 'Sumbangan Donatur Tetap', jumlah: 4000000 },
      { id: 'pi12', kategori: 'SPP', nama: 'Iuran Santri', jumlah: 5000000 }
    ],
    pengeluaranItems: [
      { id: 'pe13', kategori: 'Operasional', nama: 'Listrik dan Air', jumlah: 2800000 },
      { id: 'pe14', kategori: 'Konsumsi', nama: 'Makan Santri', jumlah: 7500000 },
      { id: 'pe15', kategori: 'Gaji', nama: 'Honor Ustadz/Ustadzah', jumlah: 4700000 },
      { id: 'pe16', kategori: 'Sarana', nama: 'Peralatan Kebersihan', jumlah: 1500000 }
    ]
  },
];

// LPJ data with detailed items
export const lpjList = [
  { 
    id: 'lpj1', 
    pondok: 'Pondok Al-Hikmah',
    pondokId: 'p1',
    periode: '202305', 
    tanggal: '2023-06-15',
    status: 'diajukan',
    totalRencanaPemasukan: 20000000,
    totalRealisasiPemasukan: 19200000,
    totalRencanaPengeluaran: 18500000,
    totalRealisasiPengeluaran: 18300000,
    bukti: 'bukti_lpj_alhikmah_202305.pdf',
    pemasukanItems: [
      { id: 'lpi1', kategori: 'Yayasan', nama: 'Dana Rutin Yayasan', rencana: 10000000, realisasi: 10000000 },
      { id: 'lpi2', kategori: 'Donatur', nama: 'Sumbangan Donatur Tetap', rencana: 5000000, realisasi: 4500000 },
      { id: 'lpi3', kategori: 'SPP', nama: 'Iuran Santri', rencana: 5000000, realisasi: 4700000 }
    ],
    pengeluaranItems: [
      { id: 'lpe1', kategori: 'Operasional', nama: 'Listrik dan Air', rencana: 3000000, realisasi: 3200000 },
      { id: 'lpe2', kategori: 'Konsumsi', nama: 'Makan Santri', rencana: 8000000, realisasi: 7900000 },
      { id: 'lpe3', kategori: 'Gaji', nama: 'Honor Ustadz/Ustadzah', rencana: 5000000, realisasi: 5000000 },
      { id: 'lpe4', kategori: 'Sarana', nama: 'Perbaikan Kamar Mandi', rencana: 2500000, realisasi: 2200000 }
    ]
  },
  { 
    id: 'lpj2', 
    pondok: 'Pondok Daarul Qur\'an',
    pondokId: 'p2',
    periode: '202305', 
    tanggal: '2023-06-18',
    status: 'revisi',
    totalRencanaPemasukan: 15000000,
    totalRealisasiPemasukan: 14800000,
    totalRencanaPengeluaran: 13800000,
    totalRealisasiPengeluaran: 14200000,
    bukti: 'bukti_lpj_dq_202305.pdf',
    pemasukanItems: [
      { id: 'lpi4', kategori: 'Yayasan', nama: 'Dana Rutin Yayasan', rencana: 8000000, realisasi: 8000000 },
      { id: 'lpi5', kategori: 'Donatur', nama: 'Sumbangan Donatur Tetap', rencana: 3000000, realisasi: 2800000 },
      { id: 'lpi6', kategori: 'SPP', nama: 'Iuran Santri', rencana: 4000000, realisasi: 4000000 }
    ],
    pengeluaranItems: [
      { id: 'lpe5', kategori: 'Operasional', nama: 'Listrik dan Air', rencana: 2500000, realisasi: 2700000 },
      { id: 'lpe6', kategori: 'Konsumsi', nama: 'Makan Santri', rencana: 6000000, realisasi: 6200000 },
      { id: 'lpe7', kategori: 'Gaji', nama: 'Honor Ustadz/Ustadzah', rencana: 4500000, realisasi: 4500000 },
      { id: 'lpe8', kategori: 'Sarana', nama: 'Pengadaan Buku Pelajaran', rencana: 800000, realisasi: 800000 }
    ]
  },
  { 
    id: 'lpj3', 
    pondok: 'Pondok Al-Barokah',
    pondokId: 'p3',
    periode: '202305', 
    tanggal: '2023-06-10',
    status: 'diterima',
    totalRencanaPemasukan: 25000000,
    totalRealisasiPemasukan: 24800000,
    totalRencanaPengeluaran: 23500000,
    totalRealisasiPengeluaran: 23100000,
    bukti: 'bukti_lpj_albarokah_202305.pdf',
    pemasukanItems: [
      { id: 'lpi7', kategori: 'Yayasan', nama: 'Dana Rutin Yayasan', rencana: 12000000, realisasi: 12000000 },
      { id: 'lpi8', kategori: 'Donatur', nama: 'Sumbangan Donatur Tetap', rencana: 7000000, realisasi: 6800000 },
      { id: 'lpi9', kategori: 'SPP', nama: 'Iuran Santri', rencana: 6000000, realisasi: 6000000 }
    ],
    pengeluaranItems: [
      { id: 'lpe9', kategori: 'Operasional', nama: 'Listrik dan Air', rencana: 3500000, realisasi: 3400000 },
      { id: 'lpe10', kategori: 'Konsumsi', nama: 'Makan Santri', rencana: 10000000, realisasi: 9800000 },
      { id: 'lpe11', kategori: 'Gaji', nama: 'Honor Ustadz/Ustadzah', rencana: 6000000, realisasi: 6000000 },
      { id: 'lpe12', kategori: 'Sarana', nama: 'Renovasi Masjid', rencana: 4000000, realisasi: 3900000 }
    ]
  },
  { 
    id: 'lpj4', 
    pondok: 'Pondok Nurul Hidayah',
    pondokId: 'p4',
    periode: '202304', 
    tanggal: '2023-05-15',
    status: 'diterima',
    totalRencanaPemasukan: 18000000,
    totalRealisasiPemasukan: 18000000,
    totalRencanaPengeluaran: 16500000,
    totalRealisasiPengeluaran: 16400000,
    bukti: 'bukti_lpj_nurulhidayah_202304.pdf',
    pemasukanItems: [
      { id: 'lpi10', kategori: 'Yayasan', nama: 'Dana Rutin Yayasan', rencana: 9000000, realisasi: 9000000 },
      { id: 'lpi11', kategori: 'Donatur', nama: 'Sumbangan Donatur Tetap', rencana: 4000000, realisasi: 4000000 },
      { id: 'lpi12', kategori: 'SPP', nama: 'Iuran Santri', rencana: 5000000, realisasi: 5000000 }
    ],
    pengeluaranItems: [
      { id: 'lpe13', kategori: 'Operasional', nama: 'Listrik dan Air', rencana: 2800000, realisasi: 2750000 },
      { id: 'lpe14', kategori: 'Konsumsi', nama: 'Makan Santri', rencana: 7500000, realisasi: 7500000 },
      { id: 'lpe15', kategori: 'Gaji', nama: 'Honor Ustadz/Ustadzah', rencana: 4700000, realisasi: 4700000 },
      { id: 'lpe16', kategori: 'Sarana', nama: 'Peralatan Kebersihan', rencana: 1500000, realisasi: 1450000 }
    ]
  },
];

// Helper functions
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

export const formatPeriode = (periode) => {
  if (!periode) return '';
  
  const year = periode.substring(0, 4);
  const month = periode.substring(4, 6);
  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
};

export const getStatusBadge = (status) => {
  switch (status) {
    case 'active':
    case 'diterima':
      return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
        {status === 'active' ? 'Aktif' : 'Diterima'}
      </span>;
    case 'pending':
    case 'diajukan':
      return <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">
        {status === 'pending' ? 'Menunggu' : 'Diajukan'}
      </span>;
    case 'inactive':
    case 'revisi':
      return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
        {status === 'inactive' ? 'Tidak Aktif' : 'Revisi'}
      </span>;
    default:
      return null;
  }
};
