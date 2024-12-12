import { NextRequest, NextResponse } from 'next/server';
import { QRGeneratorService } from '@/services/qr-generator.service';

export async function POST(request: NextRequest) {
  try {
    const { fileName } = await request.json();

    if (!fileName) {
      return NextResponse.json(
        { error: 'Filename is required' }, 
        { status: 400 }
      );
    }

    await QRGeneratorService.deleteQRCode(fileName);

    return NextResponse.json(
      { message: `QR code ${fileName} deleted successfully` }, 
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
} 