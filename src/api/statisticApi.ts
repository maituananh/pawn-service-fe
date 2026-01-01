import { StatisticResponse } from "@/type/statistic.type";
import axiosClient from "./axiosClient";

const statisticApi = {
  async getStatistics(): Promise<StatisticResponse> {
    const { data } = await axiosClient.get<StatisticResponse>(
      "/dashboard/statistic"
    );

    return data;
  },
};

export default statisticApi;
