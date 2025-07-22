"use client";

import { useMemo, useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Spinner,
  Card,
  CardBody,
  CardHeader,
  Pagination,
  Select,
  SelectItem
} from '@heroui/react';
import { motion } from 'framer-motion';
import { FileText, FileSpreadsheet, DownloadIcon } from 'lucide-react';
import { SaleItems } from '@/types/saleItems';
import { formatCurrency } from '@/lib/utils/format';
import { exportToPDF, exportToExcel } from '@/lib/utils/export';
import dayjs from 'dayjs';

interface SalesDataTableProps {
  salesData: SaleItems[];
  loading?: boolean;
  title?: string;
}

export default function SalesDataTable({ 
  salesData, 
  loading = false, 
  title = "Datos de Ventas" 
}: SalesDataTableProps) {
  console.log("🚀 ~ salesData:", salesData)
  // Estado para la paginación
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  // Configuración de columnas
  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'product_name', label: 'Producto', sortable: true },
    { key: 'quantity', label: 'Cantidad', sortable: true },
    { key: 'unit_price', label: 'Precio Unitario', sortable: true },
    { key: 'subtotal', label: 'Subtotal', sortable: true },
    { key: 'user_name', label: 'Usuario', sortable: true },
    { key: 'date', label: 'Fecha', sortable: true },
  ];

  // Procesar datos para la tabla
  const processedData = useMemo(() => {
    return salesData.map((item, index) => ({
      id: item.id || index + 1,
      product_name: item.product?.name || 'Producto sin nombre',
      quantity: item.quantity,
      unit_price: item.unit_price,
      subtotal: item.subtotal,
      user_name: item.user_name || 'N/A',
      date: item.createdAt ? dayjs(item.createdAt).format('DD/MM/YYYY') : 'N/A',
      raw: item // Mantener datos originales para exportación
    }));
  }, [salesData]);

  // Función para exportar a PDF
  const handleExportPDF = async () => {
    try {
      const exportData = processedData.map(item => ({
        'ID': item.id,
        'Producto': item.product_name,
        'Cantidad': item.quantity,
        'Precio Unitario': formatCurrency(item.unit_price),
        'Subtotal': formatCurrency(item.subtotal),
        'Usuario': item.user_name,
        'Fecha': item.date
      }));

      await exportToPDF(exportData, `reporte-ventas-${dayjs().format('YYYY-MM-DD')}`);
    } catch (error) {
      console.error('Error al exportar PDF:', error);
    }
  };

  // Función para exportar a Excel
  const handleExportExcel = async () => {
    try {
      const exportData = processedData.map(item => ({
        'ID': item.id,
        'Producto': item.product_name,
        'Cantidad': item.quantity,
        'Precio Unitario': item.unit_price,
        'Subtotal': item.subtotal,
        'Usuario': item.user_name,
        'Fecha': item.date
      }));

      await exportToExcel(exportData, `reporte-ventas-${dayjs().format('YYYY-MM-DD')}`);
    } catch (error) {
      console.error('Error al exportar Excel:', error);
    }
  };

  // Renderizar celda
  const renderCell = (item: typeof processedData[0], columnKey: string) => {
    switch (columnKey) {
      case 'id':
        return (
          <Chip 
            size="sm" 
            variant="flat" 
            color="primary"
            className="font-mono"
          >
            #{item.id}
          </Chip>
        );
      case 'product_name':
        return (
          <div className="flex flex-col">
            <span className="font-medium text-foreground">
              {item.product_name}
            </span>
          </div>
        );
      case 'quantity':
        return (
          <Chip 
            size="sm" 
            variant="flat" 
            color="secondary"
            className="font-mono"
          >
            {item.quantity}
          </Chip>
        );
      case 'unit_price':
        return (
          <span className="font-mono text-success">
            {formatCurrency(item.unit_price)}
          </span>
        );
      case 'subtotal':
        return (
          <span className="font-mono font-semibold text-success">
            {formatCurrency(item.subtotal)}
          </span>
        );
      case 'user_name':
        return (
          <span className="text-foreground-500 font-mono">
            {item.user_name}
          </span>
        );
      case 'date':
        return (
          <span className="text-foreground-500 font-mono">
            {item.date}
          </span>
        );
      default:
        const value = item[columnKey as keyof typeof item];
        // Convert to string to ensure we return a valid ReactNode
        return typeof value === 'object' ? JSON.stringify(value) : String(value);
    }
  };

  // Calcular datos paginados
  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return processedData.slice(start, end);
  }, [processedData, page, rowsPerPage]);

  // Calcular total de páginas
  const totalPages = Math.ceil(processedData.length / rowsPerPage);

  // Manejar cambio de página
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Manejar cambio de filas por página
  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1); // Resetear a la primera página cuando cambia el número de filas
  };

  if (loading) {
    return (
      <Card className="w-full bg-white/10 backdrop-blur-md border border-white/20">
        <CardBody className="flex items-center justify-center py-12">
          <Spinner size="lg" color="primary" />
          <p className="mt-4 text-foreground-500">Cargando datos...</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="w-full bg-white/10 backdrop-blur-md border border-white/20">
        <CardHeader className="flex flex-row items-center justify-between px-6 py-4">
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              {title}
            </h3>
            <p className="text-sm text-foreground-500">
              {processedData.length} registros encontrados
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              color="danger"
              variant="flat"
              size="sm"
              startContent={<FileText size={16} />}
              onPress={handleExportPDF}
              className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30"
            >
              PDF
            </Button>
            <Button
              color="success"
              variant="flat"
              size="sm"
              startContent={<FileSpreadsheet size={16} />}
              onPress={handleExportExcel}
              className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/30"
            >
              Excel
            </Button>
          </div>
        </CardHeader>

        <CardBody className="px-0 py-0">
          {/* Vista Desktop - Tabla */}
          <div className="hidden lg:block">
            <Table
              aria-label="Tabla de datos de ventas"
              className="min-h-[400px]"
              classNames={{
                wrapper: "bg-transparent shadow-none",
                th: "bg-white/5 backdrop-blur-sm border-b border-white/10 text-foreground-600",
                td: "border-b border-white/5 group-data-[first=true]:first:before:rounded-none group-data-[first=true]:last:before:rounded-none group-data-[middle=true]:before:rounded-none group-data-[last=true]:first:before:rounded-none group-data-[last=true]:last:before:rounded-none",
                tr: "hover:bg-white/5 transition-colors",
              }}
            >
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn
                    key={column.key}
                    allowsSorting={column.sortable}
                    className="text-left"
                  >
                    {column.label}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody 
                items={paginatedData}
                emptyContent={
                  <div className="flex flex-col items-center justify-center py-12">
                    <DownloadIcon size={48} className="text-foreground-300 mb-4" />
                    <p className="text-foreground-500 text-lg">
                      No hay datos de ventas disponibles
                    </p>
                    <p className="text-foreground-400 text-sm">
                      Ajusta los filtros para ver más resultados
                    </p>
                  </div>
                }
              >
                {(item) => (
                  <TableRow key={item.id}>
                    {(columnKey) => (
                      <TableCell>
                        {renderCell(item, columnKey as string)}
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Vista Móvil - Cards */}
          <div className="block lg:hidden p-4">
            {paginatedData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <DownloadIcon size={48} className="text-foreground-300 mb-4" />
                <p className="text-foreground-500 text-lg">
                  No hay datos de ventas disponibles
                </p>
                <p className="text-foreground-400 text-sm">
                  Ajusta los filtros para ver más resultados
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedData.map((item) => (
                  <Card key={item.id} className="w-full bg-white/5 backdrop-blur-sm border border-white/10">
                    <CardBody className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Chip 
                              size="sm" 
                              variant="flat" 
                              color="primary"
                              className="font-mono"
                            >
                              #{item.id}
                            </Chip>
                            <Chip 
                              size="sm" 
                              variant="flat" 
                              color="secondary"
                              className="font-mono"
                            >
                              {item.quantity}
                            </Chip>
                          </div>
                          <p className="font-medium text-foreground text-sm">
                            {item.product_name}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-foreground-500">Precio Unitario:</span>
                          <span className="text-sm font-mono text-success">
                            {formatCurrency(item.unit_price)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-foreground-500">Subtotal:</span>
                          <span className="text-sm font-mono font-semibold text-success">
                            {formatCurrency(item.subtotal)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-xs text-foreground-500">Usuario:</span>
                          <span className="text-sm font-mono text-foreground-500">
                            {item.user_name}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-xs text-foreground-500">Fecha:</span>
                          <span className="text-sm font-mono text-foreground-500">
                            {item.date}
                          </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          {/* Paginación y selector de filas por página */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 px-4 py-2 bg-white/5">
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground-500">Filas por página:</span>
              <Select
                aria-label="Filas por página"
                size="sm"
                className="w-20 bg-white/10"
                selectedKeys={[rowsPerPage.toString()]}
                onChange={handleRowsPerPageChange}
              >
                <SelectItem key="5" >5</SelectItem>
                <SelectItem key="10" >10</SelectItem>
                <SelectItem key="25" >25</SelectItem>
                <SelectItem key="50" >50</SelectItem>
                <SelectItem key="100" >100</SelectItem>
              </Select>
            </div>
            
            <Pagination
              total={totalPages}
              page={page}
              onChange={handlePageChange}
              showControls
              size="sm"
              className="text-foreground"
              classNames={{
                cursor: "bg-primary text-white",
                item: "text-foreground-600 bg-white/10 hover:bg-white/20",
                next: "bg-white/10 text-foreground-600 hover:bg-white/20",
                prev: "bg-white/10 text-foreground-600 hover:bg-white/20"
              }}
            />
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
