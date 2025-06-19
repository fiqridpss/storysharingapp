import { urlBase64ToUint8Array } from '../utils/push-helper.js';

const VAPID_PUBLIC_KEY = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

export const subscribeUser = async (token) => {
  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  const response = await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      endpoint: subscription.endpoint,
      keys: subscription.toJSON().keys,
    }),
  });

  const data = await response.json();

  if (response.ok && !data.error) {
    console.log('Subscribed successfully:', data.message);
    return subscription;
  } else {
    throw new Error(data.message || 'Subscription failed');
  }
};

export const unsubscribeUser = async (token) => {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (!subscription) return;

  const response = await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      endpoint: subscription.endpoint,
    }),
  });

  const data = await response.json();

  if (response.ok && !data.error) {
    await subscription.unsubscribe();
    console.log('Unsubscribed successfully:', data.message);
  } else {
    throw new Error(data.message || 'Unsubscribe failed');
  }
};
