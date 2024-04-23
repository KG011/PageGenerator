// 获取图片
export const getObjectUrl=(file)=>{
    let url=null
    if(window.createObjectURL!=undefined){
        url=window.createObjectURL(file)
    }else if(window.URL!=undefined){
        url=window.URL.createObjectURL(file)
    }else if(window.webkitURL!=undefined){
        url=window.webkitURL.createObjectURL(file)
    }
    return url
}