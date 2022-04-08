import { useCurrentUser } from 'hooks/api';
import { useEffect } from 'react';

interface Heap {
  track: (event: string, properties?: Object) => void;
  identify: (identity: string) => void;
  resetIdentity: () => void;
  addUserProperties: (properties: Object) => void;
  addEventProperties: (properties: Object) => void;
  removeEventProperty: (property: string) => void;
  clearEventProperties: () => void;
  appid: string;
  userId: string;
  identity: string | null;
  config: any;
}

class HeapError extends Error { }

const getHeap = function (): Heap {
  // @ts-ignore
  if (window.heap) {
    // @ts-ignore
    return window.heap;
  }
  throw new HeapError('heap is not found');
};

const runWithErrorHandler = function (callback: () => void): void {
  try {
    callback();
  } catch (e: unknown) {
    if (e instanceof HeapError) {
      console.log(e.message);
    } else {
      throw e;
    }
  }
};

export const useHeapIdentify = () => {
  const { currentUser, isSuccess } = useCurrentUser();
  useEffect(() => {
    if (currentUser && isSuccess) {
      runWithErrorHandler(() => {
        getHeap().identify(currentUser.id);
        getHeap().addUserProperties({ Email: currentUser.email });
      });
    }
  }, [currentUser, isSuccess]);
};

export const setIdentify = (email: string): void => {
  runWithErrorHandler(() => {
    getHeap().identify(email);
  });
};

export const setProperty = (properties: Object): void => {
  runWithErrorHandler(() => {
    getHeap().addUserProperties(properties);
  });
};

export const resetIdentity = (): void => {
  runWithErrorHandler(() => {
    getHeap().resetIdentity();
  });
};

export const sendHeapEvent = (name: string, eventProperties: Object): void => {
  runWithErrorHandler(() => {
    getHeap().track(name, eventProperties);
  });
};
