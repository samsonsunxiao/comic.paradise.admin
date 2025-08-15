import request from '@/utils/request'

export function getModOrgList(params?: any) {
    return request.get({ url: '/mod/list', params })
}

export function modOrgDetail(params?: any) {
    return request.get({ url: '/mod/detail', params })
}

export function getFileSize(params?: any) {
    return request.post({ url: '/mod/getfilesize', params })
}
