import { LinearGradient, useFont, vec } from "@shopify/react-native-skia";
import React from "react";
import { View } from "react-native";
import tw from "twrnc";
import { CartesianChart, Bar } from "victory-native";

type Props = {
  data: { label: string; value: number }[];
};

export const Chart: React.FC<Props> = (props: Props) => {
  console.log("data", props.data);
  return (
    <CartesianChart
      data={props.data}
      xKey="label"
      yKeys={["value"]}
      domainPadding={{ left: 60, right: 20, top: 30 }}
      axisOptions={{
        font: useFont(require("../../assets/fonts/SpaceMono-Regular.ttf"), 12),
        tickValues: {
          x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          // y: [0, 1, 2, 3, 4, 5],
          y: Array.from(new Set(props.data.map((item) => item.value))),
        },
      }}
    >
      {({ points, chartBounds }) => (
        <Bar
          chartBounds={chartBounds}
          points={points.value}
          roundedCorners={{
            topLeft: 5,
            topRight: 5,
          }}
          innerPadding={0.4}
        >
          <LinearGradient
            start={vec(0, 0)}
            end={vec(0, 400)}
            colors={["#a78bfa", "#a78bfa50"]}
          />
        </Bar>
      )}
    </CartesianChart>
  );
};
