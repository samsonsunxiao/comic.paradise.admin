import request from '@/utils/request'

export function getCategoryAll() {
    return request.get({ url: '/category/all' })
}

export function getCategoryList() {
    return request.get({ url: '/category/list' })
}

export function categoryDetail(params?: any) {
    return request.get({ url: '/category/detail', params })
}

export function categorySave(params?: any) {
    return request.post({ url: '/category/save', params })
}

export function getComicAll(params?: any) {
    return request.get({ url: '/comic/all', params })
}

export function getComicList(params?: any) {
    return request.get({ url: '/comic/list', params })
}

export function comicDetail(params?: any) {
    return request.get({ url: '/comic/detail', params })
}

export function getComicItems(params?: any) {
    return request.get({ url: '/comic/items', params })
}

export function comicSave(params?: any) {
    return request.post({ url: '/comic/save', params })
}

export function comicSync(params?: any) {
    return request.get({ url: '/comic/sync', params })
}

export function getSyncState() {
    return request.get({ url: '/comic/syncstate' })
}