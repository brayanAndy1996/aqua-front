import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Tipos para los datos de exportación
type ExportData = Record<string, string | number | boolean | null>;

/**
 * Exporta datos a PDF usando jsPDF
 * @param data Array de objetos con los datos a exportar
 * @param filename Nombre del archivo (sin extensión)
 */
export const exportToPDF = async (data: ExportData[], filename: string) => {
  try {
    // Crear nueva instancia de jsPDF
    const doc = new jsPDF();
    
    // Configurar título
    doc.setFontSize(16);
    doc.text('Reporte de Ventas', 14, 20);
    
    // Configurar fecha de generación
    doc.setFontSize(10);
    doc.text(`Generado el: ${new Date().toLocaleDateString('es-CO')}`, 14, 30);
    
    // Preparar datos para la tabla
    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      const rows = data.map(item => headers.map(header => String(item[header] || '')));
      
      // Crear tabla
      autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 40,
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { top: 40 },
      });
    }
    
    // Descargar el PDF
    doc.save(`${filename}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error al exportar PDF:', error);
    throw new Error('Error al generar el archivo PDF');
  }
};

/**
 * Exporta datos a Excel usando XLSX
 * @param data Array de objetos con los datos a exportar
 * @param filename Nombre del archivo (sin extensión)
 */
export const exportToExcel = async (data: ExportData[], filename: string) => {
  try {
    // Crear nuevo libro de trabajo
    const workbook = XLSX.utils.book_new();
    
    // Crear hoja de trabajo a partir de los datos
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Configurar ancho de columnas automáticamente
    const colWidths = Object.keys(data[0] || {}).map(key => {
      const maxLength = Math.max(
        key.length,
        ...data.map(row => String(row[key] || '').length)
      );
      return { wch: Math.min(maxLength + 2, 50) };
    });
    
    worksheet['!cols'] = colWidths;
    
    // Agregar hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte de Ventas');
    
    // Descargar el archivo
    XLSX.writeFile(workbook, `${filename}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('Error al exportar Excel:', error);
    throw new Error('Error al generar el archivo Excel');
  }
};

/**
 * Exporta datos a CSV
 * @param data Array de objetos con los datos a exportar
 * @param filename Nombre del archivo (sin extensión)
 */
export const exportToCSV = async (data: ExportData[], filename: string) => {
  try {
    if (data.length === 0) {
      throw new Error('No hay datos para exportar');
    }
    
    // Obtener headers
    const headers = Object.keys(data[0]);
    
    // Crear contenido CSV
    const csvContent = [
      headers.join(','), // Headers
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escapar comillas y envolver en comillas si contiene comas
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');
    
    // Crear blob y descargar
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    return true;
  } catch (error) {
    console.error('Error al exportar CSV:', error);
    throw new Error('Error al generar el archivo CSV');
  }
};
