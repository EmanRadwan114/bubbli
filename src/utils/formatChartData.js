export const formatChartData = (metric, data) => {
  if (!data) return [];

  switch (metric) {
    case "top-ordered":
      return (
        data.topProducts?.map((item) => ({
          name: item.title,
          value: item.orderCount,
        })) || []
      );

    case "least-ordered":
      return (
        data.leastProducts?.map((item) => ({
          name: item.title,
          value: item.orderCount,
        })) || []
      );

    case "monthly":
      return (
        data.monthlyStats?.map((item) => ({
          name: `Month ${item.month}`,
          value: item.count,
        })) || []
      );

    case "revenue":
      return (
        data.revenueStats?.map((item) => ({
          name: `Month ${item.month}`,
          value: item.revenue,
        })) || []
      );

    case "total":
      return [
        {
          name: "Total Orders",
          value: data.totalOrders || 0,
        },
      ];

    default:
      return [];
  }
};
