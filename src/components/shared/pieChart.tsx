import React from "react";
import ReactECharts from "echarts-for-react";

const PieChart: React.FC = () => {
  const option = {
    title: {
      text: "Analytics",
      left: "left",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      bottom: "2%",
      left: "center",
    },
    toolbox: {
      show: true,
      feature: {
        dataView: {
          show: true,
          readOnly: true,
          icon: "path://M13.4926 1.01257C12.8253 0.329152 11.7435 0.329152 11.0762 1.01257C10.409 1.69598 10.409 2.80402 11.0762 3.48744C11.7435 4.17085 12.8253 4.17085 13.4926 3.48744C14.1599 2.80405 14.1599 1.69601 13.4926 1.01257Z M8.36662 1.01257C7.69937 0.329152 6.61752 0.329152 5.95027 1.01257C5.28301 1.69598 5.28301 2.80402 5.95027 3.48744C6.61752 4.17085 7.69937 4.17085 8.36662 3.48744C9.03388 2.80405 9.03388 1.69601 8.36662 1.01257Z M3.24077 1.01257C2.57351 0.329152 1.49167 0.329152 0.82441 1.01257C0.157153 1.69598 0.157153 2.80402 0.82441 3.48744C1.49167 4.17085 2.57351 4.17085 3.24077 3.48744C3.90803 2.80405 3.90803 1.69601 3.24077 1.01257Z",
        },
        // saveAsImage: { show: true }
      },
    },
    color: ["#5B93FF", "#FFD66B", "#FF8F6B"],
    series: [
      {
        name: "Transactions",
        type: "pie",
        radius: ["40%", "60%"],
        padAngle: -20,
        itemStyle: {
          borderRadius: 50,
        },
        data: [
          { value: 60, name: "Sale" },
          { value: 40, name: "Distribute" },
          { value: 40, name: "Return" },
        ],
        labelLine: {
          show: false,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
          label: {
            show: true,
            fontSize: 18,
            fontWeight: "bold",
          },
        },
      },
    ],
  };

  return (
    <ReactECharts option={option} style={{ height: "350px", width: "100%" }} />
  );
};

export default PieChart;
