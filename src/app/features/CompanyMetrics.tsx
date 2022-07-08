import { Area, AreaConfig } from '@ant-design/charts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { MetricService } from 'tato_ap-sdk';
import transformDataIntoAntdChart from '../../core/utils/transformDataIntoAntdChart';

export default function CompanyMetrics() {
  const [data, setData] = useState<
    {
      yearMonth: string;
      value: number;
      category: 'totalRevenues' | 'totalExpenses';
    }[]
  >([]);

  useEffect(() => {
    MetricService.getMonthlyRevenuesExpenses()
      .then(transformDataIntoAntdChart)
      .then(setData);
  }, []);

  const config: AreaConfig = {
    data,
    height: 256,
    color: ['#0099ff', '#274060'],
    areaStyle: { fillOpacity: 1 },
    xField: 'yearMonth',
    yField: 'value',
    seriesField: 'category',
    legend: {
      itemName: {
        formatter(legend) {
          return legend === 'totalRevenues' ? 'Receitas' : 'Despesas';
        },
      },
    },
    tooltip: {
      title(title) {
        return format(new Date(title), 'MMMM yyyy', { locale: ptBR });
      },
      formatter(data) {
        return {
          name: data.category === 'totalRevenues' ? 'Receitas' : 'Despesas',
          value: (data.value as number).toLocaleString('pt-BR', {
            currency: 'BRL',
            style: 'currency',
            maximumFractionDigits: 2,
          }),
        };
      },
    },
    yAxis: false,
    xAxis: {
      label: {
        formatter(item) {
          return format(new Date(item), 'MMM/yyyy', { locale: ptBR });
        },
      },
    },
    point: {
      size: 3,
      shape: 'circle',
    },
  };
  return <Area {...config} />;
}
