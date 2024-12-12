import QRCode from 'qrcode';
import { redis } from './redis.service';
import { ContactInfo, QROptions } from '@/types/contact.type';

export class QRGeneratorService {
  private static defaultQROptions: QROptions = {
    color: {
      dark: '#0000FF',
      light: '#FFFFFF',
    },
    width: 256,
  };

  static async generateContactQR(
    contactInfo: ContactInfo,
    qrOptions: QROptions = {}
  ): Promise<{ message: string; fileKey: string }> {
    // Validate required fields
    if (!contactInfo.firstName || !contactInfo.lastName || !contactInfo.phone) {
      throw new Error('First name, last name, and phone are required');
    }

    const finalQROptions = {
      ...this.defaultQROptions,
      ...qrOptions,
    };

    const contactDetails = this.buildVCard(contactInfo);
    const fileName = `${contactInfo.lastName}_${contactInfo.firstName}_${Date.now()}.png`;

    return new Promise((resolve, reject) => {
      QRCode.toDataURL(
        contactDetails,
        finalQROptions,
        async (err, base64Image) => {
          if (err) {
            reject(new Error(`QR generation error: ${err.message}`));
            return;
          }

          try {
            // Store base64 image in Upstash with a unique key
            const fileKey = `qr:${fileName}`;
            // Remove the Data URL prefix before storing
            const base64Data = base64Image.replace(
              /^data:image\/png;base64,/,
              ''
            );
            await redis.set(fileKey, base64Data, { ex: 60 * 60 * 24 * 7 }); // 7 days expiration

            resolve({
              message: `QR code generated successfully: ${fileName}`,
              fileKey: fileName,
            });
          } catch (error) {
            console.error('Redis storage error:', error);
            reject(
              new Error(
                `Redis storage error: ${error instanceof Error ? error.message : 'Unknown error'}`
              )
            );
          }
        }
      );
    });
  }

  static async listQRCodes(): Promise<
    Array<{ fileName: string; base64Data: string }>
  > {
    const keys = await redis.keys('qr:*');
    const qrCodes = await Promise.all(
      keys.map(async (key) => {
        const data = await redis.get(key);
        return {
          fileName: key.replace('qr:', ''),
          base64Data: data as string,
        };
      })
    );
    return qrCodes;
  }

  static async getQRCode(fileName: string): Promise<string | null> {
    return await redis.get(`qr:${fileName}`);
  }

  static async deleteQRCode(fileName: string): Promise<void> {
    await redis.del(`qr:${fileName}`);
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
