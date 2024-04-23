import {
    computed,ref
} from "vue"
export function BlockFocus(data, previewRef,callback) {
    let SelectIndex=ref(-1)
    const lastSelectBlock=computed(()=>{
        return data.value.blocks[SelectIndex.value]
    })
    const clearBlock = () => {
        data.value.blocks.forEach((block) => {
            block.focus = false
        })
        SelectIndex.value=-1
    }

    // 点击获取焦点
    const onMousedown = (e, block,index) => {
        if(previewRef.value) return
        e.preventDefault()
        e.stopPropagation()
        if (e.shiftKey) {
            if (focusData.value.focus.length <= 1) {
                block.focus = true
            } else {
                block.focus = !block.focus
            }
        } else {
            if (!block.focus) {
                clearBlock()
                block.focus = true
            }
        }
        SelectIndex.value=index
        callback(e)
    }

    // 存放获取焦点的元素
    const focusData = computed(() => {
        let focus = []
        let unfocus = []
        data.value.blocks.forEach((block) => {
            (block.focus ? focus : unfocus).push(block)
        })
        return {
            focus,
            unfocus
        }
    })
    const cantainermousedown = () => {
        if(previewRef.value) return
        clearBlock()
        SelectIndex.value=-1
    }
    return {
        cantainermousedown,
        onMousedown,
        focusData,
        lastSelectBlock,
        clearBlock
    }
}