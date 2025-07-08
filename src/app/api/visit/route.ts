import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST() {
  const dataPath = path.join(process.cwd(), 'src', 'data', 'visitor-count.json');
  
  try {
    let count = 0;
    try {
      const fileContents = await fs.readFile(dataPath, 'utf-8');
      const data = JSON.parse(fileContents);
      count = data.count;
    } catch (error) {
      // Si el archivo no existe, lo crearemos.
      console.log("Visitor count file not found, creating one.");
    }

    const newCount = count + 1;
    await fs.writeFile(dataPath, JSON.stringify({ count: newCount }));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating visitor count:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 