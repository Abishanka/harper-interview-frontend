import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    const { selectedCompany } = await request.json();
    const pdfDir = path.join(process.cwd(), 'public', 'pdfs');
    const pdfFilePath = path.join(pdfDir, `${selectedCompany}.pdf`);
    const pdfExists = fs.existsSync(pdfFilePath);
    return NextResponse.json({ ready: pdfExists });
}