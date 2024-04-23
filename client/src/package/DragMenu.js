import { events } from "./event"

export function dragMenu(data, containerRef) {
    let currentComponent = null
    const dragenter = (e) => {
        e.dataTransfer.dropEffect = 'move'
    }
    const dragover = (e) => {
        e.preventDefault()
    }
    const dragleave = (e) => {
        e.dataTransfer.dropEffect = 'none'
    }
    // 添加拖拽的block
    const drop = (e) => {
        let blocks = data.value.blocks
        data.value = {
            ...data.value,
            blocks: [
                ...blocks,
                {
                    top: e.offsetY,
                    left: e.offsetX,
                    zIndex: 1,
                    key: currentComponent.key,
                    alignCenter: true,
                    props:{},
                    model:{},
                    url:''
                }
            ]
        }
        currentComponent = null
    }
    const dragStart = (e, component) => {
        if(!data.value.draging){ 
            return
        }
        containerRef.value.addEventListener('dragenter', dragenter)
        containerRef.value.addEventListener('dragover', dragover)
        containerRef.value.addEventListener('dragleave', dragleave)
        containerRef.value.addEventListener('drop', drop)
        currentComponent = component
        events.emit('start')
    }
    const dragend = () => {
        containerRef.value.removeEventListener('dragenter', dragenter)
        containerRef.value.removeEventListener('dragover', dragover)
        containerRef.value.removeEventListener('dragleave', dragleave)
        containerRef.value.removeEventListener('drop', drop)
        events.emit('end')

    }
    return {
        dragStart,
        dragend
    }

}