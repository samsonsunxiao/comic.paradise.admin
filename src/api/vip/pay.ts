import request from '@/utils/request'

export function vipPayAll() {
    return request.get({ url: '/vip/pay/all' })
}

export function vipPayList(params?: any) {
    return request.get({ url: '/vip/pay/list', params })
}

export function vipPayDetail(params?: any) {
    return request.get({ url: '/vip/pay/detail', params })
}

export function vipPaySave(params?: any) {
    return request.post({ url: '/vip/pay/save', params })
}

export function vipPayDel(params?: any) {
    return request.post({ url: '/vip/pay/del', params })
}
