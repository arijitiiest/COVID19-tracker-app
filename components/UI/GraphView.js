import React from "react";
import { Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

import Colors from "../../constants/Colors";

const GraphView = (props) => {
  return (
      <LineChart
        data={props.chartData}
        width={Dimensions.get("window").width - 30}
        height={180}
        chartConfig={{
          backgroundColor: Colors.backgroundColor,
          backgroundGradientFrom: Colors.backgroundColor,
          backgroundGradientTo: Colors.backgroundColor,
          fillShadowGradient: Colors.backgroundColor,
          fillShadowGradientOpacity: 0.5,
          decimalPlaces: 0, // optional, defaults to 2dp
          color: () => Colors.textColor,
          strokeWidth: 10,
          style: {
            borderRadius: 25,
          },
        }}
        style={{
          borderRadius: 10,
        }}
        segments={5}
        fromZero={true}
      />
  );
};

export default GraphView;
