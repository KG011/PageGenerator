import { ElButton, ElInput, ElDialog, ElSelect, ElOption, ElRow } from 'element-plus'
import Range from '../components/range'
import data from '../data.json'
import { ref } from 'vue'
const state = ref(data);
// interface EditorConfig {
//     label: String; //标签
//     key: string; //类型
//     resize?: object
//     preview: () => any;
//     render: (props: any) => any; //返回渲染组件函数
//     props?: Object
//     model?: Object
// }
// class createEditorConfig {
//     public componentList: Array<EditorConfig>
//     public componentMap: Map<string, EditorConfig>
//     constructor(componentList: Array<EditorConfig> = [], componentMap: Map<string, EditorConfig> = new Map()) {
//         this.componentList = componentList
//         this.componentMap = componentMap
//     }
//     register(component: EditorConfig): void {
//         this.componentList.push(component)
//         this.componentMap.set(component.key, component)
//     }


// }
function createEditorConfig() {
    let componentList = []
    let componentMap = []
    return {
        componentList,
        componentMap,
        register: (component) => {
            componentList.push(component)
            componentMap[component.key] = component
        }
    }
}
export const registerConfig =createEditorConfig()
const createInputProp = (label) => ({ type: 'input', label })
const createFileProp = (label) => ({ type: 'file', label })
const createColorProp = (label) => ({ type: 'color', label })
const createSelectProp = (label, options) => ({ type: 'select', label, options })
const createTableProp = (label, table) => ({ type: 'table', label, table })
registerConfig.register({
    label: '文本',
    preview: () => '预览文本',
    render: ({props}) => {
        return (
            <span style={{ color: props.color, fontSize: props.size+'px',fontFamily:props.type }}>{props.text || '渲染文本'}</span>
        )
    },
    key: 'text',
    props: {
        text: createInputProp('文本内容'),
        color: createColorProp('字体颜色'),
        size: createInputProp('字体大小'),
        type: createSelectProp('字体样式', [
            { label: '微软雅黑', value: 'Microsoft YaHei' },
            { label: '宋体', value: 'SimSun' },
            { label: '楷体', value: 'KaiTi' },
            { label: '华文彩云', value: 'STCaiyun' },
            { label: '华文琥珀', value: 'STHupo' },
            { label: '方正姚体', value: 'FZYaoti' },
            { label: '华文行楷', value: 'STXingkai' },
            { label: '华文新魏', value: 'STXinwei' },
            { label: '方正舒体', value: 'FZShuTi' },
        ])
    }

})

registerConfig.register({
    label: '圆',
    resize: {
        width: true,
        height: true
    },
    preview: () => <div style={{height:30+'px',width:30+'px',borderRadius:100+'%',background:'#fff'}}></div>,
    render: ({ props, size }) => {
        const defaultStyle={
           borderRadius:100+'%',border:1+'px solid black',background:"fff",borderColor:props.borderColor
        }
        props.borderSize?defaultStyle.border=props.borderSize+'px solid black':''
        props.bgColor?defaultStyle.background=props.bgColor:defaultStyle.background="#fff"
        props.borderType?defaultStyle.borderStyle=props.borderType:''
        return (
            <div style={size.width ? { width: size.width + 'px', height: size.height + 'px',...defaultStyle} : { width: 50 + 'px', height: 50 + 'px',...defaultStyle}}></div>
        )
    },
    key: 'circle',
    props: {
        borderSize: createInputProp('边框大小'),
        borderColor: createColorProp('边框颜色'),
        borderType: createSelectProp('边框类型',[
            { label: "实线", value: 'solid' },
            { label: "虚线", value: 'dashed' },
            { label: "点状", value: 'dotted' },
            { label: "双线", value: 'double' },
             
        ]),
        bgColor:createColorProp('背景颜色'),
       
    }

})

