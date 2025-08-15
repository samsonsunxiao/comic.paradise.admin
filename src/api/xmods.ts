import request from '@/utils/request'

export function getModList(params?: any) {
    return request.get({ url: '/mod/list', params })
}

export function modDetail(params?: any) {
    return request.get({ url: '/mod/detail', params })
}

export function modSave(params?: any) {
    return request.post({ url: '/mod/save', params })
}

export function getFileSize(params?: any) {
    return request.post({ url: '/mod/getfilesize', params })
}
