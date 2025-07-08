import ContextPadProvider from 'bpmn-js/lib/features/context-pad/ContextPadProvider'
import { assign } from "min-dash";
class EnhancementContextPadProvider  extends ContextPadProvider {
    constructor(
        config,
        injector,
        eventBus,
        contextPad,
        modeling,
        elementFactory,
        connect,
        create,
        popupMenu,
        canvas,
        rules
    ) {
        super(
            config,
            injector,
            eventBus,
            contextPad,
            modeling,
            elementFactory,
            connect,
            create,
            popupMenu,
            canvas,
            rules,
            // translate,
            2000
        )
        this._contextPad = contextPad
        this._modeling = modeling
        this._elementFactory = elementFactory
        this._connect = connect
        this._create = create
        this._popupMenu = popupMenu
        this._canvas = canvas
        this._rules = rules
        config = config || {}
        // this._translate = translate
        if (config.autoPlace !== false) {
            this._autoPlace = injector.get('autoPlace', false);
        }
    }
    

    getContextPadEntries(element) {
        const actions= {}

        const appendAction=(type, className, title, options)=> {
            const appendStart=(event, element)=> {
              let shape = this._elementFactory.createShape(assign({ type: type }, options));
              create.start(event, shape, {
                source: element
              });
            }
        
            const append = this._autoPlace
              ?  (event, element)=> {
                let shape = this._elementFactory.createShape(
                  assign({ type: type }, options)
                );
                this._autoPlace.append(element, shape);
              }
              : appendStart;
        
            return {
              group: "model",
              className: className,
              title: title,
              action: {
                dragstart: appendStart,
                click: append
              }
            };
          }

        // 添加创建用户任务按钮
        actions['append.end-event'] = appendAction(
        "bpmn:EndEvent",
        "bpmn-icon-end-event-none",
        "结束")
        actions['append.start-event'] = appendAction(
            "bpmn:StartEvent",
            "bpmn-icon-start-event-none",
            "开始")
        actions['append.append-user-task'] = appendAction('bpmn:UserTask',"bpmn-icon-user-task",'用户任务')
        actions['append.exclusive-gateway'] = appendAction("bpmn:ExclusiveGateway","bpmn-icon-gateway-xor","互斥网关")
        // actions['append.parallel-gateway'] = appendAction("bpmn:ParallelGateway","bpmn-icon-gateway-parallel","并行网关")
        actions['append.inclusive-gateway'] = appendAction("bpmn:InclusiveGateway","bpmn-icon-gateway-or","包容网关")  
        // 添加一个新分组的自定义按钮
        // actions['enhancement-op'] = {
        //     group: 'enhancement',
        //     className: 'enhancement-op',
        //     title: '扩展操作2',
        //     action: {
        //         click: function (e) {
        //             alert('点击 扩展操作2')
        //         }
        //     }
        // }

        return actions
    }
}
EnhancementContextPadProvider.$inject = [
    "config.contextPad",
    "injector",
    "eventBus",
    "contextPad",
    "modeling",
    "elementFactory",
    "connect",
    "create",
    "popupMenu",
    "canvas",
    "rules",
    "translate"
  ];


export default EnhancementContextPadProvider