// Facebook Pixel TypeScript definitions
declare global {
  interface Window {
    fbq: (
      action: 'init' | 'track' | 'trackCustom',
      eventName: string,
      parameters?: Record<string, any>
    ) => void;
    _fbq?: any;
  }
}

// Common Facebook Pixel events
export type FacebookPixelEvent = 
  | 'PageView'
  | 'ViewContent'
  | 'AddToCart'
  | 'InitiateCheckout'
  | 'Purchase'
  | 'Lead'
  | 'CompleteRegistration'
  | 'Search'
  | 'Contact'
  | 'CustomizeProduct'
  | 'Donate'
  | 'FindLocation'
  | 'Schedule'
  | 'StartTrial'
  | 'SubmitApplication'
  | 'Subscribe';

// Standard event parameters
export interface StandardEventParameters {
  content_ids?: string[];
  content_type?: string;
  content_name?: string;
  content_category?: string;
  value?: number;
  currency?: string;
  num_items?: number;
  search_string?: string;
  lead_source?: string;
  filters_applied?: string[];
}

// Custom event parameters
export interface CustomEventParameters extends Record<string, any> {}

export {};
