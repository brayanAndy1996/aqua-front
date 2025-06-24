/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react'
import usePagination from '@/hooks/usePagination'

interface DataTableResult<T> {
  data: T[];
  isLoading: boolean;
  page: number;
  pages: number;
  setPageOnChange: (page: number) => void;
  rowsPerPage: number;
  reload: () => void;
  handleSetData: (datos: []) => void;
  handleSetTotal: (numero: number) => void;
  handlesetIsLoading: (estate: boolean) => void;
  handleSelectionChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const useTableGeneral = (props: { requestData?: any, data?: any, getRows?: any, selectionMode?: any }): DataTableResult<any> => {
  const [data, setData] = useState([])
  const [totalAllData, setTotalAllData] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const { page, pages, setPageOnChange, handleSelectionChange, rowsPerPage } = usePagination({ totalAllData })
  const [trigger, setTrigger] = useState(false)

  const reload = (): void => {
    setTrigger(oldTrigger => !oldTrigger)
  }

  const fetchData = useCallback(async () => {
    if (props.requestData) {
      props.requestData({
        setData,
        setTotalAllData,
        setIsLoading,
        page,
        limit: rowsPerPage
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, trigger])

 

  const handleSetData = (datos: []): void => {
    setData(datos)
  }

  const handleSetTotal = (numero: number): void => {
    setTotalAllData(numero)
  }

  const handlesetIsLoading = (estate: boolean): void => {
    setIsLoading(estate)
  }

  useEffect(() => {
    if (props.data) setData(props.data)
  }, [props.data])

  useEffect(() => {
    fetchData().catch((error) => {
      console.error(error)
    })
  }, [fetchData])


  return {
    isLoading,
    page,
    pages,
    setPageOnChange,
    rowsPerPage,
    reload,
    handleSetData,
    handleSetTotal,
    handlesetIsLoading,
    data,
    handleSelectionChange
  }
}

export default useTableGeneral