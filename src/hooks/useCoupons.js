import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as couponService from "../services/couponService";

// GET all coupons
export const useGetCoupons = (page = 1, limit = 6) =>
  useQuery({
    queryKey: ["coupons", page, limit],
    queryFn: () => couponService.getAllCoupons(page, limit),
  });

// GET single coupon by ID
export const useGetCouponById = (id) =>
  useQuery({
    queryKey: ["coupon", id],
    queryFn: () => couponService.getCouponById(id),
    enabled: !!id,
    select: (res) => res.data,
  });

// POST new coupon
export const useAddCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: couponService.addCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries(["coupons"]);
    },
  });
};

// PUT update coupon
export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => couponService.updateCoupon(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["coupons"]);
    },
  });
};

// DELETE coupon
export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: couponService.deleteCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries(["coupons"]);
    },
  });
};

// APPLY coupon
export const useApplyCoupon = () =>
  useMutation({
    mutationFn: couponService.applyCoupon,
  });
