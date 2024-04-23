import deepcopy from "deepcopy"
import { events } from "./event"
import { onUnmounted } from "vue"

export function useCommand(data,focusData){
    const state={ //前进后退需要的指针
        current:-1,//前进后退需要的索引值
        queue:[],//存放所有的操作命令
        commands:{},//操作命令和执行功能的映射
        commandArray:[],
        destoryArry:[]
    }
    const registry=(command)=>{
        state.commandArray.push(command)
        state.commands[command.name]=(...args)=>{
            const {redo,undo}=command.execute(...args)
            redo()

            if(!command.pushQueue){
                return
            }
            let {queue,current}=state
            if(queue.length>0){
                // 截取当前渲染的blocks
                queue=queue.slice(0,current+1)
                state.queue=queue
            }
            // 存放当前block的撤销和恢复方法，调用即为撤销恢复此block
            state.queue.push({redo,undo})
            state.current=current+1

        }
        
    }
    // 恢复
    registry({
        name:'redo',
        keyborad:'ctrl+y',
        execute(){
            return{
                redo(){
                    let item=state.queue[state.current+1]
                    if(item){
                        item.undo&&item.redo()
                        state.current++
                    }
                }
            }
        }
    })
    // 撤销
    registry({
        name:'undo',
        keyborad:'ctrl+z',
        execute(){
            return{
                redo(){
                    let item=state.queue[state.current]
                    if(item){
                        item.undo&&item.undo() 
                        state.current--
                    }
                }
            }
        }
    })
    // 拖拽
    registry({
        name:'drag',
        pushQueue:true,
        init(){
            this.before=null
            const start=()=>{
                this.before=deepcopy(data.value.blocks)
            }
            const end=()=>state.commands.drag()
            events.on('start',start)
            events.on('end',end)
            return ()=>{
                events.off('start',start)
                events.off('end',end)
            }
        },
        execute(){
            let before=this.before
            let after=data.value.blocks
            return{
                
                redo(){
                    data.value={...data.value,blocks:after}
                },
                undo(){
                    data.value={...data.value,blocks:before}
                }
            }
        }
    });
    // 更新容器
    registry({
        name:'updateContent',
        pushQueue:true,
        execute(newValue) {
            let state = {
                before: data.value, // 当前的值
                after: newValue // 新值
            }
            return {
                redo: () => {
                    data.value = state.after
                },
                undo: () => {
                    data.value = state.before
                }
            }
        }
    });
    // 更新某个组件
    registry({
        name: 'updateBlock', 
        pushQueue: true,
        execute(newBlock, oldBlock) {
            let state = {
                before: data.value.blocks,
                after: (() => {
                    let blocks = [...data.value.blocks]; // 拷贝一份用于新的block
                    const index = data.value.blocks.indexOf(oldBlock); // 找老的 需要通过老的查找
                    if (index > -1) {
                        // 替换更改的block
                        blocks.splice(index, 1, newBlock)
                    }
                    return blocks;
                })()
            }
            return {
                redo: () => {
                    data.value = { ...data.value, blocks: state.after }
                },
                undo: () => {
                    data.value = { ...data.value, blocks: state.before }
                }
            }
        }
    });
    // 置顶
    registry({
        name:'placeTop',
        pushQueue:true,
        execute(){
            let before=deepcopy(data.value.blocks)
            let after=(()=>{
                let {focus,unfocus}=focusData.value
                let MaxZIndex=unfocus.reduce((pre,block)=>{
                    return Math.max(pre,block.zIndex)
                },-Infinity)
                focus.forEach((block)=>{
                    block.zIndex=MaxZIndex+1
                })
                return data.value.blocks
            })()
            return{
                redo(){
                    data.value={...data.value,blocks:after}
                },
                undo(){
                    data.value={...data.value,blocks:before}
                }
            }
        }
    });
    // 置底
    registry({
        name:'placeBottom',
        pushQueue:true,
        execute(){
            let before=deepcopy(data.value.blocks)
            let after=(()=>{
                let {focus,unfocus}=focusData.value
                let MinZIndex=unfocus.reduce((pre,block)=>{
                    return Math.min(pre,block.zIndex)
                },Infinity)-1
                // 避免直接为-1
                if(MinZIndex<0){
                    MinZIndex=0
                    unfocus.forEach((block)=>{
                        block.zIndex+=1
                    })
                }
                
                focus.forEach((block)=>{
                    block.zIndex=MinZIndex
                })
                return data.value.blocks
            })()
            return{
                redo(){
                    data.value={...data.value,blocks:after}
                },
                undo(){
                    data.value={...data.value,blocks:before}
                }
            }
        }
    });
    // 删除
    registry({
        name:'delete',
        pushQueue:true,
        execute(){
            let before=deepcopy(data.value.blocks)
            let after=focusData.value.unfocus
            return{
                redo(){
                    data.value={...data.value,blocks:after}
                },
                undo(){
                    data.value={...data.value,blocks:before}
                }
            }
        }
    });
    // 清空
    registry({
        name:'deleteAll',
        pushQueue:true,
        execute(){
            let before=deepcopy(data.value.blocks)
            let after=[]
            return{
                redo(){
                    data.value={...data.value,blocks:after}
                },
                undo(){
                    data.value={...data.value,blocks:before}
                }
            }
        }
    });
    // 键盘按钮绑定监听
    const keyBoradEvent=(()=>{
        const keyCodes={
            90:'z',
            89:'y'
        }
        const onKeydown=(e)=>{
            let{ctrlKey,keyCode}=e
            let keyString=[]
            if(ctrlKey) keyString.push('ctrl')
            keyString.push(keyCodes[keyCode])
            keyString=keyString.join('+')

            state.commandArray.forEach(({name,keyborad})=>{
                if(!keyborad) return
                if(keyborad==keyString){
                    state.commands[name]()
                    e.preventDefault()
                }
            })
        }
        const init=()=>{
            window.addEventListener('keydown',onKeydown)
            return ()=>{
                window.removeEventListener('keydown',onKeydown)
            }
        }
        return init
    })()
    ;
    (()=>{
        state.destoryArry.push(keyBoradEvent())
        state.commandArray.forEach(command =>command.init&&state.destoryArry.push(command.init()));
    })();
    // 清除绑定的时间
    onUnmounted(()=>{state.destoryArry.forEach(fn=>fn&&fn())})
    return state
    
}