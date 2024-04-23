import { defineComponent, inject, reactive, watch } from "vue";
import { ElButton, ElInput, ElForm, ElInputNumber, ElColorPicker, ElOption, ElSelect, ElFormItem, ElRow } from 'element-plus'
import deepcopy from "deepcopy";
import TableEditor from '@/package/tableEditor'
import {getObjectUrl} from '../utils/photo'
import  mitts  from '../utils/mitt.js'; 
export default defineComponent({
    props: {
        block: { type: Object },
        data: { type: Object },
        updateBlock: { type: Function },
        updateContent: { type: Function },
    },
    setup(props) {
        const config = inject('config')
        const state = reactive({
            editData: {},
        })
        function photoView(){
            const item=getObjectUrl(document.getElementById('file').files[0])
            props.block.url=item
        }
        const reset = () => {
            if (!props.block) {
                state.editData = deepcopy(props.data.container)
            } else {
                state.editData = deepcopy(props.block)
            }
        }
        const apply = () => {
            if (!props.block) {
                props.updateContent({ ...props.data, container: state.editData })
            } else {
                props.updateBlock(state.editData, props.block)
            }
        }
        watch(() => props.block, reset, { immediate: true })
        return () => {
            const content = []
            if (props.block) {

                const component = config.componentMap[props.block.key]
                if (component && component.props) {
                    content.push(Object.entries(component.props).map(([propName, propConfig]) => {
                        return <ElFormItem label={propConfig.label}>
                            {{
                                input: () =><ElInput v-model={state.editData.props[propName]}></ElInput>,
                                color: () => <ElColorPicker v-model={state.editData.props[propName]}></ElColorPicker>,
                                bgColor: () => <ElColorPicker v-model={state.editData.props[propName]}></ElColorPicker>,
                                borderSize: () => <ElInput  v-model={state.editData.props[propName]}></ElInput>,
                                borderColor: () => <ElColorPicker v-model={state.editData.props[propName]}></ElColorPicker>,
                                borderType: () => <ElColorPicker v-model={state.editData.props[propName]}></ElColorPicker>,
                                select: () => <ElSelect v-model={state.editData.props[propName]}>
                                    {propConfig.options.map(opt => {
                                        return <ElOption label={opt.label} value={opt.value}></ElOption>
                                    })}
                                </ElSelect>,
                                table: () => <TableEditor propConfig={propConfig} v-model={state.editData.props[propName]}></TableEditor>,
                                file:()=><input type="file" id="file"  onChange={photoView}></input>
                            }[propConfig.type]()}
                        </ElFormItem>
                    }))
                }
                if (component && component.model) {
                    content.push(Object.entries(component.model).map(([propName, label]) => {
                        return <ElFormItem label={label}>
                            <ElInput v-model={state.editData.model[propName]}></ElInput>
                        </ElFormItem>
                    }))

                }
            } else {
                content.push(<>
                    <ElFormItem label='容器宽度'>
                        <ElInputNumber v-model={state.editData.width}></ElInputNumber>
                    </ElFormItem>
                    <ElFormItem label='容器高度'>
                        <ElInputNumber v-model={state.editData.height}></ElInputNumber>
                    </ElFormItem>
                </>)
            }
            return <ElForm labelPosition='top' style='padding:30px'>
                {content}
                <ElFormItem>
                    <ElButton onClick={() => apply()} type='primary'>应用</ElButton>
                    <ElButton onClick={reset}>重置</ElButton>
                </ElFormItem>
            </ElForm>
        }
    }
})

