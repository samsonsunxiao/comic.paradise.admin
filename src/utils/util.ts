import { isObject } from '@vue/shared'
import { md5 } from 'js-md5'
import { sha1 } from 'js-sha1'
import { sha256 } from 'js-sha256'
import { cloneDeep } from 'lodash'
/**
 * @description 添加单位
 * @param {String | Number} value 值 100
 * @param {String} unit 单位 px em rem
 */
export const addUnit = (value: string | number, unit = 'px') => {
    return !Object.is(Number(value), NaN) ? `${value}${unit}` : value
}

/**
 * @description 添加单位
 * @param {unknown} value
 * @return {Boolean}
 */
export const isEmpty = (value: unknown) => {
    return value == null && typeof value == 'undefined'
}

/**
 * @description 树转数组，队列实现广度优先遍历
 * @param {Array} data  数据
 * @param {Object} props `{ children: 'children' }`
 */

export const treeToArray = (data: any[], props = { children: 'children' }) => {
    data = cloneDeep(data)
    const { children } = props
    const newData = []
    const queue: any[] = []
    data.forEach((child: any) => queue.push(child))
    while (queue.length) {
        const item: any = queue.shift()
        if (item[children]) {
            item[children].forEach((child: any) => queue.push(child))
            delete item[children]
        }
        newData.push(item)
    }
    return newData
}

/**
 * @description 数组转
 * @param {Array} data  数据
 * @param {Object} props `{ parent: 'pid', children: 'children' }`
 */

export const arrayToTree = (
    data: any[],
    props = { id: 'id', parentId: 'pid', children: 'children' }
) => {
    data = cloneDeep(data)
    const { id, parentId, children } = props
    const result: any[] = []
    const map = new Map()
    data.forEach((item) => {
        map.set(item[id], item)
        const parent = map.get(item[parentId])
        if (parent) {
            parent[children] = parent[children] ?? []
            parent[children].push(item)
        } else {
            result.push(item)
        }
    })
    return result
}

/**
 * @description 获取正确的路经
 * @param {String} path  数据
 */
export function getNormalPath(path: string) {
    if (path.length === 0 || !path || path == 'undefined') {
        return path
    }
    const newPath = path.replace('//', '/')
    const length = newPath.length
    if (newPath[length - 1] === '/') {
        return newPath.slice(0, length - 1)
    }
    return newPath
}

/**
 * @description对象格式化为Query语法
 * @param { Object } params
 * @return {string} Query语法
 */
export function objectToQuery(params: Record<string, any>): string {
    let query = ''
    for (const props of Object.keys(params)) {
        const value = params[props]
        const part = encodeURIComponent(props) + '='
        if (!isEmpty(value)) {
            if (isObject(value)) {
                for (const key of Object.keys(value)) {
                    if (!isEmpty(value[key])) {
                        const params = props + '[' + key + ']'
                        const subPart = encodeURIComponent(params) + '='
                        query += subPart + encodeURIComponent(value[key]) + '&'
                    }
                }
            } else {
                query += part + encodeURIComponent(value) + '&'
            }
        }
    }
    return query.slice(0, -1)
}

/**
 * @description 时间格式化
 * @param dateTime { number } 时间戳
 * @param fmt { string } 时间格式
 * @return { string }
 */
// yyyy:mm:dd|yyyy:mm|yyyy年mm月dd日|yyyy年mm月dd日 hh时MM分等,可自定义组合
export const timeFormat = (dateTime: number, fmt = 'yyyy-mm-dd') => {
    // 如果为null,则格式化当前时间
    if (!dateTime) {
        dateTime = Number(new Date())
    }
    // 如果dateTime长度为10或者13，则为秒和毫秒的时间戳，如果超过13位，则为其他的时间格式
    if (dateTime.toString().length == 10) {
        dateTime *= 1000
    }
    const date = new Date(dateTime)
    let ret
    const opt: any = {
        'y+': date.getFullYear().toString(), // 年
        'm+': (date.getMonth() + 1).toString(), // 月
        'd+': date.getDate().toString(), // 日
        'h+': date.getHours().toString(), // 时
        'M+': date.getMinutes().toString(), // 分
        's+': date.getSeconds().toString() // 秒
    }
    for (const k in opt) {
        ret = new RegExp('(' + k + ')').exec(fmt)
        if (ret) {
            fmt = fmt.replace(
                ret[1],
                ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
            )
        }
    }
    return fmt
}

/**
 * @description 获取不重复的id
 * @param length { Number } id的长度
 * @return { String } id
 */
export const getNonDuplicateID = (length = 8) => {
    let idStr = Date.now().toString(36)
    idStr += Math.random().toString(36).substring(3, length)
    return idStr
}

export const formatSizeUnits = (bytes: number) => {
    let str: string
    if (bytes >= 1073741824) {
        str = (bytes / 1073741824).toFixed(2) + ' GB'
    } else if (bytes >= 1048576) {
        str = (bytes / 1048576).toFixed(2) + ' MB'
    } else if (bytes >= 1024) {
        str = (bytes / 1024).toFixed(2) + ' KB'
    } else if (bytes > 1) {
        str = bytes + ' 字节'
    } else if (bytes == 1) {
        str = bytes + ' 字节'
    } else {
        str = '0 字节'
    }
    return str
}

export const generateUniqueNumber = () => {
    // 获取当前时间戳
    const timestamp = Date.now()
    // 生成一个0-99之间的随机数，并保留两位数
    const randomPart = ('0' + Math.floor(Math.random() * 100)).slice(-2)
    // 拼接时间戳和随机数部分，保证总共五位
    return `${timestamp.toString().slice(-3)}${randomPart}`
}

export const calcFileShaValue = async (type: string, file: any): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        // 当文件被读取时，计算其 SHA-256 值
        reader.onload = (e) => {
            const fileContent = e.target?.result
            if (fileContent) {
                if (type == 'sha1') {
                    const hash = sha1(fileContent)
                    resolve(hash) // 返回计算出的哈希值
                } else if (type == 'sha256') {
                    const hash = sha256(fileContent)
                    resolve(hash) // 返回计算出的哈希值
                } else if (type == 'md5') {
                    const hash = md5(fileContent)
                    resolve(hash) // 返回计算出的MD5
                } else {
                    resolve('')
                }
            } else {
                reject('')
            }
        }

        // 读取文件为二进制字符串
        reader.onerror = () => reject('')
        reader.readAsArrayBuffer(file)
    })
}
