export function getTeantMark(dispatch) {
    if (!window.location.pathname.split('/')[1]) {
      window.location.href = '#/unset';
      return;
    }
    mark = window.location.pathname.split('/')[1];
    window.localStorage.setItem(
      'tenantMark',
      window.location.pathname.split('/')[1],
    );
    dispatch({
      type: 'user/getTentant',
      payload: {
        tenantMark: window.location.pathname.split('/')[1],
      },
    });
  }
export function toTeantMark(dispatch) {
    if (window.localStorage?.length == 0) {
      getTeantMark(dispatch); //获取租户
      return;
    }
    if (window.localStorage.getItem('unset') == 'true') {
      //localstorage中 （租户是否存在） unset为true 不存在
      if (
        //当前访问租户是否与存在租户相同 不同：获取租户 相同：跳转到404页面
        window.location.pathname.split('/')[1] !=
          window.localStorage.getItem('tenantMark') ||
        !window.localStorage.getItem('tenantMark')
      ) {
        localStorage.setItem('identityId','')
        localStorage.setItem('registerCode','')
        getTeantMark(dispatch); //获取租户
      } else if (
        window.location.pathname.split('/')[1] ==
        window.localStorage.getItem('tenantMark')
      ) {
        window.location.href = '#/unset';
      }
    } else {
      var tenantMark = window.localStorage.getItem('tenantMark') || mark;
      if (
        //当前访问租户与存在租户相同 且存在usertoken 根据当前登录平台跳转到相应页面
        window.location.pathname.split('/')[1] == tenantMark &&
        window.localStorage.getItem('userToken') &&
        window.localStorage.getItem('clientType')
      ) {
        if (
          window.location.href.includes('/business_application') ||
          window.location.href.includes('/support')||
          window.location.href.includes('/mobile')
        ) {
        } else {
          window.location.href = `#/${
            window.localStorage.getItem('clientType') == 'PC'
              ? 'support'
              : 'business_application'
          }`;
        }
      } else if (
        window.location.pathname.split('/')[1] == tenantMark &&
        !window.localStorage.getItem('userToken')
      ) {
        //当前访问租户与存在租户相同 但无usertoken  跳转至登录页
        // window.location.href = '#/login';
        getTeantMark(dispatch);
      } else if (
        //当前访问租户与存在租户不同 重新获取租户
        window.location.pathname.split('/')[1] != tenantMark ||
        !tenantMark
      ) {
        localStorage.setItem('identityId','')
        localStorage.setItem('registerCode','')
        getTeantMark(dispatch);
      }
    }
  }
  function closeAllTabs() {
    // 关闭最后一个标签页退出登录
    window.onbeforeunload = () => {
      let numbers = window.localStorage.getItem('numbers');

      const sesTime = window.sessionStorage.getItem('sesTime');

      const localTime = window.localStorage.getItem('localTime');

      //当localTime 没有值，并且sesTime === localTime，减去当前页。

      if (
        localTime != 'NaN' &&
        localTime != null &&
        sesTime === localTime
      ) {
        numbers = parseInt(numbers) - 1;

        window.localStorage.setItem('numbers', numbers);
      }
    };

    window.onload = () => {
      let time = '';

      let numbers = window.localStorage.getItem('numbers'); //计算打开的标签页数量

      const sesTime = window.sessionStorage.getItem('sesTime');

      const localTime = window.localStorage.getItem('localTime'); //首次登录的时间

      //当numbers无值或者小于0时，为numbers 赋值0

      if (numbers == 'NaN' || numbers === null || parseInt(numbers) < 0) {
        numbers = 0;
      }

      //sesTime || localTime 没有值，并且numbers为0时，清除localStorage里的登录状态，退出到登录页面

      if (
        (sesTime === null ||
          sesTime === 'NaN' ||
          localTime === null ||
          localTime === 'NaN') &&
        parseInt(numbers) === 0
      ) {
        //localStorage.clear();

        sessionStorage.clear();

        //为localTime和sesTime赋值，记录第一个标签页的时间

        time = new Date().getTime();

        window.sessionStorage.setItem('sesTime', time);

        window.localStorage.setItem('localTime', time);

        // router.push('/login');
      }

      //当time ，localTime 有值，并且sesTime != localTime时，为sesTime赋值

      if (
        !time &&
        localTime != 'NaN' &&
        localTime != null &&
        sesTime != localTime
      ) {
        window.sessionStorage.setItem('sesTime', localTime);
      }

      //最后保存当前是第几个标签页

      numbers = parseInt(numbers) + 1;

      window.localStorage.setItem('numbers', numbers);
    };
  }

