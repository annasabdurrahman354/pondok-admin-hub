
/**
 * Utility functions for formatting data
 */

export const formatPeriode = (periode: string): string => {
  if (!periode) return '-';
  const year = periode.substring(0, 4);
  const month = periode.substring(4, 6);
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
};

export const formatDate = (dateString: string | null): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
    case 'diterima':
      return {
        label: status === 'active' ? 'Aktif' : 'Diterima',
        className: "px-2 py-1 text-xs rounded-full bg-green-100 text-green-800"
      };
    case 'pending':
    case 'diajukan':
      return {
        label: status === 'pending' ? 'Menunggu' : 'Diajukan',
        className: "px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800"
      };
    case 'inactive':
    case 'revisi':
      return {
        label: status === 'inactive' ? 'Tidak Aktif' : 'Revisi',
        className: "px-2 py-1 text-xs rounded-full bg-red-100 text-red-800"
      };
    case 'draft':
      return {
        label: 'Draft',
        className: "px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800"
      };
    default:
      return {
        label: status,
        className: "px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800"
      };
  }
};
