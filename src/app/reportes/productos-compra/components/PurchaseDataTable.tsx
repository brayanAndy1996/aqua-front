"use client";

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Pagination,
  Select,
  SelectItem,
  Chip,
  Button,
  Tooltip
} from '@heroui/react';
import { PurchaseInterface } from '@/types/purchase';
import { FileText, FileSpreadsheet } from 'lucide-react';
import { exportToPDF, exportToExcel } from '@/lib/utils/export';
import dayjs from 'dayjs';

interface PurchaseDataTableProps {
  purchaseData: PurchaseInterface[];
  loading: boolean;
  title: string;
}

export default function PurchaseDataTable({ purchaseData, loading, title }: PurchaseDataTableProps) {
  // Estado para la paginación
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  // Configuración de columnas
  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'product_name', label: 'Producto', sortable: true },
    { key: 'quantity', label: 'Cantidad', sortable: true },
    { key: 'purchase_price', label: 'Precio Unitario', sortable: true },
    { key: 'total', label: 'Total', sortable: true },
    { key: 'user_name', label: 'Usuario', sortable: true },
    { key: 'notes', label: 'Notas', sortable: false },
  ];

  // Procesar datos para la tabla
  const processedData = useMemo(() => {
    return purchaseData.map((item, index) => ({
      id: item.id || index + 1,
      product_name: item.product?.name,
      quantity: item.quantity,
      purchase_price: item.purchase_price,
      total: item.purchase_price * item.quantity,
      user_name: item.user_name || 'N/A',
      notes: item.notes || 'Sin notas',
      raw: item // Mantener datos originales para exportación
    }));
  }, [purchaseData]);

  // Función para formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Función para exportar a PDF
  const handleExportPDF = async () => {
    try {
      const exportData = processedData.map(item => ({
        'ID': item.id,
        'Producto': item.product_name ?? 'N/A',
        'Cantidad': item.quantity,
        'Precio Unitario': formatCurrency(item.purchase_price),
        'Total': formatCurrency(item.total),
        'Usuario': item.user_name,
        'Notas': item.notes
      }));

      await exportToPDF(exportData, `reporte-compras-${dayjs().format('YYYY-MM-DD')}`);
    } catch (error) {
      console.error('Error al exportar PDF:', error);
    }
  };

  // Función para exportar a Excel
  const handleExportExcel = async () => {
    try {
      const exportData = processedData.map(item => ({
        'ID': item.id,
        'Producto': item.product_name || 'N/A',
        'Cantidad': item.quantity,
        'Precio Unitario': item.purchase_price,
        'Total': item.total,
        'Usuario': item.user_name,
        'Notas': item.notes
      }));

      await exportToExcel(exportData, `reporte-compras-${dayjs().format('YYYY-MM-DD')}`);
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
      case 'purchase_price':
        return (
          <span className="font-mono text-success">
            {formatCurrency(item.purchase_price)}
          </span>
        );
      case 'total':
        return (
          <span className="font-mono font-semibold text-success">
            {formatCurrency(item.total)}
          </span>
        );
      case 'user_name':
        return (
          <span className="text-foreground-500 font-mono">
            {item.user_name}
          </span>
        );
      case 'notes':
        return (
          <span className="text-foreground-500 text-sm">
            {item.notes}
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
      <Card className="w-full bg-white/70 backdrop-blur-md border-0 shadow-lg">
        <CardBody className="flex items-center justify-center py-12">
          <Spinner size="lg" color="primary" />
          <p className="mt-4 text-foreground-500">Cargando datos de compras...</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white/70 backdrop-blur-md border-0 shadow-lg">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center w-full">
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
            <div className="flex items-center gap-2">
              <Tooltip content="Exportar a Excel">
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  color="success"
                  onPress={handleExportExcel}
                >
                  <FileSpreadsheet className="h-4 w-4" />
                </Button>
              </Tooltip>
              <Tooltip content="Exportar a PDF">
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  color="danger"
                  onPress={handleExportPDF}
                >
                  <FileText className="h-4 w-4" />
                </Button>
              </Tooltip>
              <div className="text-sm text-gray-600 ml-2">
                Total: {purchaseData.length} compras
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody className="px-0 py-0">
          {/* Vista Desktop - Tabla */}
          <div className="hidden lg:block">
            <Table 
              aria-label="Tabla de compras"
              className="min-h-[400px]"
              classNames={{
                wrapper: "bg-transparent shadow-none",
                th: "bg-gray-50/80 text-gray-700 font-semibold",
                td: "text-gray-600",
              }}
            >
              <TableHeader>
                {columns.map(column => (
                  <TableColumn key={column.key}>{column.label}</TableColumn>
                ))}
              </TableHeader>
              <TableBody 
                emptyContent={
                  <div className="flex flex-col items-center justify-center py-12">
                    <FileText size={48} className="text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">
                      No hay datos de compras disponibles
                    </p>
                    <p className="text-gray-400 text-sm">
                      Ajusta los filtros para ver más resultados
                    </p>
                  </div>
                }
              >
                {paginatedData.map((item) => (
                  <TableRow key={item.id}>
                    {columns.map(column => (
                      <TableCell key={`${item.id}-${column.key}`}>
                        {renderCell(item, column.key)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Vista Móvil - Cards */}
          <div className="block lg:hidden p-4">
            {paginatedData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <FileText size={48} className="text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">
                  No hay datos de compras disponibles
                </p>
                <p className="text-gray-400 text-sm">
                  Ajusta los filtros para ver más resultados
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedData.map((item) => (
                  <Card key={item.id} className="w-full bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm">
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
                          <p className="font-medium text-gray-800 text-sm">
                            {item.product_name}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Precio Unitario:</span>
                          <span className="text-sm font-mono text-success">
                            {formatCurrency(item.purchase_price)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Total:</span>
                          <span className="text-sm font-mono font-semibold text-success">
                            {formatCurrency(item.total)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Usuario:</span>
                          <span className="text-sm font-mono text-gray-600">
                            {item.user_name}
                          </span>
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-gray-500">Notas:</span>
                          <span className="text-sm text-gray-600 bg-gray-50 p-2 rounded text-left">
                            {item.notes}
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
          {totalPages > 0 && (
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 px-4 py-2 bg-gray-50/50">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">Filas por página:</span>
                <Select
                  aria-label="Filas por página"
                  className="bg-transparent outline-none text-gray-500 text-sm w-20"
                  size="sm"
                  selectedKeys={[rowsPerPage.toString()]}
                  onChange={handleRowsPerPageChange}
                >
                  <SelectItem key="5">5</SelectItem>
                  <SelectItem key="10">10</SelectItem>
                  <SelectItem key="25">25</SelectItem>
                  <SelectItem key="50">50</SelectItem>
                  <SelectItem key="100">100</SelectItem>
                </Select>
              </div>
              
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={totalPages}
                onChange={handlePageChange}
              />
              
              <div className="hidden lg:flex justify-end">
                <span className="text-gray-500 text-sm">
                  {`${(page - 1) * rowsPerPage + 1}-${Math.min(page * rowsPerPage, processedData.length)} de ${processedData.length}`}
                </span>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </motion.div>
  );
}
