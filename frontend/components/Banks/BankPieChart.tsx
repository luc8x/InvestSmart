import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface BankPieChartProps {
  chartData: Array<{
    name: string
    value: number
    color: string
  }>
  hoveredIndex: number | null
  setHoveredIndex: (index: number | null) => void
  formatCurrency: (value: number) => string
}

export default function BankPieChart({ chartData, hoveredIndex, setHoveredIndex, formatCurrency }: BankPieChartProps) {
  const total = chartData.reduce((sum, item) => sum + item.value, 0)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const percentage = ((data.value / total) * 100).toFixed(1)
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-200/50">
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: data.color }}
            />
            <div>
              <p className="font-semibold text-gray-800">{data.name}</p>
              <p className="text-sm text-gray-600">
                {formatCurrency(data.value)} ({percentage}%)
              </p>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="relative">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>

            {[...Array(8)].map((_, i) => (
              <line
                key={i}
                x1="0"
                y1={50 + i * 40}
                x2="100%"
                y2={50 + i * 40}
                stroke="rgba(0,0,0,0.09)"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            ))}

            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
              label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
              labelLine={false}
              onMouseEnter={(_, index) => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                fontSize: 8,
                fontWeight: 500,
                filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.05))",
              }}
            >
              {chartData.map((e, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#gradient-${index})`}
                  style={{
                    filter: hoveredIndex !== null && hoveredIndex !== index ? 'brightness(0.7)' : 'brightness(1)',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <defs>
              {chartData.map((entry, index) => (
                <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                  <stop offset="100%" stopColor={entry.color} stopOpacity={0.8} />
                </linearGradient>
              ))}
            </defs>
          </PieChart>
        </ResponsiveContainer>

        {chartData.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-gray-500 font-medium">Carregando dados...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}