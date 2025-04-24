
// Event type definitions
import React from 'react';

declare global {
  interface EventTarget {
    value?: string;
    name?: string;
    files?: FileList;
    checked?: boolean;
    id?: string;
  }
}

export {};
