// Import the generated client library

import { AuthApi, AuthorApi, AuthorForReadDto, AuthorForWriteDto, Configuration } from "./index"
import dotenv from "dotenv"

dotenv.config()

// secrets. Should be read from .env file
const API_USER_NAME = process.env.API_USER_NAME
const API_USER_PASSWORD = process.env.API_USER_PASSWORD
const BASE_PATH = process.env.BASE_PATH

const reqConfig = new Configuration({
  basePath: BASE_PATH,
})

const authApi = new AuthApi(reqConfig)
let authorApi: AuthorApi

let accessToken: string
let refreshToken: string

async function authenticate() {
  const response = await authApi.apiAuthLoginPost({
    userName: API_USER_NAME,
    password: API_USER_PASSWORD,
  })

  if (!response.data.accessToken || !response.data.refreshToken) throw new Error("One of the tokens is missing")

  accessToken = response.data.accessToken
  refreshToken = response.data.refreshToken
}

async function createAuthor() {
  // Create a new instance of the AuthorApi with the access token
  authorApi = new AuthorApi(
    new Configuration({
      ...reqConfig,
      accessToken: accessToken,
    })
  )

  const author: AuthorForWriteDto = {
    firstName: "Editor",
    lastName: "Last Name",
    bio: "Cool guy",
    email: "idk@gmail.com",
    nickName: "idk",
  }

  const response = await authorApi.apiAuthorPost(author)
}

async function getAuthors() {
  const response = await authorApi.apiAuthorGet()

  const items: AuthorForReadDto[] = response.data
  console.log("Received authors:", items)
}

export async function mainExample() {
  await authenticate()
  await createAuthor()
  await getAuthors()
}

mainExample()
