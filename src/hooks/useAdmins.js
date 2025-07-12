// hooks/useAdmins.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as adminService from "../services/adminService";

export const useGetAdmins = (page = 1, limit = 6) =>
  useQuery({
    queryKey: ["admins", page, limit],
    queryFn: () => adminService.getAdmins(page, limit),
  });

export const useGetAdminById = (id) =>
  useQuery({
    queryKey: ["admin", id],
    queryFn: () => adminService.getAdminById(id),
    enabled: !!id,
    select: (res) => res.data,
  });

export const useAddAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.addAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries(["admins"]);
    },
  });
};

export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.deleteAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries(["admins"]);
    },
  });
};
