import { Product } from "@/types/product";
import { SaleItems } from "@/types/saleItems";
import { PurchaseInterface } from "@/types/purchase";
import dayjs from "dayjs";

export const formDataDaily = (sales: SaleItems[] | PurchaseInterface[]) => {
    const dailySalesData = sales.reduce((acc: {time: string, value: number}[], sale: SaleItems | PurchaseInterface) => {
        const date = dayjs(sale.createdAt).format('YYYY-MM-DD')
        const isSomeEqualDate = acc.some((item: {time: string, value: number}) => item.time === date);
        if(!isSomeEqualDate) acc.push({time: date, value: sale.quantity});
        else{
            const index = acc.findIndex((item: {time: string, value: number}) => item.time === date);
            acc[index].value += sale.quantity;
        }
        return acc;
    }, []);
    return dailySalesData.sort((a, b) => dayjs(a.time).diff(dayjs(b.time)));
}

export const formDataMonthly = (sales: SaleItems[] | PurchaseInterface[]) => {
    const monthlySalesData = sales.reduce((acc: {time: string, value: number}[], sale: SaleItems | PurchaseInterface) => {
        const month = dayjs(sale.createdAt).format('YYYY-MM')
        const isSomeEqualDate = acc.some((item: {time: string, value: number}) => item.time === month);
        if(!isSomeEqualDate) acc.push({time: month, value: sale.quantity});
        else{
            const index = acc.findIndex((item: {time: string, value: number}) => item.time === month);
            acc[index].value += sale.quantity;
        }
        return acc;
    }, []);
    return monthlySalesData.sort((a, b) => dayjs(a.time).diff(dayjs(b.time)));
}

export const salesAgrupTo = (sales: (SaleItems[] | PurchaseInterface[])) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const salesFormProduct = sales.reduce((acc: any[], sale: SaleItems | PurchaseInterface | any) => {
          const product: Product = sale.product || {};
          const isSomeEqualProduct = acc.some((item: {product_id: number}) => item.product_id === sale.product_id);
          if(!isSomeEqualProduct){
            acc.push({
              product_id: sale.product_id,
              product_name: product.name,
              product_code: product.code,
              quantity: sale.quantity,
              sale_price: sale.sale_price
            });
          }else{
            const index = acc.findIndex((item: {product_id: number}) => item.product_id === sale.product_id);
            acc[index].quantity += sale.quantity;
          }
          return acc; 
        }, [])
      return salesFormProduct;
}

// export const salesAgrupToProductPurchase = (sales: PurchaseInterface[]) => {
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         const salesFormProduct = sales.reduce((acc: any[], sale: PurchaseInterface | any) => {
//           const product: Product = sale.product || {};
//           const isSomeEqualProduct = acc.some((item: {product_id: number}) => item.product_id === sale.product_id);
//           if(!isSomeEqualProduct){
//             acc.push({
//               product_id: sale.product_id,
//               product_name: product.name,
//               product_code: product.code,
//               quantity: sale.quantity,
//               sale_price: sale.sale_price
//             });
//           }else{
//             const index = acc.findIndex((item: {product_id: number}) => item.product_id === sale.product_id);
//             acc[index].quantity += sale.quantity;
//           }
//           return acc; 
//         }, [])
//         return salesFormProduct;
//   }


