import { useCallback } from 'react';
import { type IProduct } from '@/entities';

export const usePDF = () => {
  const generatePDF = useCallback((products: IProduct[]) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const tableRows = products.map((product: IProduct) => 
      `<tr>
        <td>${product.name}</td>
        <td>${product.weight}</td>
        <td>${product.price}</td>
      </tr>`
    ).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Прайс-лист</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>Прайс-лист</h1>
          <table>
            <thead>
              <tr>
                <th>Наименование</th>
                <th>Вес(г)</th>
                <th>Цена (руб.)</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  }, []);

  return { generatePDF };
};
