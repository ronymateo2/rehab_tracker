'use client';

import { useEffect } from 'react';
import toast from 'react-hot-toast';

export function PWAUpdater() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    let refreshing = false;

    // Detectar cuando el controlador cambia, lo que significa que el nuevo SW ha tomado el mando
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        window.location.reload();
        refreshing = true;
      }
    });

    const handleUpdate = (registration: ServiceWorkerRegistration) => {
      const showUpdateToast = (worker: ServiceWorker) => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) {
          toast.success(
            (t) => (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">Hay una nueva versión disponible.</p>
                <button 
                  className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-semibold w-full hover:bg-blue-700 transition"
                  onClick={() => {
                    toast.dismiss(t.id);
                    // Al mandar SKIP_WAITING, el Worker en espera toma el mando, lo cual lanza el event listener de arriba 
                    worker.postMessage({ type: 'SKIP_WAITING' });
                  }}
                >
                  Actualizar ahora
                </button>
              </div>
            ),
            { duration: Infinity, id: 'pwa-update' }
          );
        }
      };

      if (registration.waiting) {
        showUpdateToast(registration.waiting);
      }

      registration.addEventListener('updatefound', () => {
        if (registration.installing) {
          registration.installing.addEventListener('statechange', () => {
            showUpdateToast(registration.installing!);
          });
        }
      });
    };

    navigator.serviceWorker.getRegistration().then((reg) => {
      if (reg) handleUpdate(reg);
    });
  }, []);

  return null;
}
