import { useQuery } from "@tanstack/react-query";
import { getProductByCategory } from "../services/productsService";

export const getProductByCategoryName = (categoryName, page = 1, limit = 6) =>
  useQuery({
    queryKey: ["productsByCategory", categoryName, page, limit],
    queryFn: () => getProductByCategory(categoryName, page, limit),
    enabled: !!categoryName,
    keepPreviousData: true,
  });
