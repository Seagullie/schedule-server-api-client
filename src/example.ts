// Import the generated client library

import axios from "axios"
import https from "https"
import { AuthApi, Configuration, TeacherApi, TeacherForReadDto, TeacherForWriteDto } from "./index"
import dotenv from "dotenv"

// accept self-signed certificates (for development purposes)
axios.defaults.httpsAgent = new https.Agent({
  rejectUnauthorized: false,
})

dotenv.config()

// secrets. Should be read from .env file
const API_USER_NAME = process.env.API_USER_NAME
const API_USER_PASSWORD = process.env.API_USER_PASSWORD
const BASE_PATH = process.env.BASE_PATH

const reqConfig = new Configuration({
  basePath: BASE_PATH,
})

const authApi = new AuthApi(reqConfig)
let teacherApi: TeacherApi

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

async function createTeacher() {
  // Create a new instance of the AuthorApi with the access token
  teacherApi = new TeacherApi(
    new Configuration({
      ...reqConfig,
      accessToken: accessToken,
    })
  )

  const author: TeacherForWriteDto = {
    firstName: "Editor",
    lastName: "Last Name",
    email: "idk@gmail.com",
  }

  const response = await teacherApi.apiTeacherPost(author)
}

async function getTeachers() {
  const response = await teacherApi.apiTeacherGet()

  const items: TeacherForReadDto[] = response.data
  console.log("Received authors:", items)
}

export async function mainExample() {
  await authenticate()
  await createTeacher()
  await getTeachers()
}

mainExample()
