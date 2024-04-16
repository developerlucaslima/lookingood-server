import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('User register (E2E', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'John Doe',
      serviceGender: 'Male',
      email: 'john.doe@gmail.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(201)
  })
})
