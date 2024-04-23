import { reactive } from "vue"
import { events } from "./event"

export function BlockFocusTwice(focusData, lastSelectIndex,data) {
    let dragdata = {
        startX: 0,
        startY: 0,
        dragging:false
    }
    let markLine=reactive({
        x:null,y:null
    })
    const itemmousedown = (e) => {
        const {width:BWidth,height:BHeight}=lastSelectIndex.value
        dragdata = {
            startX: e.clientX,
            startY: e.clientY,
            stratLeft:lastSelectIndex.value.left,
            stratTop:lastSelectIndex.value.top,
            dragging:false,
            startPos: focusData.value.focus.map(({ top, left }) => ({ top, left })),
            // 辅助线
            lines:(()=>{
                const {unfocus}=focusData.value
                // 存储辅助线的位置
                let lines={x:[],y:[]}
                unfocus.forEach((block)=>{
                    const{top:ATop,left:ALeft,width:AWidth,height:AHeight}=block
                    // 竖轴
                    lines.y.push({showTop:ATop,top:ATop})
                    lines.y.push({showTop:ATop,top:ATop-BHeight})
                    lines.y.push({showTop:ATop,top:ATop-BHeight/2})
                    lines.y.push({showTop:ATop+AHeight/2,top:ATop+AHeight/2-BHeight/2})
                    lines.y.push({showTop:ATop+AHeight,top:ATop+AHeight-BHeight})
                    lines.y.push({showTop:ATop+AHeight,top:ATop+AHeight})
                    lines.y.push({showTop:ATop+AHeight,top:ATop+AHeight-BHeight/2})
                    // 横轴
                    lines.x.push({showLeft:ALeft,left:ALeft})
                    lines.x.push({showLeft:ALeft,left:ALeft-BWidth})
                    lines.x.push({showLeft:ALeft,left:ALeft-BWidth/2})
                    lines.x.push({showLeft:ALeft+AWidth/2,left:ALeft+AWidth/2-BWidth/2})
                    lines.x.push({showLeft:ALeft+AWidth,left:ALeft+AWidth-BWidth})
                    lines.x.push({showLeft:ALeft+AWidth,left:ALeft+AWidth})
                    lines.x.push({showLeft:ALeft+AWidth,left:ALeft+AWidth-BWidth/2})

                })
                return lines
            })()
        }
        document.addEventListener('mousemove', mousemove)
        document.addEventListener('mouseup', mouseup)
    }
    const mouseup = (e) => {
        // 去除辅助线
        markLine.x=null
        markLine.y=null
        document.removeEventListener('mousemove', mousemove)
        document.removeEventListener('mouseup', mouseup)
        if(dragdata.dragging){
            events.emit('end')
            dragdata.dragging=false
        }
    }
    const mousemove = (e) => {
        const {width:BWidth,height:BHeight}=lastSelectIndex.value
        let {
            clientX: moveX,
            clientY: moveY
        } = e
        if(!dragdata.dragging){
            dragdata.dragging=true
            events.emit('start')
        }
        let left=moveX-dragdata.startX+dragdata.stratLeft
        let top=moveY-dragdata.startY+dragdata.stratTop
        let y=null
        for(let i=0;i<dragdata.lines.y.length;i++){
            const{top:t,showTop:s}=dragdata.lines.y[i]
            if(Math.abs(top-t)<5){
                y=s
                moveY=dragdata.startY-dragdata.stratTop+t
                break
            }
        }
        let x=null
        for(let i=0;i<dragdata.lines.x.length;i++){
            const{left:l,showLeft:s}=dragdata.lines.x[i]
            if(Math.abs(left-l)<5){
                x=s
                moveX=dragdata.startX-dragdata.stratLeft+l
                break
            }
        }
        // 形成辅助线
        markLine.x=x
        markLine.y=y
        let nowLeft = moveX - dragdata.startX
        let nowTop = moveY - dragdata.startY
        focusData.value.focus.forEach((block, index) => {
            block.top = dragdata.startPos[index].top + nowTop
            block.left = dragdata.startPos[index].left + nowLeft
            if(block.left<=0){
                block.left=0
            }else if(block.left>=data.value.container.width-BWidth){
                block.left=data.value.container.width-BWidth
            }
            if(block.top<=0){
                block.top=0
            }else if(block.top>=data.value.container.height-BHeight){
                block.top=data.value.container.height-BHeight
            }
        })
    }
    
    return {
        itemmousedown,
        markLine
    }
}