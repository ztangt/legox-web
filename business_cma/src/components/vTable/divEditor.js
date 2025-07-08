export default class EditorDiv {
    editorConfig = {};
    container;
    successCallback;
    element;
    oldValue;

    constructor(editorConfig) {
        this.editorConfig = editorConfig;
    }

    createElement() {
        const divDom = document.createElement('div');
        divDom.style.position = 'absolute';
        divDom.style.paddingLeft = '15px';
        divDom.style.paddingRight = '15px';
        divDom.style.width = '100%';
        divDom.style.boxSizing = 'border-box';
        divDom.style.background = '#fff';
        divDom.style.display = 'flex';
        divDom.style.alignItems = 'center';
        divDom.style.border = '1px solid #1890ff';
        divDom.style.fontSize = '14px';
        divDom.style.color = '#333';
        divDom.style.wordBreak = 'break-all';
        divDom.style.lineHeight = '20px';
        this.element = divDom;
        this.container.appendChild(divDom);
    }

    /**
     * @param {string} value
     */
    setValue(value) {
        this.element.innerText = typeof value !== 'undefined' ? value : '';
    }

    getValue() {
        return this.oldValue;
    }

    onStart(sed) {
        let { value, referencePosition, container, endEdit, col, row } = sed;
        this.container = container;
        this.successCallback = endEdit;
        if (!this.element) {
            this.createElement();
            if (value !== undefined && value !== null) {
                //保存原来的value
                this.oldValue = value;
                console.log(value, '原来的值');
                if (this.editorConfig.vTableRef) {
                    value = this.editorConfig.vTableRef.getCellValue(col, row);
                    console.log(value, '现在的值');
                }
                this.setValue(value);
            }
            if (referencePosition?.rect) {
                this.adjustPosition(referencePosition.rect);
            }
        }
    }

    adjustPosition(rect) {
        this.element.style.top = rect.top + 'px';
        this.element.style.left = rect.left + 'px';
        this.element.style.width = rect.width + 'px';
        this.element.style.height = rect.height + 'px';
    }

    endEditing() {
        // do nothing
    }

    onEnd() {
        // do nothing
        this.oldValue = '';
        this.container.removeChild(this.element);
        this.element = undefined;
    }

    isEditorElement(target) {
        return target === this.element;
    }
}
