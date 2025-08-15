import request from '@/utils/request'

export function moduleList(params?: any) {
    return request.get({ url: '/module/list', params })
}

export function moduleDetail(params?: any) {
    return request.get({ url: '/module/detail', params })
}

export function moduleSave(params?: any) {
    return request.post({ url: '/module/save', params })
}

export function moduleAll() {
    return request.get({ url: '/module/all' })
}

export function moduleDel(params?: any) {
    return request.post({ url: '/module/del', params })
}
