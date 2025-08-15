import request from '@/utils/request'

export function vipLevelList(params?: any) {
    return request.get({ url: '/vip/level/list', params })
}

export function vipLevelDetail(params?: any) {
    return request.get({ url: '/vip/level/detail', params })
}

export function vipLevelSave(params?: any) {
    return request.post({ url: '/vip/level/save', params })
}

export function vipLevelDel(params?: any) {
    return request.post({ url: '/vip/level/del', params })
}
