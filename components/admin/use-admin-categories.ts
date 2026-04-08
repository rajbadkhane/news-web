"use client";

import { useEffect, useState } from "react";
import { getList } from "@/lib/admin-api";

export type AdminCategory = {
  id: number;
  name: string;
  nameHi?: string;
};

export function useAdminCategories() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getList<AdminCategory>("/categories");
        setCategories(data);
      } catch {
        setCategories([]);
      }
    }

    void load();
  }, []);

  return categories;
}
