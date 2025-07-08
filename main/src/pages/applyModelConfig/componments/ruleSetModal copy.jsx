import {Modal,Select} from 'antd';
import Tree from 'react-d3-tree';
import { useCenteredTree } from "./helper";
import {PlusOutlined,PlusCircleOutlined} from '@ant-design/icons'
const {Option} = Select;
function RuleSetModal({}){
  const [translate, containerRef] = useCenteredTree();
  const nodeSize = { x: 140, y: 38 };
  const foreignObjectProps = { width:100, height: nodeSize.y, x: 0,y:-15 };
  const orgChart = {
    name: 'CEO',
    children: [
      {
        name: 'Manager',
        attributes: {
          department: 'Production',
        },
        children: [
          {
            name: 'Foreman',
            attributes: {
              department: 'Fabrication',
            },
            children: [
              {
                name: 'Worker',
              },
            ],
          },
          {
            name: 'Foreman1',
            attributes: {
              department: 'Assembly',
            },
            children: [
              {
                name: 'Worker1',
              },
            ],
          },
        ],
      },
    ],
  };
  const renderForeignObjectNode = ({
    nodeDatum,
    toggleNode,
  }) => {
    console.log('toggleNode=',toggleNode);
    console.log('nodeDatum=',nodeDatum);
    return (
      <>
        <foreignObject {...foreignObjectProps}>
          <select style={{width:'80px',height:"32px"}}>
            <option value="1">11111</option>
            <option value="2">222222</option>
          </select>
          <PlusCircleOutlined style={{fontSize:'18px'}}/>
        </foreignObject>
      </>
    )
  };
  const straightPathFunc = (linkData) => {
    console.log('linkData=',linkData);
    console.log('linkData=',linkData.target.data);
    if(linkData.target.data.name==linkData.source.children[0].data.name){
      const x1 = linkData.source.y+100;
      const y1 = linkData.source.x
      // const x2 = linkData.target.y;
      // const y2 = (linkData.target.x + linkData.source.x)/2
      const x = linkData.target.y
      const y = linkData.target.x
      const d = `M${x1},${y1}L${x},${y}`;
      return d
    }else{
      const x1 = linkData.source.y+100;
      const y1 = linkData.source.x
      // const x2 = linkData.target.y;
      // const y2 = (linkData.target.x + linkData.source.x)/2
      const x = linkData.target.y
      const y = linkData.target.x
      const d = `M${x1},${y1}L${x},${y}`;
      return d
    }
  };
  return (
    <Modal
      visible={true}
      onCancel={()=>{}}
      width={'95%'}
      bodyStyle={{height:'600px'}}
      centered
      onOk={()=>{}}
    >
              <Select style={{width:'100px'}}>
          <Select.Option value={1}>1</Select.Option>
          <Select.Option value={2}>2</Select.Option>
        </Select>
        <PlusCircleOutlined/>
      <div id="treeWrapper" style={{ width: '100%', height: '100%' }}>
        <Tree
          translate={translate}
          data={orgChart}
          nodeSize={nodeSize}
          renderCustomNodeElement={(rd3tProps) =>
            renderForeignObjectNode({ ...rd3tProps })
          }
          pathFunc={straightPathFunc}
        />
      </div>
    </Modal>
  )
}
export default RuleSetModal;
