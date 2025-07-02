"use client";

import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, AreaSeries, LineSeries } from 'lightweight-charts';

export type ChartType = 'area' | 'line';

export interface TimeSeriesChartProps {
  data: Array<{ time: string; value: number }>;
  colors?: {
    color?: string;
    lineColor?: string;
    topColor?: string;
    bottomColor?: string;
  };
  lineWidth?: number;
  type?: ChartType;
  className?: string;
  height?: number;
}

export default function TimeSeriesChart({
  data,
  type = 'area',
  height = 300,
  colors = {},
  lineWidth = 2,
  className = '',
}: TimeSeriesChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Salir si no hay contenedor o datos
    if (!chartContainerRef.current || !data || data.length === 0) {
      return;
    }

    // Limpiar el contenedor
    const container = chartContainerRef.current;
    container.innerHTML = '';

    // Formatear los datos para asegurar que están en el formato correcto
    const formattedData = data.map(item => {
      // Convertir la fecha al formato YYYY-MM-DD
      let timeValue;
      try {
        const date = new Date(item.time);
        timeValue = date.toISOString().split('T')[0];
      } catch {
        // Si hay un error, usar la fecha como está
        timeValue = String(item.time);
      }
      
      return {
        time: timeValue,
        value: Number(item.value) || 0
      };
    });

    try {
      // Crear el gráfico
      const chart = createChart(container);
      
      // Configurar el gráfico
      chart.applyOptions({
        width: container.clientWidth,
        height: height,
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: 'rgba(0, 0, 0, 0.9)',
        },
        grid: {
          vertLines: { visible: false },
          horzLines: { visible: false },
        },
        timeScale: {
          timeVisible: true,
          borderVisible: false,
        },
        rightPriceScale: {
          borderVisible: false,
        },
        handleScale: false,
        handleScroll: false,
      });

      // Usar casting a any para evitar errores de TypeScript
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const chartAny = chart as any;
      
      // Crear la serie usando el método correcto según el tipo
      const series = type === 'area' 
        ? chartAny.addSeries(AreaSeries, {
            lineColor: colors.lineColor || '#3b82f6',
            topColor: colors.topColor || 'rgba(59, 130, 246, 0.4)',
            bottomColor: colors.bottomColor || 'rgba(59, 130, 246, 0.0)',
            lineWidth: lineWidth,
            priceFormat: {
              type: 'price',
              precision: 0,
              minMove: 1,
            },
          })
        : chartAny.addSeries(LineSeries, {
            color: colors.color || '#10b981',
            lineWidth: lineWidth,
            priceFormat: {
              type: 'price',
              precision: 0,
              minMove: 1,
            },
          });

      // Establecer los datos
      series.setData(formattedData);

      // Ajustar la vista
      chart.timeScale().fitContent();

      // Manejar el redimensionamiento
      const handleResize = () => {
        chart.applyOptions({
          width: container.clientWidth,
        });
      };

      // Usar ResizeObserver para manejar cambios de tamaño
      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(container);

      // Limpiar al desmontar
      return () => {
        resizeObserver.disconnect();
        chart.remove();
      };
    } catch (error) {
      console.error('Error al crear el gráfico:', error);
    }
  }, [data, type, colors, lineWidth, height]);

  return (
    <div 
      ref={chartContainerRef} 
      className={className}
      style={{ minHeight: height }}
    />
  );
}