registerConfig.register({
    label: '矩形',
    resize: {
        width: true,
        height: true
    },
    preview: () => <div style={{height:30+'px',width:30+'px',background:'#fff'}}></div>,
    render: ({ props, size }) => {
        const defaultStyle={
            border:1+'px solid black',background:"fff",borderColor:props.borderColor
         }
         props.borderSize?defaultStyle.border=props.borderSize+'px solid black':''
         props.bgColor?defaultStyle.background=props.bgColor:defaultStyle.background="#fff"
         props.borderType?defaultStyle.borderStyle=props.borderType:''
         props.borderRadius?defaultStyle.borderRadius=props.borderRadius+'px':''
        return (
            <div style={size.width ? { width: size.width + 'px', height: size.height + 'px',...defaultStyle} : { width: 50 + 'px', height: 50 + 'px',...defaultStyle}}></div>
        )
    },
    key: 'rectangle',
    props: {
        borderSize: createInputProp('边框大小'),
        borderColor: createColorProp('边框颜色'),
        borderType: createSelectProp('边框类型',[
            { label: "实线", value: 'solid' },
            { label: "虚线", value: 'dashed' },
            { label: "点状", value: 'dotted' },
            { label: "双线", value: 'double' },
             
        ]),
        borderRadius: createInputProp('边框弧度'),
        bgColor:createColorProp('背景颜色'),
       
    }

})
registerConfig.register({
    label: '按钮',
    resize: {
        width: true,
        height: true
    },
    preview: () => <ElButton>预览按钮</ElButton>,
    render: ({ props, size }) => <ElButton style={{ width: size.width + 'px', height: size.height + 'px' }} type={props.type} size={props.size}>{props.text || '预览按钮'}</ElButton>,
    key: 'button',
    props: {
        text: createInputProp('按钮内容'),
        type: createSelectProp('按钮类型', [
            { label: '基础', value: 'primary' },
            { label: '成功', value: 'success' },
            { label: '警告', value: 'warning' },
            { label: '危险', value: 'danger' },
            { label: '文本', value: 'text' },
        ]),
        size: createSelectProp('按钮大小', [
            { label: '大', value: 'large' },
            { label: '中等', value: 'medium' },
            { label: '小', value: 'small' },
        ])
    }

})
registerConfig.register({
    label: '输入框',
    resize: {
        width: true,
        height: true
    },
    preview: () => <ElInput placeholder='预览输入框'></ElInput>,
    render: ({ model, size }) => <ElInput style={{ width: size.width + 'px', height: size.height + 'px' }} placeholder='渲染输入框' {...model.default}></ElInput>,
    key: 'input',
    model: {
        default: '绑定字段'
    }

})
registerConfig.register({
    label: '范围输入框',
    resize: {
        width: true,
        height: true
    },
    preview: () => <Range></Range>,
    render: ({ model, size }) => {
        return <Range style={{ width: size.width + 'px', height: size.height + 'px' }} {...{
            start: model.start.modelValue,
            'onUpdate:start': model.start['onUpdate:start'],
            end: model.end.modelValue,
            'onUpdate:end': model.end['onUpdate:end'],
        }}></Range>
    },
    key: 'range',
    model: {
        start: '开始值',
        end: '结束值'
    }

})
registerConfig.register({
    label: '下拉选择',
    resize: {
        width: true,
        height: true
    },
    preview: () => <ElSelect></ElSelect>,
    render: ({ props, model, size }) => {
        return <ElSelect style={{ width: size.width + 'px', height: size.height + 'px' }} {...model.default}>{
            (props.options || []).map((item) => {
                return <ElOption label={item.label} value={item.value}></ElOption>
            })
        }</ElSelect>
    },
    props: {
        options: createTableProp('下拉选择框', {
            options: [
                { label: '显示值', field: 'label' },
                { label: '绑定值', field: 'value' },
            ],
            key: 'label'
        })
    },
    model: {
        default: '绑定字段'
    },
    key: 'table'

})
registerConfig.register({
    label: '图片容器',
    resize: {
        width: true,
        height: true
    },
    preview: () => '图片容器',
    render: ({ url, size }) => {
        const ViewImg = ref(true)
        const rowBorder={a:'1px dashed skyblue'}
        if (size.width >= state.value.container.width) {
            size.width = state.value.container.width
        }
        if (JSON.stringify(url) == '[]') {
            ViewImg.value = false
        } else {
            ViewImg.value = true
            rowBorder.a='none'
        }
        return <ElRow style={size.width ? { width: size.width + 'px', height: size.height + 'px',border:rowBorder.a } : { width: 400 + 'px', height: 80 + 'px' ,border:rowBorder.a}}><img src={url} style={{ width: 100 + '%',height: 100 + '%' }} v-show={ViewImg.value}></img></ElRow>
    },
    key: 'row',
    props: {
        photo: createFileProp('上传背景'),
    }

})