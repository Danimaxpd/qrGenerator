import { NextRequest, NextResponse } from 'next/server';
import { QRGeneratorService } from '@/services/qr-generator.service';
export async function POST(request: NextRequest) {
  try {
    const contactInfo = await request.json();
    const result = await QRGeneratorService.generateContactQR(contactInfo);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
