import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { fileName } = await request.json();

    if (!fileName) {
      return NextResponse.json(
        { error: 'Filename is required' }, 
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), 'public', 'generated-qrs', fileName);

    // Check if file exists before attempting to delete
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json(
        { error: 'File not found' }, 
        { status: 404 }
      );
    }

    // Delete the file
    await fs.unlink(filePath);

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