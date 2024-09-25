import { test, describe, expect } from 'vitest'
import { calculeRunTimeExecution } from './calcule-duraction-time'

describe('calcule-duraction-time', () => {
  test('should be return a duraction in ms', () => {
    expect.assertions(1)

    const startDate = Date.now()

    setTimeout(() => {}, 5000)

    const endDate = Date.now()
    const duractionTime = calculeRunTimeExecution(startDate, endDate)

    expect(duractionTime).toStrictEqual(expect.any(Number))
  })
})
