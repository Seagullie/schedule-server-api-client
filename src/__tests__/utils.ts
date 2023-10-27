import { AuthApi } from "../api"
import { Configuration } from "../configuration"

import dotenv from "dotenv"
dotenv.config()

const accessTokenCache: null | string = null
const refreshTokenCache: null | string = null

export async function getConfig() {
  // secrets. Should be read from .env file
  const API_USER_NAME = process.env.API_USER_NAME
  const API_USER_PASSWORD = process.env.API_USER_PASSWORD
  const BASE_PATH = process.env.BASE_PATH

  const authApi = new AuthApi(new Configuration({ basePath: BASE_PATH }))

  async function getTokens(): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await authApi.apiAuthLoginPost({
      userName: API_USER_NAME,
      password: API_USER_PASSWORD,
    })

    if (!response.data.accessToken || !response.data.refreshToken) throw new Error("One of the tokens is missing")

    const { accessToken, refreshToken } = response.data

    return {
      accessToken,
      refreshToken,
    }
  }

  let accessToken: string
  let refreshToken: string

  if (accessTokenCache && refreshTokenCache) {
    accessToken = accessTokenCache
    refreshToken = refreshTokenCache
  } else {
    let response = await getTokens()
    accessToken = response.accessToken
    refreshToken = response.refreshToken
  }

  let config = new Configuration({
    basePath: BASE_PATH,
    accessToken: accessToken,
  })

  return config
}
