import deepcopy from "deepcopy";
import { ElButton, ElTag } from "element-plus";
import { defineComponent, computed } from "vue";
import { $tableDialog } from "@/components/tableDialog";

export default defineComponent({
    props: {
        propConfig: { type: Object },
        modelValue: { type: Array }
    },
    emits: ['update:modelValue'],
    setup(props, ctx) {
        const data = computed({
            get() {
                return props.modelValue || []
            },
            set(newValue) {
                ctx.emit('update:modelValue', deepcopy(newValue))
            }
        })
        const add=()=>{
            $tableDialog({
                config:props.propConfig,
                data:data.value,
                onConfirm(value){
                    data.value=value
                }
            })
        }
        return () => {
            return <div>
                {(data.value||[])&&data.value.map((item)=>{
                    return <ElTag onClick={add} class='pointer'>{item[props.propConfig.table.key]}</ElTag>
                })}
                {!data.value ||data.value.length==0 && <ElButton onClick={add}>添加</ElButton>}
            </div>
        }
    }
})