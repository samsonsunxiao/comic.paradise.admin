import request from '@/utils/request'

export function getGameAll(params?: any) {
    return request.get({ url: '/game/all', params })
}

export function getGameList(params?: any) {
    return request.get({ url: '/game/list', params })
}

export function gameDetail(params?: any) {
    return request.get({ url: '/game/detail', params })
}

export function gameSave(params?: any) {
    return request.post({ url: '/game/save', params })
}

export function gameCheckFileObjectExisted(params?: any) {
    return request.post({ url: '/game/keyurivalid', params })
}

export function gameOnline(params?: any) {
    return request.get({ url: '/game/online', params })
}
