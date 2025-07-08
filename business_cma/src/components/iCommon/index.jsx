// 适用于多个组件，通过外部配置传参方式调用
const CommonComponent = (config) => {
    // console.log(config, '????????');
    return (
        <div>
            {
                <config.Com {...config.props} style={{ width: config.width || 120 }}>
                    {config.list &&
                        config.list.length > 0 &&
                        config.list.map((item, index) => (
                            // config.value 可以通过外部配置，例如数据是id，name和当前value和label不一样，是通过配置动态化,无需重新命名
                            <config.Child key={item + index} value={item[config.value]}>
                                {item[config.label]}
                                {config.dept ? item[config.dept] : ''}
                            </config.Child>
                        ))}
                </config.Com>
            }
        </div>
    );
};

export default CommonComponent;
