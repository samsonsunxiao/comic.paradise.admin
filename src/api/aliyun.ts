import request from '@/utils/request'

// 获取sts授权
export function getAliyunSts() {
    return request.get({ url: '/aliyun/sts' })
}
