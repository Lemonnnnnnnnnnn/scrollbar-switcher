import { TampermonkeyApp } from './core/TampermonkeyApp'
import { APP_CONFIG } from '../config/appConfig'
import App from './App.vue'

// 应用配置
const appConfig = {
  containerId: APP_CONFIG.containerId,
  containerClass: APP_CONFIG.containerClass,
  rootComponent: App
}

// 创建并挂载应用
TampermonkeyApp.create(appConfig).then(app => {
  console.log(`${APP_CONFIG.appName} v${APP_CONFIG.version} loaded successfully`)
  
  // 可选：将应用实例暴露到全局，便于调试或其他脚本访问
  ;(window as any).scrollbarSwitcherApp = app
}).catch(error => {
  console.error(`Failed to load ${APP_CONFIG.appName}:`, error)
}) 