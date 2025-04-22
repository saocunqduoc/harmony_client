
import React from 'react';
import { 
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  Bar,
  Line,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  TooltipProps
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from './chart';

interface ChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors: string[];
  valueFormatter?: (value: number) => string;
  className?: string;
}

export const BarChart = ({ 
  data, 
  index, 
  categories, 
  colors, 
  valueFormatter = (value) => String(value),
  className = 'h-72'
}: ChartProps) => {
  return (
    <ChartContainer className={className} config={{}}>
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey={index} />
        <YAxis />
        <Tooltip 
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <ChartTooltipContent 
                  active={active}
                  payload={payload}
                  label={label}
                  formatter={(value) => valueFormatter(Number(value))}
                />
              );
            }
            return null;
          }} 
        />
        <Legend />
        {categories.map((category, i) => (
          <Bar 
            key={category} 
            dataKey={category} 
            fill={colors[i % colors.length]} 
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ChartContainer>
  );
};

export const LineChart = ({ 
  data, 
  index, 
  categories, 
  colors, 
  valueFormatter = (value) => String(value),
  className = 'h-72'
}: ChartProps) => {
  return (
    <ChartContainer className={className} config={{}}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey={index} />
        <YAxis />
        <Tooltip 
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <ChartTooltipContent 
                  active={active}
                  payload={payload}
                  label={label}
                  formatter={(value) => valueFormatter(Number(value))}
                />
              );
            }
            return null;
          }} 
        />
        <Legend />
        {categories.map((category, i) => (
          <Line 
            key={category} 
            type="monotone" 
            dataKey={category} 
            stroke={colors[i % colors.length]} 
            activeDot={{ r: 8 }} 
          />
        ))}
      </RechartsLineChart>
    </ChartContainer>
  );
};

export const PieChart = ({ 
  data, 
  index, 
  categories, 
  colors, 
  valueFormatter = (value) => String(value),
  className = 'h-72'
}: ChartProps) => {
  return (
    <ChartContainer className={className} config={{}}>
      <RechartsPieChart>
        <Tooltip 
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <ChartTooltipContent 
                  active={active}
                  payload={payload}
                  label={label}
                  formatter={(value) => valueFormatter(Number(value))}
                />
              );
            }
            return null;
          }} 
        />
        <Legend />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey={categories[0]}
          nameKey={index}
        >
          {data.map((entry, i) => (
            <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
          ))}
        </Pie>
      </RechartsPieChart>
    </ChartContainer>
  );
};
