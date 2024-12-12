export interface ContactInfo {
  firstName: string;
  lastName: string;
  organization?: string;
  title?: string;
  phone: string;
  email?: string;
}

export interface QROptions {
  color?: {
    dark?: string;
    light?: string;
  };
  width?: number;
} 