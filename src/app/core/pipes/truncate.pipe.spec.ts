import { TruncatePipe } from './truncate.pipe'

describe('TruncatePipe', () => {

  it('create an instance', () => {
    const pipe = new TruncatePipe()
    expect(pipe).toBeTruthy()
  })

  it('should not truncate text if it is shorter than the limit', () => {
    const pipe = new TruncatePipe()
    const result = pipe.transform('Short text', 20)
    expect(result).toBe('Short text')
  })

  it('should truncate text at the last complete word if completeWords is true', () => {
    const pipe = new TruncatePipe()
    const result = pipe.transform('This is a long text that needs to be truncated', 14, true)
    expect(result).toBe('This is a...')
  })
})
