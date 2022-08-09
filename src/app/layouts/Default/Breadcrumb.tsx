import { Breadcrumb as AntdBreadcrumb } from 'antd';
import useBreadcrumb from '../../../core/hooks/useBreadcrumb';

export default function Breadcrumb() {
  const { breadcrumb } = useBreadcrumb();

  return (
    <AntdBreadcrumb style={{ margin: '16px 0' }} className='no-print'>
      {breadcrumb.map((bc, index) => (
        <AntdBreadcrumb.Item key={index}>{bc}</AntdBreadcrumb.Item>
      ))}
    </AntdBreadcrumb>
  );
}
