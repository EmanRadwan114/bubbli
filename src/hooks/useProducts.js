import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addProduct, deleteProduct, getAllProductsBack,
  getBestSellingProducts,
  getFeaturedProducts,
  getLeastOrderedProducts,
  getProductByCategory,
  getProductById, updateProduct,
  searchProducts,
} from "../services/productsService";

export const getProductByCategoryName = (categoryName, page = 1, limit = 6) =>
  useQuery({
    queryKey: ["productsByCategory", categoryName, page, limit],
    queryFn: () => getProductByCategory(categoryName, page, limit),
    enabled: !!categoryName,
    keepPreviousData: true,
  });
export const getAllProducts = (page = 1, limit = 6) => {
  return useQuery({
    queryKey: ["products", page, limit],
    queryFn: () => getAllProductsBack(page, limit),
    keepPreviousData: true,
  });
};
export const useFeaturedProducts = (label = "bestseller") => {
  return useQuery({
    queryKey: ["featured-products", label],
    queryFn: () => getFeaturedProducts(label),
    keepPreviousData: true,
  });
};

export const useGetProductById = (id) => {
  console.log("useGetProductById called with id:", id);

  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      console.log("QueryFn executing for product ID:", id);
      const data = await getProductById(id);
      console.log("QueryFn completed with data:", data);
      return data;
    },
    onError: (error) => {
      console.error("Query error:", error);
    },
    onSettled: (data, error) => {
      console.log("Query settled:", { data, error });
    },
  });
};


// Add product
export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
    onError: (err) => {
      console.error("Product creation failed:", err);
      throw err;
    },
  });
};

// DELETE PRODUCT
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });
};

// UPDATE PRODUCT
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });
};

// Get Best Slling Products
export const useBestSellingProducts = (page = 1, limit = 6) => {
  return useQuery({
    queryKey: ["best-selling-products", page, limit],
    queryFn: () => getBestSellingProducts(page, limit),
    keepPreviousData: true,
    select: (res) => res.data,
  });
};
// Get Least Ordered Products
export const useLeastOrderedProducts = (page = 1, limit = 6) => {
  return useQuery({
    queryKey: ["least-ordered-products", page, limit],
    queryFn: () => getLeastOrderedProducts(page, limit),
    keepPreviousData: true,
    select: (res) => res.data,
  });
};


