

import EditorDetail from './Editor-detail';
import { computed, defineComponent, inject, onMounted, reactive, ref } from 'vue';
import './editor.less'
import deepcopy from 'deepcopy';
import { dragMenu } from './DragMenu';
import { BlockFocus } from './BlockFocus';
import { BlockFocusTwice } from './BlockfocusTwice';
import { useCommand } from './useCommand';
import { Download } from './Download';
import { $dialog } from '../components/dialog'
import EditorOperator from './EditorOperator'
import classNames from 'classnames';
import { ElButton } from 'element-plus'
import { ElNotification } from 'element-plus';

import { Moon, Sunny } from '@element-plus/icons-vue'
import { saveAs } from 'file-saver'
import { insertContent } from '../api/apis/index'
import useUserStore from "@/store/modules/user";

export default defineComponent({
    name: 'Home',
    props: {
        modelValue: { type: Object },
        FormData: { type: Object }

    },
    emits: ['update:modelValue'],
    components: {
        EditorDetail
    },
    setup(props, ctx) {
        const useStore = useUserStore();

        const previewRef = ref(false)
        const isDarkRef = ref(false)
        const data = computed({
            get() {
                return props.modelValue
            },
            set(newValue) {
                ctx.emit('update:modelValue', deepcopy(newValue))
            }
        })
        const containerStyle = computed(() => {
            return {
                width: data.value.container.width + 'px',
                height: data.value.container.height + 'px'
            }
        })
        onMounted( async()=>{
            await useStore.userInfo()
            data.value=JSON.parse(useStore.JsonData.data_json);
        })
        const change = () => {
            isDarkRef.value ? document.getElementById('html').removeAttribute("class") : document.getElementById('html').setAttribute("class", "dark")
            isDarkRef.value = !isDarkRef.value
        }
        const config = inject('config')
        const containerRef = ref(null)
        const editorRef = ref(false)
        //实现元素获取焦点
        const { cantainermousedown, onMousedown, focusData, lastSelectBlock, clearBlock } = BlockFocus(data, previewRef, (e) => {
            itemmousedown(e)
        })
        // 实现拖拽功能
        const { dragStart, dragend } = dragMenu(data, containerRef)
        const { itemmousedown, markLine } = BlockFocusTwice(focusData, lastSelectBlock, data)
        const { commands } = useCommand(data, focusData)
        const { PNGDownload, JSONDownload } = Download()
        // 实现头部功能按钮
        const buttons = [
            { label: '撤销', icon: 'icon-back', handler: () => commands.undo() },
            { label: '重新', icon: 'icon-forward', handler: () => commands.redo() },
            {
                label: '导出', icon: 'icon-daochu', handler: () => {
                    $dialog({
                        title: 'json数据导出',
                        content: JSON.stringify(data.value)
                    })

                }
            },
            {
                label: '导入', icon: 'icon-daoru', handler: () => {
                    $dialog({
                        title: 'json数据导入',
                        footer: true,
                        onConfirm(text) {
                            commands.updateContent(JSON.parse(text))
                        }
                    })
                }
            },
            { label: '置顶', icon: 'icon-top', handler: () => { commands.placeTop() } },
            { label: '置底', icon: 'icon-bottom', handler: () => { commands.placeBottom() } },
            { label: '删除', icon: 'icon-delete', handler: () => { commands.delete() } },
            { label: '清空', icon: 'icon-delete', handler: () => { commands.deleteAll() } },
            {
                label: '预览', icon: 'icon-jurassic_edit-form', handler: () => {
                    editorRef.value = !editorRef.value
                    clearBlock()
                }
            },
            {
                label: '下载json', icon: 'icon-xiazai', handler: () => {
                    JSONDownload(JSON.stringify(data.value))
                }
            },
            {
                label: '保存', icon: 'icon-xiazai', handler: () => {
                    insertContent({ json: JSON.stringify(data.value), userId: useStore.userId })
                    ElNotification({
                        type: 'success',
                        title: `保存成功`
                    });
                }
            },
            {
                label: 'PNG导出', icon: 'icon-xiazai', handler: () => {
                    const ele = document.getElementById('ExportPNG');
                    PNGDownload(ele)
                }
            },


        ]
        return () => editorRef.value ?
            <>
                <div class="editor-middle-container">
                    <div class="editor-middle-container-content" style={containerStyle.value} ref={containerRef}>
                        {
                            (data.value.blocks.map((block, index) => (

                                <EditorDetail

                                    class={classNames({
                                        'editor-item-focus': block.focus,
                                        'editor-item-no-perview': previewRef.value
                                    })}
                                    FormData={props.FormData}
                                    block={block}
                                ></EditorDetail>
                            )))
                        }

                    </div>
                </div>
                <div class='close-content'>
                    <ElButton type="primary" onClick={() => editorRef.value = false}>继续编辑</ElButton>
                    {JSON.stringify(props.FormData)}

                </div>
            </> : <>
                <div class="editor dark">
                    <div class="editor-left">
                        <div class="editor-left-head">
                            <div class="editor-left-head-user"></div>
                            <span>{useStore.username}</span>
                            {useStore.username?<router-link class="editor-left-head-layout" to='/Login'>退出登录</router-link>:''}
                        </div>
                        <div class="editor-left-content">
                            <div class="editor-left-top"><i class='icon-zujian'></i><span>组件区</span></div>

                            {
                                (config.componentList.map(component => {
                                    return (
                                        <div
                                            class='editor-left-item'
                                            draggable
                                            onDragstart={e => dragStart(e, component)}
                                            onDragend={dragend}
                                        >
                                            <span>{component.label}</span>
                                            <div>{component.preview()}</div>
                                        </div>
                                    )
                                }
                                ))
                            }
                        </div>

                    </div>
                    {/* 头部功能按钮区 */}
                    <div class="editor-middle">
                        <div class="editor-middle-top">
                            {buttons.map((block) => {
                                const icon = typeof block.icon == 'function' ? block.icon() : block.icon
                                const label = typeof block.label == 'function' ? block.label() : block.label
                                return <div class='editor-middle-top-title' onClick={block.handler}>
                                    <i class={icon} style='margin-right: 3px'></i>
                                    <span>{label}</span>
                                </div>
                            })}
                            <el-switch class='editor-middle-top-changeLight'
                                model-value={isDarkRef.value}
                                onClick={change}
                                active-icon={Sunny}
                                inactive-icon={Moon}
                                inline-prompt
                            />
                        </div>
                        {/* 内容区 */}
                        <div
                            class="editor-middle-container"
                            onMousedown={cantainermousedown}
                        >

                            <div class="editor-middle-container-content" id='ExportPNG' style={containerStyle.value} ref={containerRef}>
                                {data.value.blocks.length == 0 && <div class='beforeEditor'>请从左侧组件区拖取组件到此区域</div>}

                                {
                                    (data.value.blocks.map((block, index) => (

                                        <EditorDetail

                                            class={classNames({
                                                'editor-item-focus': block.focus,
                                                'editor-item-no-perview': previewRef.value
                                            })}
                                            FormData={props.FormData}
                                            block={block}
                                            onMousedown={(e) => onMousedown(e, block, index)}
                                            lastSelectBlock={lastSelectBlock.value}
                                        ></EditorDetail>
                                    )))
                                }
                                {/* 虚线 */}
                                {markLine.x !== null && <div class="line-x" style={{ left: markLine.x + 'px' }}></div>}
                                {markLine.y !== null && <div class="line-y" style={{ top: markLine.y + 'px' }}></div>}
                            </div>
                        </div>

                    </div>
                    <div class="editor-right dark">
                        <div class="editor-right-top">组件属性</div>
                        <EditorOperator
                            block={lastSelectBlock.value}
                            data={data.value}
                            updateBlock={commands.updateBlock}
                            updateContent={commands.updateContent}
                        ></EditorOperator>
                    </div>
                </div></>




    }
})
