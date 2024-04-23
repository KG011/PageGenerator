import deepcopy from "deepcopy";
import { ElButton, ElDialog, ElInput, ElTable, ElTableColumn } from "element-plus";
import { createVNode, defineComponent, render, reactive } from "vue";
const TableDialog = defineComponent({
    props: {
        option: { type: Object }
    },
    setup(props, ctx) {
        const state = reactive({
            option: props.option,
            isShow: false,
            editData: []
        })
        ctx.expose({
            showDialog(option) {
                state.option = option
                state.isShow = true
                state.editData = deepcopy(option.data)
            }
        })
        const add = () => {
            state.editData.push({})
        }
        const onCancel=()=>{
            state.isShow = false
        }
        const onConfirm=()=>{
            state.option.onConfirm(state.editData)
            state.isShow = false

        }
        return () => {
            return <ElDialog v-model={state.isShow} title={state.option.config.label}>
                {{
                    default: () => {
                        return <div>
                            <div><ElButton onClick={add}>添加</ElButton><ElButton>重置</ElButton></div>
                            <ElTable data={state.editData}>
                                <ElTableColumn type='index'></ElTableColumn>
                                    {state.option.config.table.options.map((item, index) => {
                                        return <ElTableColumn label={item.label}>
                                            {{
                                                default:({row})=>{
                                                    return <ElInput v-model={row[item.field]}></ElInput>
                                                }
                                            }}
                                        </ElTableColumn>
                                    })}
                                
                                <ElTableColumn label='操作' ><ElButton type='danger'>删除</ElButton></ElTableColumn>
                            </ElTable>
                        </div>
                    },
                    footer:()=>{
                        return<>
                        <ElButton onClick={onConfirm}>确定</ElButton><ElButton onClick={onCancel}>取消</ElButton>
                        </>
                    }
                }}
            </ElDialog>
        }
    }
})
let vm;
export function $tableDialog(option) {
    if (!vm) {
        const el = document.createElement('div')
        vm = createVNode(TableDialog, { option })
        document.body.appendChild((render(vm, el), el))
    }
    let { showDialog } = vm.component.exposed
    showDialog(option)
}