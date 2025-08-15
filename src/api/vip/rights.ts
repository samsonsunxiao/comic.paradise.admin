import request from '@/utils/request'

export function vipRightsAll() {
    return request.get({ url: '/vip/rights/all' })
}

export function vipRightsList(params?: any) {
    return request.get({ url: '/vip/rights/list', params })
}

export function vipRightsDetail(params?: any) {
    return request.get({ url: '/vip/rights/detail', params })
}

export function vipRightsSave(params?: any) {
    return request.post({ url: '/vip/rights/save', params })
}

export function vipRightsDel(params?: any) {
    return request.post({ url: '/vip/rights/del', params })
}
