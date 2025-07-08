/**
 * 集成 react-resizable 来实现可伸缩列。
 */
import { Table } from 'antd';
import { Resizable } from 'react-resizable';
import React from 'react'

const ResizeableTitle = props => {
  const { onResize, width,...restProps } = props;
  return (
    <Resizable
      width={width?width:null}
      height={0}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
      minConstraints={[50, 50]}
    >
      <th {...restProps} />
    </Resizable>
  );
};

class DragTable extends React.Component {
  state={
    columns:[]
  }
  componentWillReceiveProps(props) {
    this.setState({columns: props.columns});
  }
  // componentDidMount(){
  //   this.setState({columns:this.props.columns});
  // }
  components = {
    header: {
      cell: ResizeableTitle,
    },
  };
  handleResize = index => (e, { size }) => {
    console.log('index=',index);
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      console.log('nextColumns=',nextColumns);
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return { columns: nextColumns };
    });
  };

  render() {
    const columns = this.state.columns.map((col, index) => ({
      ...col,
      onHeaderCell: columns => ({
        width:columns.width,
        onResize: this.handleResize(index),
      }),
    }));

    return <Table
            {...this.props}
            components={{...this.props.components,...this.components}}
            columns={columns}
            scroll={{ y: 'calc(100vh-400px)' }}
          />;
  }
}

export default DragTable;
