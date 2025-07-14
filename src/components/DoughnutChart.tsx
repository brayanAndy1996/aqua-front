'use client'
import React, { useEffect, useRef, useState } from 'react';

// Interface para los datos del gráfico
interface DoughnutData {
  label: string;
  value: number;
  color?: string;
}

// Interface para las props del componente
interface DoughnutChartProps {
  data: DoughnutData[];
  size?: number;
  innerRadius?: number;
  colors?: string[];
  showLegend?: boolean;
  showLabels?: boolean;
  showTooltip?: boolean;
  backgroundColor?: string;
  textColor?: string;
  centerText?: string;
  centerSubtext?: string;
  animationDuration?: number;
  className?: string;
}

// Colores por defecto inspirados en lightweight-charts
const DEFAULT_COLORS = [
  '#3b82f6', // blue
  '#06b6d4', // cyan
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#6b7280', // gray
];

const DoughnutChart: React.FC<DoughnutChartProps> = ({
  data = [],
  size = 300,
  innerRadius = 0.6,
  colors = DEFAULT_COLORS,
  showLegend = true,
  showTooltip = true,
  backgroundColor = '#1a1a1a',
  textColor = '#ffffff',
  centerText,
  centerSubtext,
  animationDuration = 1000,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{
    show: boolean;
    x: number;
    y: number;
    content: string;
  }>({
    show: false,
    x: 0,
    y: 0,
    content: '',
  });
  const [animationProgress, setAnimationProgress] = useState(0);

  // Calcular total y porcentajes
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithPercentages = data.map((item, index) => ({
    ...item,
    percentage: (item.value / total) * 100,
    color: item.color || colors[index % colors.length],
  }));

  // Animación
  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      // Easing function (ease-out)
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setAnimationProgress(easedProgress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    animate();
  }, [animationDuration, data]);

  // Dibujar el gráfico
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar canvas
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    // Limpiar canvas
    ctx.clearRect(0, 0, size, size);

    const centerX = size / 2;
    const centerY = size / 2;
    const outerRadius = (size / 2) * 0.8;
    const innerRadiusValue = outerRadius * innerRadius;

    let currentAngle = -Math.PI / 2; // Empezar desde arriba

    // Dibujar segmentos
    dataWithPercentages.forEach((item, index) => {
      const angle = (item.percentage / 100) * 2 * Math.PI * animationProgress;
      
      // Color con hover effect
      let segmentColor = item.color;
      if (hoveredIndex === index) {
        // Hacer el color más brillante en hover
        segmentColor = lightenColor(item.color, 20);
      }

      // Dibujar segmento
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, currentAngle, currentAngle + angle);
      ctx.arc(centerX, centerY, innerRadiusValue, currentAngle + angle, currentAngle, true);
      ctx.closePath();
      ctx.fillStyle = segmentColor;
      ctx.fill();

      // Añadir sombra sutil
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      currentAngle += angle;
    });

    // Resetear sombra
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Dibujar texto central
    if (centerText || centerSubtext) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      if (centerText) {
        ctx.fillStyle = textColor;
        ctx.font = `bold ${size * 0.08}px -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`;
        ctx.fillText(centerText, centerX, centerY - (centerSubtext ? size * 0.02 : 0));
      }
      
      if (centerSubtext) {
        ctx.fillStyle = textColor + '80'; // Semi-transparente
        ctx.font = `${size * 0.04}px -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`;
        ctx.fillText(centerSubtext, centerX, centerY + size * 0.03);
      }
    }
  }, [data, size, innerRadius, hoveredIndex, animationProgress, textColor, centerText, centerSubtext, dataWithPercentages]);

  // Función para hacer colores más claros
  const lightenColor = (color: string, percent: number): string => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  };

  // Manejar eventos del mouse
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!showTooltip) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = size / 2;
    const centerY = size / 2;
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const outerRadius = (size / 2) * 0.8;
    const innerRadiusValue = outerRadius * innerRadius;

    if (distance >= innerRadiusValue && distance <= outerRadius) {
      let angle = Math.atan2(dy, dx) + Math.PI / 2;
      if (angle < 0) angle += 2 * Math.PI;

      let currentAngle = 0;
      let foundIndex = -1;

      for (let i = 0; i < dataWithPercentages.length; i++) {
        const segmentAngle = (dataWithPercentages[i].percentage / 100) * 2 * Math.PI;
        if (angle >= currentAngle && angle <= currentAngle + segmentAngle) {
          foundIndex = i;
          break;
        }
        currentAngle += segmentAngle;
      }

      if (foundIndex !== -1) {
        setHoveredIndex(foundIndex);
        setTooltip({
          show: true,
          x: event.clientX,
          y: event.clientY,
          content: `${dataWithPercentages[foundIndex].label}: ${dataWithPercentages[foundIndex].value} (${dataWithPercentages[foundIndex].percentage.toFixed(1)}%)`,
        });
      } else {
        setHoveredIndex(null);
        setTooltip(prev => ({ ...prev, show: false }));
      }
    } else {
      setHoveredIndex(null);
      setTooltip(prev => ({ ...prev, show: false }));
    }
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setTooltip(prev => ({ ...prev, show: false }));
  };

  return (
    <div 
      className={`doughnut-chart ${className}`}
      style={{ 
        backgroundColor,
        borderRadius: '8px',
        padding: '20px',
        display: 'inline-block',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
        <div style={{ position: 'relative' }}>
          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: 'pointer', display: 'block' }}
          />
          
          {/* Tooltip */}
          {tooltip.show && showTooltip && (
            <div
              style={{
                position: 'fixed',
                left: tooltip.x + 10,
                top: tooltip.y - 10,
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
                pointerEvents: 'none',
                zIndex: 1000,
                whiteSpace: 'nowrap',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {tooltip.content}
            </div>
          )}
        </div>

        {/* Leyenda */}
        {showLegend && (
          <div style={{ minWidth: '120px' }}>
            {dataWithPercentages.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '8px',
                  fontSize: '12px',
                  color: textColor,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
                  cursor: 'pointer',
                  opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.6,
                  transition: 'opacity 0.2s ease',
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: item.color,
                    borderRadius: '2px',
                    marginRight: '8px',
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500' }}>{item.label}</div>
                  <div style={{ color: textColor + '80', fontSize: '11px' }}>
                    {item.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Componente de ejemplo
// const DoughnutChartExample: React.FC = () => {
//   const sampleData = [
//     { label: 'API Connect', value: 40, color: '#8b5cf6' },
//     { label: 'Containers', value: 42, color: '#06b6d4' },
//     { label: 'IoT', value: 18, color: '#10b981' },
//     { label: 'Watson Assistant', value: 8, color: '#ec4899' },
//     { label: 'Cloud Data & AI', value: 3, color: '#ef4444' },
//     { label: 'Security', value: 7, color: '#f5f5f5' },
//     { label: 'Security', value: 0.1, color: '#22c55e' },
//   ];

//   return (
//     <div style={{ 
//       padding: '20px', 
//       backgroundColor: '#0f0f0f', 
//       minHeight: '100vh',
//       fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
//     }}>
//       <h1 style={{ color: 'white', marginBottom: '30px', fontSize: '24px', fontWeight: '600' }}>
//         Doughnut Chart Component
//       </h1>
      
//       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
//         {/* Ejemplo básico */}
//         <DoughnutChart
//           data={sampleData}
//           centerText="15,250"
//           centerSubtext="Browsers"
//           size={350}
//         />

//         {/* Ejemplo sin leyenda */}
//         <DoughnutChart
//           data={sampleData.slice(0, 4)}
//           showLegend={false}
//           centerText="Total"
//           centerSubtext="Sales"
//           size={280}
//           innerRadius={0.7}
//         />

//         {/* Ejemplo con colores personalizados */}
//         <DoughnutChart
//           data={[
//             { label: 'Revenue', value: 65 },
//             { label: 'Costs', value: 25 },
//             { label: 'Profit', value: 10 },
//           ]}
//           colors={['#3b82f6', '#ef4444', '#10b981']}
//           centerText="$125K"
//           centerSubtext="Total"
//           size={300}
//           backgroundColor="#1f1f1f"
//         />
//       </div>
//     </div>
//   );
// };

export default DoughnutChart;