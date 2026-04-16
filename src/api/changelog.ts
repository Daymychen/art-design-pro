import request from '@/utils/http'

export interface UpgradeLog {
  version: string
  title: string
  date: string
  detail?: string[]
  requireReLogin?: boolean
  remark?: string
}

export function fetchChangelogList() {
  return request.get<UpgradeLog[]>({ url: '/api/changelog/list' })
}
