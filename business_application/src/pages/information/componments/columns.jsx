import { dataFormat } from '../../../util/util';

export const commentcolumns = [
  {
    title: '资讯标题',
    dataIndex: 'informationFileName',
    key: 'informationFileName',
  },
  {
    title: '评论内容',
    dataIndex: 'commentContent',
    key: 'commentContent',
    ellipsis: true,
    render: (text) => {
      return text.replace(/<[^>]+>/g, '');
    },
  },
  {
    title: '评论时间',
    dataIndex: 'commentTime',
    key: 'commentTime',
    render: (text) => {
      return <div>{dataFormat(text, 'YYYY-MM-DD HH:mm:ss')}</div>;
    },
  },
  {
    title: '评论人',
    dataIndex: 'commentUserName',
    key: 'commentUserName',
  },
];
