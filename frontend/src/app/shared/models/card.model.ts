import { ChartType } from '../enums/chart-type.enum';
import { ColorOption, SizeOption } from '../enums/typography.enum';

export interface Card {
  id: number;
  dashboard_id: number;
  title: string;
  subtitle?: string;
  chart_type: ChartType;
  title_size?: SizeOption;
  title_color?: ColorOption;
  subtitle_size?: SizeOption;
  position_x: number;
  position_y: number;
  width: number;
  height: number;
}
