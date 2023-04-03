import KyberOauth2 from '@kybernetwork/oauth2'
import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import { createApi } from '@reduxjs/toolkit/query/react'
import { BuildRoutePayload } from 'services/route/types/buildRoute'

import { GetRouteParams, GetRouteResponse } from './types/getRoute'

const customBaseQuery =
  ({ baseUrl }: { baseUrl?: string } = { baseUrl: '' }): BaseQueryFn =>
  ({ url, params }) =>
    KyberOauth2.callHttpGet(baseUrl + url, params)

const routeApi = createApi({
  reducerPath: 'routeApi',
  baseQuery: customBaseQuery(),
  endpoints: builder => ({
    getRoute: builder.query<
      GetRouteResponse,
      {
        url: string
        params: GetRouteParams
      }
    >({
      query: ({ params, url }) => ({
        url,
        params,
      }),
    }),
  }),
})

export const buildRoute = async (url: string, payload: BuildRoutePayload, signal?: AbortSignal) => {
  const resp = await KyberOauth2.callHttpPost(url, payload, { signal })

  if (resp.status === 200) {
    if (resp.data?.data) {
      return resp.data.data
    }

    const err = new Error('Invalid response when building route')
    console.error(err)
    throw err
  }

  const err = new Error('Building route failed')
  console.error(err)
  throw err
}

export default routeApi
