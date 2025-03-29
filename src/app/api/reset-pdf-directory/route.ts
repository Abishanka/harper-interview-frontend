import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST() {
    const pdfDir = path.join(process.cwd(), 'public', 'pdfs');

    try {
        const files = fs.readdirSync(pdfDir);
        for (const file of files) {
            const filePath = path.join(pdfDir, file);
            fs.unlinkSync(filePath);
        }
        return NextResponse.json({ message: 'All files deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting files in PDF directory:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
} 