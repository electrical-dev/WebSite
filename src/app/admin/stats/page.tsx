import { promises as fs } from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';

// --- IMPORTANTE ---
// Para mayor seguridad, mueve este secreto a un archivo .env.local como STATS_SECRET
// y léelo con process.env.STATS_SECRET
const SECRET_KEY = 'esto-es-un-secreto-muy-seguro-cambialo';

export default async function StatsPage({
  searchParams,
}: {
  searchParams: { secret: string };
}) {
  if (searchParams.secret !== SECRET_KEY) {
    notFound();
  }

  const dataPath = path.join(process.cwd(), 'src', 'data', 'visitor-count.json');
  let visitorCount = 0;

  try {
    const fileContents = await fs.readFile(dataPath, 'utf-8');
    const data = JSON.parse(fileContents);
    visitorCount = data.count;
  } catch (error) {
    console.error('Error reading visitor count:', error);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-8 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Estadísticas de Visitantes
        </h1>
        <div className="flex items-center justify-center">
          <p className="text-6xl font-extrabold text-blue-600 dark:text-blue-400">
            {visitorCount.toLocaleString()}
          </p>
          <p className="ml-4 text-lg text-gray-600 dark:text-gray-300">visitas totales</p>
        </div>
      </div>
      <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        Esta página es privada. ¡No compartas la URL!
      </p>
    </div>
  );
} 