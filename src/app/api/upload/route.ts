import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || 'image/jpeg';
    const base64DataUri = `data:${mimeType};base64,${buffer.toString('base64')}`;

    // Try saving to disk if writable (Localhost / Docker with write permissions)
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });

      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const uniqueName = `${Date.now()}_${cleanFileName}`;
      const filePath = path.join(uploadsDir, uniqueName);

      await fs.writeFile(filePath, buffer);

      const publicUrl = `/uploads/${uniqueName}`;

      return NextResponse.json({
        success: true,
        url: publicUrl,
        fileName: uniqueName,
      });
    } catch (diskError: any) {
      // Serverless Read-Only environment fallback (Netlify / Vercel / AWS Lambda):
      // Return high-efficiency Base64 Data URI directly, which saves seamlessly in MongoDB
      console.warn('Read-only filesystem detected, falling back to Base64 Data URI:', diskError.message);
      return NextResponse.json({
        success: true,
        url: base64DataUri,
        fileName: file.name,
      });
    }
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'File upload failed' },
      { status: 500 }
    );
  }
}
