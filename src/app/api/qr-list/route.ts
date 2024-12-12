import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const qrDir = path.join(process.cwd(), 'public', 'generated-qrs');
    
    // Ensure the directory exists
    await fs.mkdir(qrDir, { recursive: true });
    
    // Read the directory contents
    const qrCodes = await fs.readdir(qrDir);
    
    return NextResponse.json({ qrCodes }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
} 