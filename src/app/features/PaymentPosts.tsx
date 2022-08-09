import { Descriptions, Table, Tooltip } from 'antd';
import { Post } from 'tato_ap-sdk';
import transformIntoBrl from '../../core/utils/transformIntoBrl';

interface PaymentPostsProps {
  loading?: boolean;
  posts: Post.WithEarnings[];
}

export default function PaymentPosts(props: PaymentPostsProps) {
  return (
    <>
      <Table<Post.WithEarnings>
        loading={props.loading}
        dataSource={props.posts}
        rowKey={'id'}
        columns={[
          {
            title: 'Posts',
            responsive: ['xs'],
            render(posts: Post.WithEarnings) {
              return (
                <Descriptions column={1} size={'small'}>
                  <Descriptions.Item label={'Título'}>{posts.title}</Descriptions.Item>
                  <Descriptions.Item label={'Preço por palavra'}>
                    {transformIntoBrl(posts.earnings.pricePerWord)}
                  </Descriptions.Item>
                  <Descriptions.Item label={'Palavras no post'}>
                    {posts.earnings.words}
                  </Descriptions.Item>
                  <Descriptions.Item label={'Total ganho neste post'}>
                    {transformIntoBrl(posts.earnings.totalAmount)}
                  </Descriptions.Item>
                </Descriptions>
              );
            },
          },
          {
            dataIndex: 'title',
            title: 'Título',
            ellipsis: true,
            width: 300,
            responsive: ['sm'],
            render(title: Post.WithEarnings['title']) {
              return <Tooltip title={title}>{title}</Tooltip>;
            },
          },
          {
            dataIndex: 'earnings.pricePerWord'.split('.'),
            title: 'Preço por palavra',
            align: 'right',
            width: 150,
            responsive: ['sm'],
            render(price: number) {
              return transformIntoBrl(price);
            },
          },
          {
            dataIndex: 'earnings.words'.split('.'),
            title: 'Palavras no post',
            align: 'right',
            width: 150,
            responsive: ['sm'],
          },
          {
            dataIndex: 'earnings.totalAmount'.split('.'),
            title: 'Total ganho neste post',
            align: 'right',
            width: 170,
            responsive: ['sm'],
            render(total: number) {
              return transformIntoBrl(total);
            },
          },
        ]}
      ></Table>
    </>
  );
}
