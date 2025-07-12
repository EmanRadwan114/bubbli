let interceptorId = null;

export const setupAxiosInterceptors = (api, logout, navigate, toast) => {
  // Remove previous to avoid stacking
  if (interceptorId !== null) {
    api.interceptors.response.eject(interceptorId);
  }

  interceptorId = api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        const errorMessage = error.response.data?.message?.toLowerCase() || "";

        // 👇 Only handle if token expired
        if (errorMessage.includes("expired")) {
          console.warn("[Interceptor] 401 Token Expired");

          logout();
          toast.error("Session expired. Please log in again.");
          navigate("/login");
        }
      }

      // Always reject so caller sees error
      return Promise.reject(error);
    }
  );
};
