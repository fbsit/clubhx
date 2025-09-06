import { useState, useEffect } from 'react';
import { isIOS } from '@/utils/deviceUtils';

export const useIsIOS = (): boolean => {
  const [isIOSDevice, setIsIOSDevice] = useState(false);

  useEffect(() => {
    setIsIOSDevice(isIOS());
  }, []);

  return isIOSDevice;
};