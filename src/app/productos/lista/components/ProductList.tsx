"use client";

import React, { useMemo, useCallback } from "react";
import { Product } from "@/types/product";
import useProductList from "@/app/productos/lista/hooks/useProductList";
import { DeleteIcon } from "@/lib/icons/ui";
import ConfirmationPopUp from "@/components/popUps";
import ModalEditProduct from "./ModalEditProduct";
import ModalAddProduct from "./ModalAddProduct";
import ModalAddStockProduct from "./ModalAddStockProduct";
import ResponsiveProductTable from "./ResponsiveProductTable";
import glassStyles from "@/app/styles/glassStyles.module.css";

// Using HeroUI components
import {
  Chip,
  Pagination,
  Spinner,
} from "@heroui/react";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount);
}

export default function ProductList() {
  const {
    loading,
    page,
    pages,
    setPageOnChange,
    totalData,
    refreshProducts,
    filterValue,
    onSearchChange,
    sortedItems,
    classNames,
    headerColumns,
    visibleColumns,
    setVisibleColumns,
    statusFilter,
    setStatusFilter,
    sortDescriptor,
    setSortDescriptor,
    columns,
    statusOptions,
    filteredItems,

    statusColorMap,
    handleDeleteProduct,
    isLoadingDelete
  } = useProductList();

  // Función para limpiar filtros
  const handleClearFilters = useCallback(() => {
    onSearchChange("");
    setStatusFilter("all");
  }, [onSearchChange, setStatusFilter]);

  const renderCell = useCallback(
    (product: Product, columnKey: React.Key) => {
      switch (columnKey) {
        case "code":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small">{product.code}</p>
            </div>
          );
        case "name":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small">{product.name}</p>
            </div>
          );
        case "description":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small line-clamp-2">{product.description || "Sin descripción"}</p>
            </div>
          );
        case "sale_price":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small">{formatCurrency(product.sale_price)}</p>
            </div>
          );
        case "current_stock":
          const stockStatus = product.current_stock <= product.min_stock ? "danger" : "success";
          return (
            <Chip className="capitalize" color={stockStatus} size="sm" variant="flat">
              {product.current_stock}
            </Chip>
          );
        case "status":
          return (
            <Chip className="capitalize" color={statusColorMap[product.is_active ? "active" : "inactive"]} size="sm" variant="flat">
              {product.is_active ? "Activo" : "Inactivo"}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <ModalEditProduct refreshProducts={refreshProducts} product={product} />
              <ModalAddStockProduct refreshProducts={refreshProducts} product={product} />
              <ConfirmationPopUp
                icon={<DeleteIcon />}
                tooltipContent="Eliminar Producto"
                title="¿Eliminar Producto?"
                message="El producto se eliminará permanentemente"
                onConfirm={() => handleDeleteProduct(product.id || 0)}
                isLoading={isLoadingDelete}
                color="danger"
              />
            </div>
          );
        default:
          const value = product[columnKey as keyof Product];
          // Convert Date objects to strings to make them compatible with ReactNode
          if (value instanceof Date) {
            return value.toLocaleString();
          }
          return value;
      }
    },
    [refreshProducts, statusColorMap, handleDeleteProduct, isLoadingDelete]
  );



  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          color="default"
          page={page}
          total={pages}
          variant="light"
          onChange={setPageOnChange}
        />
        <span className="text-small text-default-400">
          {filteredItems.length} productos encontrados
        </span>
      </div>
    );
  }, [page, pages, setPageOnChange, filteredItems.length]);

  if (loading) {
    return (
      <div className={`${glassStyles.glassCard} rounded-xl p-6`}>
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`${glassStyles.glassCard} rounded-xl p-4 lg:p-6`}>
        {/* Tabla Responsive con filtros integrados */}
        <ResponsiveProductTable
          products={sortedItems}
          headerColumns={headerColumns}
          renderCell={renderCell}
          classNames={classNames}
          sortDescriptor={sortDescriptor}
          setSortDescriptor={setSortDescriptor}
          statusColorMap={statusColorMap}
          filterValue={filterValue}
          onSearchChange={onSearchChange}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          statusOptions={statusOptions}
          columns={columns}
          totalData={totalData}
          onClearFilters={handleClearFilters}
          addProductComponent={<ModalAddProduct refreshProducts={refreshProducts} />}
        />

        {/* Paginación */}
        <div className="mt-6">
          {bottomContent}
        </div>
      </div>
    </>
  );
}
