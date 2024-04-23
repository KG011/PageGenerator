import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
export function Download() {
    const JSONDownload = (template) => {
        // 格式
        const filename = 'example.json'
        const blob = new Blob([template], { type: 'text/plain;charset=utf-8' })
        saveAs(blob, filename)
    }
    const PNGDownload = (ele) => {
        html2canvas(ele).then((canvas) => {
            const imgUrl = canvas.toDataURL('image/png');
            const tempLink = document.createElement('a'); // 创建一个a标签
            tempLink.style.display = 'none';
            tempLink.href = imgUrl;
            tempLink.setAttribute('download', '文件名'); // 给a标签添加下载属性
            if (typeof tempLink.download === 'undefined') {
              tempLink.setAttribute('target', '_blank');
            }
            document.body.appendChild(tempLink); // 将a标签添加到body当中
            tempLink.click(); // 启动下载
            document.body.removeChild(tempLink); // 下载完毕删除a标签
            window.URL.revokeObjectURL(imgUrl);
          })
    }

    return {
        JSONDownload,
        PNGDownload
    }
}