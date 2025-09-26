import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'critical';
}

export function StatsCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  variant = 'default' 
}: StatsCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-success/20 bg-success/5';
      case 'warning':
        return 'border-warning/20 bg-warning/5';
      case 'critical':
        return 'border-critical/20 bg-critical/5';
      default:
        return 'border-border';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'critical':
        return 'text-critical';
      default:
        return 'text-primary';
    }
  };

  return (
    <Card className={`shadow-card slide-in-medical ${getVariantStyles()}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${getIconColor()}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className={`text-xs mt-1 ${trend.isPositive ? 'text-success' : 'text-destructive'}`}>
            {trend.isPositive ? '↗' : '↘'} {trend.value}
          </div>
        )}
      </CardContent>
    </Card>
  );
}