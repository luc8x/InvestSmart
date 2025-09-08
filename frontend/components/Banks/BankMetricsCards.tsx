interface BankMetricsCardsProps {
  chartData: Array<{
    name: string
    value: number
    color: string
  }>
  hoveredIndex: number | null
  formatCurrency: (value: number) => string
}

export default function BankMetricsCards({ chartData, hoveredIndex, formatCurrency }: BankMetricsCardsProps) {
  const total = chartData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="flex flex-col gap-4 bg-gray-50 p-5 rounded-2xl h-full border border-gray-300/30">
      {chartData.map((entry, index) => {
        const percentage = (entry.value / total) * 100
        return (
          <div
            key={index}
            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 p-5 shadow-sm border border-gray-100 transition-all duration-300 ${hoveredIndex === null
                ? 'hover:shadow-lg opacity-100 scale-100'
                : hoveredIndex === index
                  ? 'shadow-xl opacity-100 scale-105 bg-gradient-to-br from-blue-50 to-white'
                  : 'opacity-40 scale-95'
              }`}
          >
            <div
              className="absolute top-0 left-0 w-full h-1"
              style={{
                background: `linear-gradient(90deg, ${entry.color}, ${entry.color}88)`,
              }}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className="w-4 h-4 rounded-full shadow-sm"
                    style={{ backgroundColor: entry.color }}
                  />
                  <div
                    className="absolute inset-0 w-4 h-4 rounded-full animate-ping opacity-20"
                    style={{ backgroundColor: entry.color }}
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{entry.name}</p>
                  <p className="text-xs text-gray-500">Saldo disponível</p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-2 justify-end">
                  <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: entry.color,
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-600">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(entry.value)}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}