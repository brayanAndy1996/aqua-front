export const deleteAllNullValues = (obj: { [key: string]: string | number | boolean | null | undefined }): { [key: string]: string | number | boolean } => {
    Object.keys(obj).forEach((key) => {
        if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
            delete obj[key];
        }
    });
    return obj as { [key: string]: string | number | boolean };
};


export const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(price);
};