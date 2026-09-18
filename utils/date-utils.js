/**
 * Mengubah tahun (angka atau string 4 digit) menjadi format tanggal awal tahun 'YYYY-01-01'
 * @param {number|string} val 
 * @returns {string}
 */
export function normalizeYearToDate(val) {
  if (!val) return "";
  const str = String(val).trim();
  // Jika sudah format YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }
  // Ambil 4 digit pertama sebagai tahun
  const match = str.match(/\b\d{4}\b/);
  if (match) {
    return `${match[0]}-01-01`;
  }
  return str;
}

/**
 * Normalisasi input jam / timestamp ke format timestamp PostgreSQL 'YYYY-MM-DD HH:mm:ss'
 * Menerima format: 'HH:mm', 'HH:mm:ss', atau ISO datetime string
 * @param {string} val 
 * @returns {string}
 */
export function normalizeTimestamp(val) {
  if (!val) return "";
  const str = String(val).trim();

  // Jika format waktu saja: HH:mm atau HH:mm:ss
  if (/^\d{2}:\d{2}(:\d{2})?$/.test(str)) {
    const timeWithSec = str.length === 5 ? `${str}:00` : str;
    return `2026-01-01 ${timeWithSec}`;
  }

  // Jika format datetime ISO atau teks
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const day = String(parsed.getDate()).padStart(2, "0");
    const hours = String(parsed.getHours()).padStart(2, "0");
    const minutes = String(parsed.getMinutes()).padStart(2, "0");
    const seconds = String(parsed.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  return str;
}

/**
 * Mengecek apakah jam_mulai lebih awal dari jam_akhir
 * @param {string} start 
 * @param {string} end 
 * @returns {boolean} true jika start < end
 */
export function isStartTimeEarlier(start, end) {
  if (!start || !end) return false;
  const sStr = String(start).trim();
  const eStr = String(end).trim();

  // Jika keduanya format waktu saja: HH:mm atau HH:mm:ss
  const isTimeOnly = /^\d{2}:\d{2}(:\d{2})?$/;
  if (isTimeOnly.test(sStr) && isTimeOnly.test(eStr)) {
    const sWithSec = sStr.length === 5 ? `${sStr}:00` : sStr;
    const eWithSec = eStr.length === 5 ? `${eStr}:00` : eStr;
    return sWithSec < eWithSec;
  }

  const d1 = new Date(normalizeTimestamp(start));
  const d2 = new Date(normalizeTimestamp(end));

  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
    return false;
  }

  return d1.getTime() < d2.getTime();
}
