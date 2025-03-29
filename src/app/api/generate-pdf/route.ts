import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const { companyId, pdfBlob } = await request.json();

        const pdfDir = path.join(process.cwd(), 'public', 'pdfs');
        const pdfFilePath = path.join(pdfDir, `${companyId}.pdf`);

        if (!fs.existsSync(pdfDir)) {
            fs.mkdirSync(pdfDir, { recursive: true });
        }

        const files = fs.readdirSync(pdfDir);
        for (const file of files) {
            const filePath = path.join(pdfDir, file);
            fs.unlinkSync(filePath);
        }

        fs.writeFileSync(pdfFilePath, Buffer.from(pdfBlob, 'base64')); // Assuming pdfBlob is base64 encoded

        return NextResponse.json({ message: 'PDF created successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error generating PDF:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
} 