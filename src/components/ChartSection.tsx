"use client";

import React, { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement,
  ChartData,
  TooltipItem,
  ChartOptions
} from "chart.js";

// Register components for ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ArcElement);

// Dynamically import the chart components (SSR disabled)
const Pie = dynamic(() => import("react-chartjs-2").then((mod) => mod.Pie), {
  ssr: false,
});
const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), {
  ssr: false,
});

interface MealPieChart {
  meal: string;
  data: ChartData<"pie", number[], string>;
}

interface ChartsSectionProps {
  macroPieData: ChartData<"pie", number[], string>;
  progressData: ChartData<"bar", number[], string>;
  mealPieCharts: MealPieChart[];
}

export default function ChartsSection({
  macroPieData,
  progressData,
  mealPieCharts,
}: ChartsSectionProps) {
  // Detect dark mode by monitoring <html> class changes
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const htmlClassList = document.documentElement.classList;
    setIsDark(htmlClassList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const tickColor = isDark ? "#F3F4F6" : "#1F2937";
  const fontFamily = "system-ui, sans-serif";

  // Define barOptions with the proper ChartOptions type.
  const barOptions = useMemo<ChartOptions<"bar">>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        labels: {
          color: tickColor,
          font: { family: fontFamily },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"bar">) =>
            `${context.dataset.label}: ${context.parsed.y.toFixed(2)}%`,
        },
        bodyFont: { family: fontFamily, size: 12, color: tickColor },
      },
    },
    scales: {
      y: {
        type: "linear",
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function (
            tickValue: string | number
          ): string {
            return `${tickValue}%`;
          },
          color: tickColor,
          font: { family: fontFamily },
        },
        grid: {
          color: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
      },
      x: {
        type: "category",
        ticks: {
          color: tickColor,
          font: { family: fontFamily },
        },
        grid: {
          color: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  }), [isDark, tickColor, fontFamily]);

  const pieOptions = useMemo(
    () => ({
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: tickColor,
            font: { family: fontFamily },
          },
        },
      },
    }),
    [tickColor, fontFamily]
  );

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-6 dark:text-gray-100">
        Charts
      </h2>
      <div className="flex flex-col lg:flex-row gap-8 mb-16">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex-1">
          <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">
            Daily Macro Distribution (per 100g)
          </h3>
          <div className="w-full h-64 lg:h-80">
            <Pie data={macroPieData} options={pieOptions} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex-1">
          <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">
            RDA Progress (%)
          </h3>
          <div className="w-full h-64 lg:h-80">
            <Bar data={progressData} options={barOptions} />
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-semibold mb-6 dark:text-gray-100">
        Meal-wise Distribution
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {mealPieCharts.map(({ meal, data }, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4 dark:text-gray-100 capitalize">
              {meal} Macros (per 100g)
            </h3>
            <div className="w-full h-64">
              <Pie data={data} options={pieOptions} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
