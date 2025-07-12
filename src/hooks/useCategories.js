"use client";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { addCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from "../services/categoriesService";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });
};
export const useGetCategoryById = (id, enabled = true) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryById(id),
    enabled: !!id && enabled,
  });
};

export const useAddCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updatedCat }) => updateCategory(id, updatedCat),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
    },
  });
};

// ^ Delete Category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
    },
  });
};
