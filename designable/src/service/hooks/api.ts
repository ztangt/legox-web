import { request } from 'umi'
import { env } from '../../../project_config/env.js'
export async function getOrgChildren(
  params: {
    nodeId: string
    nodeType: string
    start: number
    limit: number
  },
  options?: { [key: string]: any }
) {
  return request<Record<string, any>>(`/${env}/sys/org/children`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + window.localStorage.getItem('userToken'),
    },
    params: {
      ...params,
    },
    ...(options || {}),
  })
}
export async function getSearchTree(params: any) {
  return request<Record<string, any>>(`/${env}/sys/org/tree`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + window.localStorage.getItem('userToken'),
    },
    params: {
      ...params,
    },
  })
}
export async function getPosts(params: any) {
  return request<Record<string, any>>(`/${env}/sys/post/list`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + window.localStorage.getItem('userToken'),
    },
    params: {
      ...params,
    },
  })
}
export async function getQueryUser(params: any) {
  return request<Record<string, any>>(`/${env}/sys/identity/list`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + window.localStorage.getItem('userToken'),
    },
    params: {
      ...params,
    },
  })
}
export async function getUnitRole(params: any) {
  return request<Record<string, any>>(`/${env}/sys/role/roles`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + window.localStorage.getItem('userToken'),
    },
    params: {
      ...params,
    },
  })
}
export async function getUgs(params: any) {
  return request<Record<string, any>>(`/${env}/sys/usergroup/list`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + window.localStorage.getItem('userToken'),
    },
    params: {
      ...params,
    },
  })
}
export async function getUsersByIds(params: any) {
  return request<Record<string, any>>(`/${env}/sys/user/findInfoByIds`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + window.localStorage.getItem('userToken'),
    },
    params: {
      ...params,
    },
  })
}
export async function getUsergroupByIds(params: any) {
  return request<Record<string, any>>(`/${env}/sys/usergroup/findInfoByIds`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + window.localStorage.getItem('userToken'),
    },
    params: {
      ...params,
    },
  })
}
export async function getOrgByIds(params: any) {
  return request<Record<string, any>>(`/${env}/sys/org/findInfoByIds`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + window.localStorage.getItem('userToken'),
    },
    params: {
      ...params,
    },
  })
}
export async function getPostByIds(params: any) {
  return request<Record<string, any>>(`/${env}/sys/post/findInfoByIds`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + window.localStorage.getItem('userToken'),
    },
    params: {
      ...params,
    },
  })
}
export async function getDeptByIds(params: any) {
  return request<Record<string, any>>(`/${env}/sys/dept/findInfoByIds`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + window.localStorage.getItem('userToken'),
    },
    params: {
      ...params,
    },
  })
}
export async function getRuleByIds(params: any) {
  return request<Record<string, any>>(`/${env}/sys/role/findInfoByIds`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + window.localStorage.getItem('userToken'),
    },
    params: {
      ...params,
    },
  })
}
export async function presignedUploadUrl(params: any) {
  return request<Record<string, any>>(`/${env}/public/fileStorage/presigned`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + window.localStorage.getItem('userToken'),
    },
    params: {
      ...params,
    },
  })
}
