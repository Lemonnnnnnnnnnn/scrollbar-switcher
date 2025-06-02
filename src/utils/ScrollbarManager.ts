export class ScrollbarManager {
  private static instance: ScrollbarManager | null = null
  private isHidden: boolean = false
  private originalOverflow: string = ''
  private originalScrollbarGutter: string = ''

  private constructor() {
    this.originalOverflow = document.documentElement.style.overflow || ''
    this.originalScrollbarGutter = document.documentElement.style.scrollbarGutter || ''
  }

  /**
   * 获取单例实例
   */
  static getInstance(): ScrollbarManager {
    if (!ScrollbarManager.instance) {
      ScrollbarManager.instance = new ScrollbarManager()
    }
    return ScrollbarManager.instance
  }

  /**
   * 隐藏滚动条但保持滚动功能
   */
  hideScrollbar(): void {
    if (this.isHidden) return

    const documentElement = document.documentElement
    const body = document.body

    // 保存原始样式
    this.originalOverflow = documentElement.style.overflow || getComputedStyle(documentElement).overflow
    this.originalScrollbarGutter = documentElement.style.scrollbarGutter || getComputedStyle(documentElement).scrollbarGutter

    // 设置样式隐藏滚动条但保持滚动功能
    documentElement.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    
    // 使用 scrollbar-gutter 保持布局稳定（如果浏览器支持）
    if ('scrollbarGutter' in documentElement.style) {
      documentElement.style.scrollbarGutter = 'stable'
    }

    // 添加自定义样式来隐藏滚动条
    this.addHideScrollbarStyles()

    this.isHidden = true
    console.log('Scrollbar hidden')
  }

  /**
   * 显示滚动条
   */
  showScrollbar(): void {
    if (!this.isHidden) return

    const documentElement = document.documentElement
    const body = document.body

    // 恢复原始样式
    documentElement.style.overflow = this.originalOverflow
    body.style.overflow = ''
    documentElement.style.scrollbarGutter = this.originalScrollbarGutter

    // 移除自定义样式
    this.removeHideScrollbarStyles()

    this.isHidden = false
    console.log('Scrollbar shown')
  }

  /**
   * 切换滚动条显示状态
   */
  toggle(): boolean {
    if (this.isHidden) {
      this.showScrollbar()
    } else {
      this.hideScrollbar()
    }
    return this.isHidden
  }

  /**
   * 获取当前滚动条状态
   */
  isScrollbarHidden(): boolean {
    return this.isHidden
  }

  /**
   * 添加隐藏滚动条的样式
   */
  private addHideScrollbarStyles(): void {
    const styleId = 'scrollbar-manager-styles'
    if (document.getElementById(styleId)) return

    const style = document.createElement('style')
    style.id = styleId
    style.textContent = `
      /* 隐藏滚动条但保持滚动功能 */
      html::-webkit-scrollbar {
        display: none !important;
      }
      
      html {
        -ms-overflow-style: none !important;
        scrollbar-width: none !important;
      }
      
      body::-webkit-scrollbar {
        display: none !important;
      }
      
      body {
        -ms-overflow-style: none !important;
        scrollbar-width: none !important;
      }

      /* 保持页面可以滚动 */
      html, body {
        overflow: auto !important;
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }

      html::-webkit-scrollbar,
      body::-webkit-scrollbar {
        width: 0 !important;
        height: 0 !important;
        display: none !important;
      }
    `
    document.head.appendChild(style)
  }

  /**
   * 移除隐藏滚动条的样式
   */
  private removeHideScrollbarStyles(): void {
    const styleElement = document.getElementById('scrollbar-manager-styles')
    if (styleElement) {
      styleElement.remove()
    }
  }

  /**
   * 重置到初始状态
   */
  reset(): void {
    if (this.isHidden) {
      this.showScrollbar()
    }
  }
} 