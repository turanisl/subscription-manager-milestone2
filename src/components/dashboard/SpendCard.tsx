import { TrendingDown, Calendar } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { mockSpendingData, lastMonthTotal } from '@/data/mockData';

interface SpendCardProps {
  totalSpend: number;
}

export function SpendCard({ totalSpend }: SpendCardProps) {
  const difference = lastMonthTotal - totalSpend;
  const isLess = difference > 0;

  return (
    <div className="gradient-card rounded-xl p-6 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <p className="text-primary-foreground/80 text-sm font-medium">
            Current subscription spend this month
          </p>
          {isLess && (
            <div className="flex items-center gap-1.5 bg-primary-foreground/20 px-2.5 py-1 rounded-full">
              <TrendingDown className="w-3.5 h-3.5 text-primary-foreground" />
              <span className="text-xs text-primary-foreground font-medium">
                ${difference.toFixed(0)} less than last month
              </span>
            </div>
          )}
        </div>

        {/* Amount */}
        <h2 className="text-5xl font-bold text-primary-foreground mb-6">
          ${totalSpend.toFixed(2)}
        </h2>

        {/* Chart */}
        <div className="h-32 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockSpendingData}>
              <defs>
                <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
                tickFormatter={(value) => `${value}`}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(220 15% 10%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                }}
                formatter={(value: number) => [`$${value}`, 'Spent']}
                labelFormatter={(label) => `Day ${label}`}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="rgba(255,255,255,0.8)"
                strokeWidth={2}
                fill="url(#spendGradient)"
                dot={false}
                activeDot={{ r: 6, fill: 'white', stroke: 'none' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Payday pill */}
        <div className="flex items-center gap-2 mt-4">
          <div className="flex items-center gap-2 bg-primary-foreground/20 px-3 py-1.5 rounded-full">
            <Calendar className="w-4 h-4 text-primary-foreground" />
            <span className="text-sm text-primary-foreground font-medium">Payday in 8 days</span>
          </div>
        </div>
      </div>
    </div>
  );
}
