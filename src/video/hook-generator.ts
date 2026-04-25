import { parseMarkdownFile } from '../parser';

export async function generateHooks(filePath: string) {
  const article = parseMarkdownFile(filePath);

  const hooks = [
    {
      variant: 'Pregunta',
      visual: `Texto en pantalla: "¿Tu ${article.keyword} está muerto?"`,
      audio: `Si estás escribiendo sobre ${article.keyword} y nadie te lee, probablemente es porque ignoras esto.`,
      duration: '3-4s'
    },
    {
      variant: 'Dato',
      visual: `Texto en pantalla: "El 90% falla en esto..."`,
      audio: `Solo el 10% de los creadores dominan ${article.keyword} de esta manera. Así es como lo logran.`,
      duration: '4-5s'
    },
    {
      variant: 'Contraintuitivo',
      visual: `Texto en pantalla: "Deja de hacer esto ❌"`,
      audio: `Si quieres rankear por ${article.keyword}, deja de hacer lo que todo el mundo hace. Prueba esto en su lugar.`,
      duration: '4s'
    }
  ];

  return hooks;
}
