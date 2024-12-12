import { NextRequest, NextResponse } from 'next/server';
import { QRGeneratorService } from '@/services/qr-generator.service';

export async function GET(request: NextRequest) {
  try {
    const qrCodes = await QRGeneratorService.listQRCodes();
    return NextResponse.json({ qrCodes }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
} 