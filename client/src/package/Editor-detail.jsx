
import { computed, defineComponent, inject, onMounted, reactive, ref, getCurrentInstance } from 'vue'
import BlockResize from './BlockResize.jsx'
import mitts from '../utils/mitt.js';
import deepcopy from 'deepcopy';

export default defineComponent({
    props: {
        FormData: { type: Object },
        block: { type: Object },
        lastSelectBlock: { type: Object }
    },
    setup(props) {
        const { proxy } = getCurrentInstance()
        const state = reactive({
            UrlPhoto: []
        })
        mitts.on('event', (e) => {
            state.UrlPhoto = e
        })
        const data = reactive({
            transform: 'rotate(0deg)'
        })
        const containerStyle = computed(() => ({
            top: `${props.block.top}px`,
            left: `${props.block.left}px`,
            zIndex: `${props.block.zIndex}`
        }))
        const RowStyle = computed(() => ({
            top: `${props.block.top}px`,
            left: `${props.block.left}px`,
            zIndex: `${props.block.zIndex}`,
            // transform:data.transform
        }))
        const config = inject('config')
        const blockRef = ref(null)
        onMounted(() => {
            let { offsetWidth, offsetHeight } = blockRef.value
            if (props.block.alignCenter) {
                props.block.top = props.block.top - offsetHeight / 2
                props.block.left = props.block.left - offsetWidth / 2
                props.block.alignCenter = false
            }
            props.block.height = offsetHeight
            props.block.width = offsetWidth
        })
        function aa(e) {
            e.preventDefault()
            e.stopPropagation()
            const rect = proxy.$el.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2
            function onMousemove(e) {
                const diffX = centerX - e.clientX
                const diffY = centerY - e.clientY
                const radians = Math.atan2(diffY, diffX) / Math.PI * 180
                data.transform = `rotate(${radians}deg)`
            }
            const onMouseup = (e) => {
                document.removeEventListener('mousemove', onMousemove)
                document.removeEventListener('mouseup', onMouseup)
            }
            document.addEventListener('mousemove', onMousemove)
            document.addEventListener('mouseup', onMouseup)
        }


        return () => {
            const component = config.componentMap[props.block.key]
            const renderComponent = component.render({
                url: props.block.url ? props.block.url : [],
                size: props.block.hasResize ? { width: props.block.width, height: props.block.height } : {},
                props: props.block.props,
                model: Object.keys(component.model || {}).reduce((prev, modelName) => {
                    const propName = props.block.model[modelName]//username
                    prev[modelName] = {
                        modelValue: props.FormData[propName],//大爹无疑
                        "onUpdate:modelValue": v => props.FormData[propName] = v
                    }
                    return prev
                }, {})
            })
            const { width, height } = component.resize || {}
            return <div class='editor-detail' style={!props.block.focus ? { transform: data.transform, ...containerStyle.value } : { transform: data.transform, ...RowStyle.value }} ref={blockRef}>
                {props.block.focus && <span class='rotate icon-xuanzhuan' onMousedown={aa}></span>}
                {renderComponent}
                {props.block.focus && (width || height) && <BlockResize
                    component={component}
                    block={props.block}
                >
                </BlockResize>}
            </div>

        }
    }
})