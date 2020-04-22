import React from "react";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const chartConfig = {
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  // barPercentage: 0.5,
};

const PieChartView = (props) => {
  return (
    <PieChart
      data={props.pieData}
      width={Dimensions.get("screen").width - 20}
      height={220}
      chartConfig={chartConfig}
      accessor="population"
      backgroundColor="transparent"
      paddingLeft="3"
      absolute
    />
  );
};

export default PieChartView;
