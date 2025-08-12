/**
 * Load Midtrans Snap.js on client and return window.snap when ready
 * - Picks sandbox/production URL based on runtime config
 */
export const useMidtransSnap = async () => {
  if (!process.client) return null;

  // If already loaded
  if (window.snap) return window.snap;

  const config = useRuntimeConfig();
  const isProduction = (config.public.midtransMode || 'SANDBOX') === 'PRODUCTION';
  const clientKey = config.public.midtransClientKey || '';
  const src = isProduction ? 'https://app.midtrans.com/snap/snap.js' : 'https://app.sandbox.midtrans.com/snap/snap.js';

  console.log('Loading Midtrans Snap.js...');
  console.log('Is production:', config.public.midtransMode);
  console.log('Is production:', isProduction);
  console.log('Client key:', clientKey);
  console.log('Source URL:', src);

  await new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-midtrans]');
    if (existing) {
      return resolve();
    }
    const script = document.createElement('script');
    script.setAttribute('data-midtrans', 'true');
    script.src = src;
    script.async = true;
    script.setAttribute('data-client-key', clientKey);
    script.onload = () => resolve();
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });

  return window.snap || null;
};
