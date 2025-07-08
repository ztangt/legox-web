/**
 * 关联用户单位岗位
 * （注意，请在相关的model里面定义selectedNodeId,selectedDataIds,treeSearchWord,
 * selectedDatas,originalData)
 * (selectedDataIds是上次保存的数据id)
 * selectedDatas为选中的数据信息，selectedDataIds为选中的数据id
 */
import _ from 'lodash'
import PropTypes from 'prop-types'
import React, { useEffect, useImperativeHandle } from 'react'
import { useModel } from 'umi'
import ReSizeLeftRight from '../reSizeLeftRight/reSizeLeftRight.jsx'
import { renderCol } from './columns.jsx'
import MiddleWaitData from './middleWaitData.jsx'
import styles from './relevanceModal.less'
import RightSelectData from './rightSelectData.jsx'
import TreeSelect from './treeSelect'
const RelevanceModal = React.forwardRef(
  (props: any, ref: React.Ref<unknown>) => {
    const {
      orgUserType,
      selectButtonType,
      defaultSelectedDataIds,
      type,
      nodeIds,
      containerId,
    } = props
    const {
      selectedNodeId,
      selectedDataIds,
      selectedDatas,
      originalData,
      setState,
      getQueryUserFn,
      getUnitRoleFn,
      getUgsFn,
      getSelectedDatasFn,
      orgKind,
      treeType,
    } = useModel('relevanceModal')
    console.log('selectedDatas=', selectedDatas)
    useEffect(() => {
      //清空数据
      setState({
        selectedNodeId: '',
        selectedDataIds: [],
        treeSearchWord: '',
        selectedDatas: [],
        originalData: [],
      })
      if (orgUserType == 'USERGROUP') {
        //获取用户组列表为originalData数据
        getUgsFn({
          searchWord: '',
          start: 1,
          limit: 10000,
        })
      }
      //通过selectedDataIds获取selectedDatas数据
      if (defaultSelectedDataIds.length) {
        getSelectedDatasFn({
          orgUserType: orgUserType,
          selectedDataIds: defaultSelectedDataIds,
        })
      }
    }, [])
    useImperativeHandle(ref, () => ({
      getSelectedDatas: () => {
        return selectedDatas
      },
    }))
    //获取用户列表
    const getData = (node: any, orgKind: string, treeType: string) => {
      console.log('node=', node)
      setState({
        selectedNodeId: node.key,
        selectNodeType: node.nodeType,
        orgKind: orgKind,
        treeType: treeType,
      })
      if (orgUserType == 'USER') {
        debugger
        getQueryUserFn({
          searchWord: '',
          orgIds: node.key,
          orgKind,
          treeType: 'ORGS',
        })
      } else if (orgUserType == 'RULE') {
        getUnitRoleFn({
          searchWord: '',
          orgId: node.key,
          roleType: 'ORGROLE',
          start: 1,
          limit: 10000,
        })
      }
    }
    //左侧树状的选择
    const onCheck = (checkedKeys: Array<any>, { checked, node }) => {
      selectedDatas.map((item) => {
        delete item.title //必须去掉他，要不不符合json的cloneDeep
      })
      let list = _.cloneDeep(selectedDatas)
      let listIds = _.cloneDeep(selectedDataIds)
      if (checked) {
        let obj = {}
        if (node.nodeType == 'ORG') {
          obj = {
            ...node,
          }
        } else if (node.nodeType == 'DEPT') {
          obj = {
            ...node,
            parentName: node.parentType == 'DEPT' ? node.parentName : '',
          }
        } else if (node.nodeType == 'POST') {
          obj = {
            ...node,
          }
        }
        if (selectButtonType == 'checkBox') {
          list.push(obj)
          listIds.push(node.nodeId)
        } else {
          list = [obj]
          listIds = [node.nodeId]
        }
      } else {
        list = list.filter((x: any) => x.nodeId != node.nodeId)
        listIds = listIds.filter((x: any) => x != node.nodeId)
      }
      setState({ selectedDatas: list, selectedDataIds: listIds })
    }
    //左侧
    const leftRender = (
      checkable: boolean,
      checkedKeys: string[],
      nodeType: string,
      plst: string,
      checkStrictly: boolean
    ) => {
      // 根据nodeType来判断节点是否禁掉 checkbox
      return (
        <div className={styles.left_org_tree}>
          <span className={styles.title}>组织机构</span>
          <div className={styles.content} style={{ position: 'relative' }}>
            <TreeSelect
              plst={plst}
              getData={getData}
              nodeType={nodeType}
              onCheck={onCheck}
              checkable={checkable}
              checkedKeys={checkedKeys}
              checkStrictly={checkStrictly}
              style={{}}
              isDisableCheckbox={true}
              nodeIds={nodeIds}
              type={type}
            />
          </div>
        </div>
      )
    }
    //搜索人名
    const searchWordFn = (searchWord: string) => {
      if (orgUserType == 'USER') {
        getQueryUserFn({
          searchWord: searchWord,
          orgIds: selectedNodeId,
          treeType: 'ORGS',
          orgKind,
        })
      } else if (orgUserType == 'RULE') {
        getUnitRoleFn({
          searchWord: searchWord,
          orgId: selectedNodeId,
          roleType: 'ORGROLE',
          start: 1,
          limit: 10000,
        })
      }
    }
    //更新选择的用户ID
    const updateSelectIdsFn = (
      selectedDataIds: Array<any>,
      selectedDatas: Array<any>
    ) => {
      setState({
        selectedDataIds,
        selectedDatas: JSON.parse(JSON.stringify(selectedDatas)),
      })
    }
    //关闭标签(关闭所以标签（清空）)
    const closeTag = (idValue: string, idKey: string) => {
      if (idValue) {
        selectedDataIds.splice(selectedDataIds.indexOf(idValue), 1)
        let newSelectedDatas = selectedDatas.filter(
          (item) => item[idKey] != idValue
        )
        updateSelectIdsFn(selectedDataIds, newSelectedDatas)
      } else {
        updateSelectIdsFn([], [])
      }
    }
    return (
      <div className={styles.user_warp}>
        <span className={styles.split_line}></span>
        {orgUserType == 'USER' ? (
          <ReSizeLeftRight
            lineTop={31}
            suffix={containerId}
            leftChildren={leftRender(
              false,
              [],
              'DEPT',
              '请输入单位/部门名称、编码',
              false
            )}
            level={1}
            height={'100%'}
            rightChildren={
              <ReSizeLeftRight
                lineTop={31}
                suffix={containerId}
                leftChildren={
                  <MiddleWaitData
                    originalData={originalData}
                    selectIds={selectedDataIds}
                    searchWordFn={searchWordFn}
                    updateSelectIdsFn={updateSelectIdsFn}
                    selectedDatas={selectedDatas}
                    idKey="identityId"
                    nameKey="userName"
                    selectedNodeId={selectedNodeId}
                    searchWordHint="姓名/账号"
                    selectButtonType={selectButtonType}
                  />
                }
                rightChildren={
                  <RightSelectData
                    selectedDatas={selectedDatas}
                    idKey="identityId"
                    nameKey="userName"
                    columns={renderCol(orgUserType, closeTag)}
                    closeTag={closeTag}
                  />
                }
                level={2}
                vRigthNumLimit={100}
                height={'100%'}
              />
            }
          />
        ) : orgUserType == 'USERGROUP' ? (
          <ReSizeLeftRight
            lineTop={31}
            suffix={containerId}
            level={1}
            height={'100%'}
            leftChildren={
              <MiddleWaitData
                originalData={originalData}
                selectIds={selectedDataIds}
                searchWordFn={searchWordFn}
                updateSelectIdsFn={updateSelectIdsFn}
                selectedDatas={selectedDatas}
                idKey="nodeId"
                nameKey="nodeName"
                searchWordHint="请输入用户组名称"
                selectedNodeId={selectedNodeId}
                selectButtonType={selectButtonType}
              />
            }
            rightChildren={
              <RightSelectData
                selectedDatas={selectedDatas}
                idKey="nodeId"
                nameKey="nodeName"
                columns={renderCol(orgUserType, closeTag)}
                closeTag={closeTag}
              />
            }
          />
        ) : orgUserType == 'RULE' ? (
          <ReSizeLeftRight
            lineTop={31}
            suffix={containerId}
            level={1}
            height={'100%'}
            leftChildren={leftRender(
              false,
              [],
              'ORG',
              '请输入单位名称、编码',
              false
            )}
            rightChildren={
              <ReSizeLeftRight
                level={2}
                vRigthNumLimit={100}
                height={'100%'}
                leftChildren={
                  <MiddleWaitData
                    originalData={originalData}
                    selectIds={selectedDataIds}
                    searchWordFn={searchWordFn}
                    updateSelectIdsFn={updateSelectIdsFn}
                    selectedDatas={selectedDatas}
                    idKey="id"
                    nameKey="roleName"
                    selectedNodeId={selectedNodeId}
                    searchWordHint="请输入角色名称"
                    selectButtonType={selectButtonType}
                  />
                }
                rightChildren={
                  <RightSelectData
                    selectedDatas={selectedDatas}
                    idKey="id"
                    nameKey="roleName"
                    columns={renderCol(orgUserType, closeTag)}
                    closeTag={closeTag}
                  />
                }
              />
            }
          />
        ) : (
          <ReSizeLeftRight
            lineTop={31}
            suffix={containerId}
            level={1}
            height={'100%'}
            leftChildren={leftRender(
              true,
              selectedDataIds,
              orgUserType,
              orgUserType == 'ORG'
                ? '请输入单位名称、编码'
                : '请输入单位/部门名称、编码',
              true
            )}
            rightChildren={
              <RightSelectData
                selectedDatas={selectedDatas}
                idKey="nodeId"
                nameKey="nodeName"
                columns={renderCol(orgUserType, closeTag)}
                closeTag={closeTag}
              />
            }
          />
        )}
      </div>
    )
  }
)
RelevanceModal.propTypes = {
  /**
   * 加载类型
   */
  orgUserType: PropTypes.string.isRequired,
  /**
   * 选择的按钮类型
   */
  selectButtonType: PropTypes.string,
  /**
   * 原先选择的数据
   */
  defaultSelectedDataIds: PropTypes.array,
  /**
   * 唯一的id,不加的话左右拖拽会有问题
   */
  containerId: PropTypes.string,
}
RelevanceModal.defaultProps = {
  selectButtonType: 'checkBox',
  defaultSelectedDataIds: [],
}
export default RelevanceModal
