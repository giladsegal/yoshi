import { useContext } from 'react';
import { BrowserClient } from '@sentry/browser';
import { FedopsLogger } from '@wix/fedops-logger';
import { PublicDataContext } from './PublicDataContext';
import { ControllerContext } from './ControllerContext';
import { FedopsContext } from './FedopsProvider';
import { SentryContext } from './SentryProvider';

export function usePublicData() {
  const publicDataContext = useContext(PublicDataContext);

  if (!publicDataContext.ready && publicDataContext.readyPromise) {
    throw publicDataContext.readyPromise;
  }

  return publicDataContext;
}

export function useController() {
  return useContext(ControllerContext);
}

export function useFedops() {
  return useContext(FedopsContext) as FedopsLogger;
}

export function useSentry() {
  useContext(SentryContext) as BrowserClient;
}
