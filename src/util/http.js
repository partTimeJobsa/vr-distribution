import request from '@/util/request'

export function get (url, params) {
  return request({
    url,
    method: 'get',
    params
  })
}

export function post (url, data) {
  return request({
    url,
    method: 'post',
    data
  })
}

export default {
  get,
  post
}
