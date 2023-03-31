import { getUuid } from './getUuid'

describe('getUuid', () => {
  it('should return a uuid string', async () => {
    const res = getUuid()
    expect(res).toHaveLength(36)
  })
})
