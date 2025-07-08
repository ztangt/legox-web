export const qiankun = {
    // 应用加载之前
    async bootstrap(props: any) {
        // console.log('app1 bootstrap', props);
    },
    // 应用 render 之前触发
    async mount(props: any) {
        //cma给.qiankun-micro-app-container添加高度使其撑起
        let elements = document.querySelectorAll('[id*="__qiankun_microapp_wrapper_for_business_cma_"]');
        elements.forEach(function (element) {
            var parentElement: any = element.parentNode;
            parentElement.style.height = '100%';
            parentElement.style.overflowY = 'auto';
        });
        // console.log('app1 mount', props);
    },
    // 应用卸载之后触发
    async unmount(props: any) {
        // console.log('app1 unmount', props);
    },
};
