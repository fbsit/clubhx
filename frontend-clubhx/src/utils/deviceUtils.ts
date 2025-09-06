// Device detection utilities

export const isIOS = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const getSafariVersion = (): number | null => {
  if (typeof window === 'undefined') return null;
  
  const ua = navigator.userAgent;
  const match = ua.match(/Version\/(\d+)/);
  return match ? parseInt(match[1]) : null;
};