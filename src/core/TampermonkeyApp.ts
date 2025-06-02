import { App, createApp, h } from 'vue'

export interface TampermonkeyAppConfig {
  containerId: string
  containerClass?: string
  rootComponent: any
  mountTarget?: HTMLElement | string
}

export class TampermonkeyApp {
  private app: App | null = null
  private container: HTMLElement | null = null
  private config: TampermonkeyAppConfig

  constructor(config: TampermonkeyAppConfig) {
    this.config = config
  }

  /**
   * 创建容器DOM节点
   */
  private createContainer(): HTMLElement {
    const container = document.createElement('div')
    container.id = this.config.containerId
    if (this.config.containerClass) {
      container.className = this.config.containerClass
    }
    
    // 设置默认样式，确保不影响页面布局
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      pointer-events: none;
      z-index: 999999;
    `
    
    return container
  }

  /**
   * 获取挂载目标
   */
  private getMountTarget(): HTMLElement {
    if (this.config.mountTarget) {
      if (typeof this.config.mountTarget === 'string') {
        const target = document.querySelector(this.config.mountTarget) as HTMLElement
        if (!target) {
          throw new Error(`Mount target "${this.config.mountTarget}" not found`)
        }
        return target
      }
      return this.config.mountTarget
    }
    return document.body
  }

  /**
   * 初始化并挂载应用
   */
  mount(): void {
    if (this.app) {
      console.warn('App is already mounted')
      return
    }

    try {
      // 创建容器
      this.container = this.createContainer()
      
      // 添加到目标元素
      const mountTarget = this.getMountTarget()
      mountTarget.appendChild(this.container)

      // 创建 Vue 应用实例
      this.app = createApp({
        render: () => h(this.config.rootComponent)
      })

      // 挂载应用
      this.app.mount(this.container)
      
      console.log('Tampermonkey app mounted successfully')
    } catch (error) {
      console.error('Failed to mount tampermonkey app:', error)
    }
  }

  /**
   * 卸载应用
   */
  unmount(): void {
    if (this.app) {
      this.app.unmount()
      this.app = null
    }

    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container)
      this.container = null
    }

    console.log('Tampermonkey app unmounted')
  }

  /**
   * 等待页面加载完成
   */
  static waitForPageLoad(): Promise<void> {
    return new Promise((resolve) => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => resolve())
      } else {
        resolve()
      }
    })
  }

  /**
   * 静态方法：创建并自动挂载应用
   */
  static async create(config: TampermonkeyAppConfig): Promise<TampermonkeyApp> {
    await TampermonkeyApp.waitForPageLoad()
    
    const app = new TampermonkeyApp(config)
    app.mount()
    
    return app
  }
} 