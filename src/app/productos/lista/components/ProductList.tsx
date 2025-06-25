"use client";

import React, { useMemo, useCallback } from "react";
import { Product } from "@/types/product";
import useProductList from "@/app/productos/lista/hooks/useProductList";
import {
  SearchIcon,
  ChevronDownIcon,
  DeleteIcon
} from "@/lib/icons/ui";
import ConfirmationPopUp from "@/components/popUps";
import ModalEditProduct from "./ModalEditProduct";
import ModalAddProduct from "./ModalAddProduct";
import glassStyles from "@/app/styles/glassStyles.module.css";

// Using HeroUI components
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
  Spinner,
} from "@heroui/react";

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
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
    setFilterValue,
    statusColorMap,
    handleDeleteProduct,
    isLoadingDelete
  } = useProductList();

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
            <div className="flex flex-col">
              <Chip
                className="capitalize border-none gap-1"
                color={stockStatus}
                size="sm"
                variant="flat"
              >
                {product.current_stock}
              </Chip>
            </div>
          );
        case "status":
          const status = product.is_active ? "active" : "inactive";
          const statusText = product.is_active ? "Activo" : "Inactivo";
          return (
            <Chip
              className="capitalize border-none gap-1 text-default-600"
              color={statusColorMap[status]}
              size="sm"
              variant="dot"
            >
              {statusText}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <ModalEditProduct refreshProducts={refreshProducts} product={product} />
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

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder="Buscar por código o nombre..."
            size="sm"
            startContent={<SearchIcon className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Estado
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Filtro de Estado"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {status.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Columnas
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Columnas de la Tabla"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <ModalAddProduct refreshProducts={refreshProducts} />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {totalData} productos
          </span>
        </div>
      </div>
    );
  }, [filterValue, statusFilter, visibleColumns, onSearchChange, totalData, columns, refreshProducts, setFilterValue, setStatusFilter, setVisibleColumns, statusOptions]);

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
      <div className={`${glassStyles.glassCard} rounded-xl p-6`}>
        <Table
          isCompact
          removeWrapper
          aria-label="Tabla de productos con celdas personalizadas, paginación y ordenamiento"
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          classNames={classNames}
          selectionMode="none"
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
                allowsSorting={column.sortable}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent={"No se encontraron productos"}
            items={sortedItems}
          >
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
