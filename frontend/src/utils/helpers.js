export function getErrorMessage(error) {
  const data = error?.response?.data;
  if (data?.message) return data.message;
  if (data?.errors && typeof data.errors === 'object') {
    return Object.values(data.errors).flat().join(', ');
  }
  return error?.message || 'Something went wrong';
}

export function formatDate(date) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatCurrency(amount) {
  if (amount == null) return '-';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatTime(time) {
  if (!time) return '-';
  return time.slice(0, 5);
}

export const LEAVE_TYPES = ['CASUAL', 'SICK', 'EARNED', 'MATERNITY', 'PATERNITY', 'UNPAID'];
export const GENDERS = ['MALE', 'FEMALE', 'OTHER'];
export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
