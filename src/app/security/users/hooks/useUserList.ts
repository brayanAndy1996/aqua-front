import { useState, useMemo, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import type {
  ChipProps,
  Selection, SortDescriptor
} from "@heroui/react";
import { userApi } from '@/apis/user.api';
import usePagination from '@/hooks/usePagination';
import { User } from '@/types/user';
import useSWR from 'swr';
import { deleteAllNullValues } from '@/lib/utils/functions';
import { transformStatusFilter } from '@/lib/utils/user';
import { showSuccessToast } from '@/components/toastUtils';
import { handleErrors } from '@/lib/utils/errors';


const INITIAL_VISIBLE_COLUMNS = ["name", "email", "nombre_completo", "roles", "status", "actions"];
const columns = [
  { name: "NOMBRE", uid: "name", sortable: true },
  { name: "EMAIL", uid: "email", sortable: true },
  { name: "USUARIO", uid: "nombre_completo", sortable: true },
  { name: "ROLES", uid: "roles", sortable: false },
  { name: "ESTADO", uid: "status", sortable: true },
  { name: "ACCIONES", uid: "actions" },
];

const statusOptions = [
  { name: "Activo", uid: "active" },
  { name: "Inactivo", uid: "inactive" },
];


const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  inactive: "danger",
};

export default function useUserList() {
  const { data: session, status } = useSession();
  const [totalData, setTotalData] = useState(0);
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [isLoadingDelete, setIsLoadingDelete] = useState(false)
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });
  const { page, pages, setPageOnChange, rowsPerPage } = usePagination({ totalAllData: totalData });

  // Create a unique key for this data request that includes filter values
  const key = useMemo(() => {
    if (status !== 'authenticated' || !session?.user?.accessToken) return null;
    
    // Include all dependencies in the key to trigger revalidation when any of them change
    const statusFilterValue = transformStatusFilter(statusFilter);
    const searchValue = filterValue.trim();
    
    return [
      `users-${page}-${rowsPerPage}-${searchValue}-${statusFilterValue}`,
      session.user.accessToken,
      page,
      rowsPerPage,
      searchValue,
      statusFilterValue
    ];
  }, [status, session, page, rowsPerPage, statusFilter, filterValue]);

  // Use SWR for data fetching with caching
  const { data, error, isLoading, mutate } = useSWR(
    key,
    async ([, token, page, rowsPerPage, searchValue, statusFilterValue]: [string, string, number, number, string, boolean | undefined]) => {
      const data = await userApi.getUsersWithPagination(
        token,
        page,
        rowsPerPage,
        deleteAllNullValues({ is_active: statusFilterValue, nombre: searchValue })
      );
      setTotalData(data.count || 0);
      return data.data;
    },
    {
      revalidateOnFocus: false, // Prevents refetch when tab gains focus
      revalidateOnMount: true,   // Fetch when component mounts
      dedupingInterval: 10000,   // Deduplicate requests within 10 seconds
      keepPreviousData: true,    // Keep previous data while fetching new data
    }
  );

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    return [...data || []];
  }, [data]);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
    setPageOnChange(1);
  }, [setPageOnChange]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a: User, b: User) => {
      let first: string | boolean, second: string | boolean;

      switch (sortDescriptor.column) {
        case "name":
          first = a.nombre || "";
          second = b.nombre || "";
          break;
        case "email":
          first = a.email || "";
          second = b.email || "";
          break;
        case "nombre_completo":
          first = a.nombre_completo || "";
          second = b.nombre_completo || "";
          break;
        case "status":
          first = a.is_active ? "active" : "inactive";
          second = b.is_active ? "active" : "inactive";
          break;
        default:
          first = a[sortDescriptor.column as keyof User] as string;
          second = b[sortDescriptor.column as keyof User] as string;
      }

      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const classNames = useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-full"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: [
        "group-data-[first=true]/tr:first:before:rounded-none",
        "group-data-[first=true]/tr:last:before:rounded-none",
        "group-data-[middle=true]/tr:before:rounded-none",
        "group-data-[last=true]/tr:first:before:rounded-none",
        "group-data-[last=true]/tr:last:before:rounded-none",
      ],
    }),
    [],
  );

  const handleDeleteUser = useCallback(async (userId: number) => {
    setIsLoadingDelete(true);
    try {
      await userApi.deleteUser(session?.user?.accessToken || '', userId);
      showSuccessToast('Usuario eliminado', 'El usuario ha sido eliminado correctamente');
      mutate();
    } catch (error: unknown) {
      handleErrors(error);
    } finally {
      setIsLoadingDelete(false);
    }
  }, [session, mutate]);

  return {
    users: data || [],
    loading: isLoading,
    error,
    page,
    pages,
    setPageOnChange,
    rowsPerPage,
    totalData,
    refreshUsers: mutate,
    visibleColumns,
    setVisibleColumns,
    headerColumns,
    columns,
    statusOptions,
    onSearchChange,
    filteredItems,
    setFilterValue,
    statusFilter,
    setStatusFilter,
    sortDescriptor,
    setSortDescriptor,
    sortedItems,
    classNames,
    filterValue,
    statusColorMap,
    isLoadingDelete,
    handleDeleteUser
  };
}
