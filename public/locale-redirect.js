let savedLocale = null;
try {
  savedLocale = localStorage.getItem('criomant-locale');
} catch {
  // The no-storage path remains English-first via the document refresh.
}
location.replace(savedLocale === 'uk' ? '/uk/' : '/en/');
