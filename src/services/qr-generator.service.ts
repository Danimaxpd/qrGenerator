import QRCode from 'qrcode';
import fs from 'fs/promises';
import path from 'path';
import { ContactInfo, QROptions } from '@/types/contact.type';

export class QRGeneratorService {
  private static defaultQROptions: QROptions = {
    color: {
      dark: '#0000FF',
      light: '#FFFFFF'
    },
    width: 256
  };

  static async generateContactQR(
    contactInfo: ContactInfo, 
    qrOptions: QROptions = {}
  ): Promise<{ message: string; filePath: string }> {
    // Validate required fields
    if (!contactInfo.firstName || !contactInfo.lastName || !contactInfo.phone) {
      throw new Error('First name, last name, and phone are required');
    }

    const finalQROptions = { 
      ...this.defaultQROptions, 
      ...qrOptions 
    };

    const contactDetails = this.buildVCard(contactInfo);
    const fileName = `${contactInfo.lastName}_${contactInfo.firstName}.png`;
    const filePath = path.join(process.cwd(), 'public', 'generated-qrs', fileName);

    // Ensure directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    return new Promise((resolve, reject) => {
      QRCode.toFile(filePath, contactDetails, finalQROptions, (err) => {
        if (err) {
          reject(new Error(`QR generation error: ${err.message}`));
        } else {
          resolve({
            message: `QR code generated successfully: ${fileName}`,
            filePath: `/generated-qrs/${fileName}`
          });
        }
      });
    });
  }

  private static buildVCard(contactInfo: ContactInfo): string {
    return `BEGIN:VCARD
VERSION:3.0
N:${contactInfo.lastName};${contactInfo.firstName};;;
FN:${contactInfo.firstName} ${contactInfo.lastName}
${contactInfo.organization ? `ORG:${contactInfo.organization}` : ''}
${contactInfo.title ? `TITLE:${contactInfo.title}` : ''}
TEL;TYPE=CELL,VOICE:${contactInfo.phone}
${contactInfo.email ? `EMAIL;TYPE=PREF,INTERNET:${contactInfo.email}` : ''}
END:VCARD`;
  }
} 