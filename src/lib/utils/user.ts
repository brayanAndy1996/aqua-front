import type { Selection } from "@heroui/react";

export const transformStatusFilter = (statusFilter: Selection) => {
    if (statusFilter === "all") return null
    return Array.from(statusFilter).includes("active") ? true : false;
};