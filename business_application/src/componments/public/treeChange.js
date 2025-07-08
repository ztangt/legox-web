/*
 * @Author: gaohy gaohy@suirui.com
 * @Date: 2022-04-28 17:41:06
 * @LastEditors: gaohy gaohy@suirui.com
 * @LastEditTime: 2022-06-16 21:00:34
 * @FilePath: \WPX\business_application\src\componments\public\treeChange.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 此函数用来增加左侧树
export function plusUpdateTreeData(list, key, addNodes) {

    return list.map((item) => {
        if (item.key === key) {
            if (item.children != undefined) {
                let newChildren = item.children;
                newChildren.push(addNodes);
                return { ...item, children: newChildren };
            } else {
                item.isLeaf = false;
                let newChildren = { ...item, children: [] };
                newChildren.children.push(addNodes);
                return { ...item, children: plusUpdateTreeData(newChildren.children, key, addNodes) }
            }
        }
        if (item.children) {
            return { ...item, children: plusUpdateTreeData(item.children, key, addNodes) };
        }

        return item;
    });
};

// 此函数用来删除左侧树
export function minusUpdateTreeData(treeData, level) {
    let levels = (level+'').split(',');
    levels.map((item) => {
        treeData.map((v, i) => {
            if (v.key == item) {
                treeData.splice(i, 1);
            }
            if (v.children) {
                minusUpdateTreeData(v.children, level);
            } else {
                return v;
            }

            if (v.children.length == 0) {
                v.isLeaf = true;
                delete v.children;
            }
        });
    });
    return treeData;
}
//此函数用来配合tree组件的onLoadData事件使用,异步加载
export function updateTreeData(list, key, children) {
    return list.map((item) => {
        if (item.key === key) {
            if(!Array.isArray(children)&&item.title!=children){
                item.title = children
                return {...item,children}
            }
            return { ...item, children };
        }

        if (item.children) {
            return { ...item, children: updateTreeData(item.children, key, children) };
        }

        return item;
    });
};


export function updateTreeDataAfterRename(arr, id, dirName) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].key === id) {
      arr[i].title = dirName;
      return;
    }
    if (arr[i].children) {
      updateTreeDataAfterRename(arr[i].children, id, dirName);
    }
  }
}

// export function CopyTreeData(list, rows) {
//     return list.map((item) => {
//         return rows.map((v) => {
//             if (item.key == v.key) { 

//             }
//         })
//     })
// }