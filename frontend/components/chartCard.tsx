import { AreaChart, Area, CartesianGrid, XAxis } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";
import { ChartContainer } from "@/components/ui/chart";

type ChartSeriesConfig = {
  prefix: string;
  label: string;
  color: string;
};

type ChartCardProps = {
  title: string;
  description?: string;
  footer?: React.ReactNode;
  data: any[];
  config: {
    [key: string]: ChartSeriesConfig;
  };
  dataKeys: string[];
};

export default function ChartCard({ title, description, footer, data, config, dataKeys }: ChartCardProps) {
  return (
    <Card className="text-white bg-accent-foreground">
      <CardHeader className="px-5">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent className="px-5">
        <ChartContainer config={config} className="h-40 w-full">
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            <defs>
              {dataKeys.map((key) => {
                const { prefix, color } = config[key];
                return (
                  <linearGradient
                    key={key}
                    id={`${prefix}-fill`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                  </linearGradient>
                );
              })}
            </defs>

            {dataKeys.map((key) => (
              <Area
                key={key}
                dataKey={key}
                type="natural"
                fill={`url(#${config[key].prefix}-fill)`}
                stroke={config[key].color}
                stackId="a"
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>

      <hr />

      {footer && <CardFooter className="px-5">{footer}</CardFooter>}
    </Card>
  );
}
