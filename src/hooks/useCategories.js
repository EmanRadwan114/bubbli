"use client";
import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "../services/categoriesService";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });
};
