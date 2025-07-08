import { DownOutlined } from '@ant-design/icons';
import { Button, Menu } from 'antd';
import { useEffect, useState } from 'react';
import IconFont from '../../../../Icon';
const ButtonList = ({
  currentOrgNode,
  buttonList,
  buttonFn,
  buttonDisable,
}) => {
  const [disableButtonIds, setDisableButtonIds] = useState([]);
  useEffect(() => {
    if (currentOrgNode.isLock != '1' && disableButtonIds.length) {
      //解锁的时候要清空按钮的禁止状态
      setDisableButtonIds([]);
    }
  }, [currentOrgNode]);
  const buttonMenu = (group) => {
    return (
      <Menu>
        {group.map((item) => {
          if (item.buttonCode != 'update' && item.showRow != 1) {
            return (
              <Menu.Item
                key={item.id}
                onClick={() => {
                  buttonFn(item, '');
                }}
              >
                <span>{item.buttonName}</span>
              </Menu.Item>
            );
          }
        })}
      </Menu>
    );
  };

  const renderButtons = () => {
    // console.log('buttonList:', buttonList);
    return (
      buttonList &&
      Object.keys(buttonList).map((key) => {
        if (!key || key == 'null') {
          return buttonList[key]
            .filter((item) => {
              return item.id;
            })
            .filter((item) => {
              return item.showRow != 1;
            })
            .map((item, index) => {
              if (item.buttonCode != 'update')
                return (
                  <Button
                    type="primary"
                    onClick={() => {
                      buttonFn(item, '');
                    }}
                    disabled={isDisabledFn(item.id)}
                    key={`${item.buttonCode}-${index}`}
                    icon={
                      item.buttonIcon && (
                        <IconFont
                          className="iconfont"
                          type={`icon-${item.buttonIcon}`}
                        />
                      )
                    }
                  >
                    {item.buttonName}
                  </Button>
                );
            });
        } else {
          return buttonList[key].filter((item) => {
            return item.showType == 2 && item.showRow != 1;
          }).length === 0 ? null : (
            <Dropdown overlay={buttonMenu(buttonList[key])} placement="bottom">
              <Button className={styles.dropButton}>
                {key}
                <DownOutlined />
              </Button>
            </Dropdown>
          );
        }
      })
    );
  };
  //是否置灰
  const isDisabledFn = (buttonId) => {
    if (buttonDisable || disableButtonIds.includes(buttonId)) {
      return true;
    } else {
      return false;
    }
  };
  return <>{renderButtons()}</>;
};
export default ButtonList;
