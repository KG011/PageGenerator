import fetch from '@/api/fetch/index.ts';

export const insertContent = (data: any) => {
  return fetch.post('/content/insertContent', data)
}
export const getDataJson = (data: any) => {
  return fetch.post('/content/getDataJson', data)
}



