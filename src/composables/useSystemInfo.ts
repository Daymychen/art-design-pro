import AppConfig from '@/config'

export function useSystemInfo() {
  const getSystemName = () => AppConfig.systemInfo.name

  return {
    getSystemName
  }
}
