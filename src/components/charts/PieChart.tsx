import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { colorsToGraphDoughnut } from '@/lib/constants/colors';

interface DataItem {
  label: string;
  value: number;
  color?: string;
}

interface PieChartProps {
  data: DataItem[];
  colors?: string[];
  title?: string;
  height?: number;
  width?: number;
  showLegend?: boolean;
  legendPosition?: 'top' | 'bottom' | 'left' | 'right';
  cutout?: string | number;
  borderWidth?: number;
  borderColor?: string;
  hoverOffset?: number;
  animation?: boolean;
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  colors,
  title = '',
  showLegend = true,
  legendPosition = 'right',
  cutout = 0, // 0 para pie chart, un valor como '50%' para doughnut
  borderWidth = 1,
  borderColor = '#fff',
  hoverOffset = 10,
  animation = true,
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    // Destruir el gráfico anterior si existe
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Preparar los datos para Chart.js
    const chartData = {
      labels: data.map(item => item.label),
      datasets: [
        {
          data: data.map(item => item.value),
          backgroundColor: data.map(item => item.color || colorsToGraphDoughnut[0]),
          borderColor: borderColor,
          borderWidth: borderWidth,
          hoverOffset: hoverOffset,
        },
      ],
    };

    // Configuración del gráfico
    chartInstance.current = new Chart(ctx, {
      type: cutout ? 'doughnut' : 'pie',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: cutout,
        plugins: {
          legend: {
            display: showLegend,
            position: legendPosition,
            labels: {
              boxWidth: 12,
              padding: 15,
              font: {
                size: 12,
              },
            },
          },
          title: {
            display: !!title,
            text: title,
            font: {
              size: 16,
              weight: 'bold',
            },
            padding: {
              top: 10,
              bottom: 10,
            },
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw as number || 0;
                const dataset = context.chart.data.datasets[0].data as number[];
                const total = dataset.reduce((a: number, b: number) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        },
        animation: animation ? {
          animateRotate: true,
          animateScale: true
        } : false,
      },
    });

    // Limpieza al desmontar
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, colors, title, showLegend, legendPosition, cutout, borderWidth, borderColor, hoverOffset, animation]);

  return (
    <div style={{ width: '100%'}}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default PieChart;
