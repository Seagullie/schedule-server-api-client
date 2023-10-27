import { AuthorApi, AuthorForReadDto, AuthorForWriteDto, Author, TeacherApi, Teacher, TeacherForWriteDto } from "../api"
import { getConfig } from "./utils"

describe("Api", () => {
  describe("authorApi", () => {
    let authorApi: AuthorApi

    beforeAll(async () => {
      authorApi = new AuthorApi(await getConfig())
    })

    it("should return all authors", async () => {
      const response = await authorApi.apiAuthorGet()

      const items: AuthorForReadDto[] = response.data
      console.log("Received authors:", items)

      // expect to get an array of authors
      expect(items).toBeInstanceOf(Array)
    })

    it("should create an author", async () => {
      const author: AuthorForWriteDto = {
        firstName: "Seagullie",
        lastName: "Seagullie's last name",
        nickName: "Admin",
        bio: "Cool guy",
        email: "secret@gmail.com",
      }

      const response = await authorApi.apiAuthorPost(author)

      const createdAuthor: Author = response.data

      expect(createdAuthor).toHaveProperty("id")
      expect(createdAuthor.firstName).toEqual(author.firstName)
      expect(createdAuthor.lastName).toEqual(author.lastName)
    })
  })

  describe("teacherApi", () => {
    let teacherApi: TeacherApi

    const sampleTeacher: TeacherForWriteDto = {
      firstName: "Петро",
      lastName: "Шепіта",
      middleName: "Ігорович",
      email: "noinfo@gmail.com",
      qualifications: "К.Т.Н",
      departmentId: 1,
    }

    async function createSampleTeacherIfNoTeachersExist(teacherApi: TeacherApi) {
      const response = await teacherApi.apiTeacherGet()
      const teachers = response.data

      if (teachers.length === 0) {
        await teacherApi.apiTeacherPost(sampleTeacher)
      }
    }

    beforeAll(async () => {
      teacherApi = new TeacherApi(await getConfig())
    })

    it("should return all teachers", async () => {
      const response = await teacherApi.apiTeacherGet()

      const items: Teacher[] = response.data
      console.log("Received teachers:", items)

      // expect to get an array of teachers
      expect(items).toBeInstanceOf(Array)
    })

    it("should return specific teacher", async () => {
      const allTeachers = await teacherApi.apiTeacherGet()
      const firstTeacher = allTeachers.data[0]
      const teacherId = firstTeacher.id as number

      const response = await teacherApi.apiTeacherIdGet(teacherId)

      const teacher: Teacher = response.data
      console.log("Received teacher:", teacher)

      // expect to get an array of teachers
      expect(teacher).toBeInstanceOf(Object)
      expect(teacher).toHaveProperty("id")
      expect(teacher).toHaveProperty("firstName")
    })

    it("should create a teacher", async () => {
      const response = await teacherApi.apiTeacherPost(sampleTeacher)

      const createdTeacher: Teacher = response.data

      expect(createdTeacher).toHaveProperty("id")
      expect(createdTeacher.firstName).toEqual(sampleTeacher.firstName)
      expect(createdTeacher.lastName).toEqual(sampleTeacher.lastName)
    })

    it("should update a teacher", async () => {
      await createSampleTeacherIfNoTeachersExist(teacherApi)

      const allTeachers = await teacherApi.apiTeacherGet()
      const firstTeacher = allTeachers.data[0]
      const teacherId = firstTeacher.id as number

      const newTeacher: TeacherForWriteDto = {
        firstName: "Василь",
        lastName: "Шепіта",
        middleName: "Ігорович",
        email: "noinfo@gmail.com",
        qualifications: "К.Т.Н",
        departmentId: 1,
      }

      const response = await teacherApi.apiTeacherIdPut(teacherId, newTeacher)
      const updateStatus = response.status

      const updatedTeacher = await teacherApi.apiTeacherIdGet(teacherId)
      const updatedTeacherName: string = updatedTeacher.data.firstName as string

      expect(updateStatus).toEqual(200)
      expect(updatedTeacherName).toEqual(newTeacher.firstName)
    })

    it("should delete a teacher", async () => {
      // get all teachers
      const responseForTeacherGet = await teacherApi.apiTeacherGet()
      const teachers = responseForTeacherGet.data
      const firstTeacher = teachers[0]

      if (!firstTeacher) {
        // create a teacher to have something to delete
        const responseForTeacherPost = await teacherApi.apiTeacherPost(sampleTeacher)
        const createdTeacher = responseForTeacherPost.data
        var teacherId = createdTeacher.id as number
      } else {
        var teacherId = firstTeacher.id as number
      }

      const response = await teacherApi.apiTeacherIdDelete(teacherId)
      const deleteStatus = response.status

      expect(deleteStatus).toEqual(200)

      // expect getting the teacher to fail
      await expect(teacherApi.apiTeacherIdGet(teacherId)).rejects.toThrow()
    })
  })
})
