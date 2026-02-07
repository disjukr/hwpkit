import { describe, expect, it } from 'vitest'
import { createHwp } from './hwp.js'

const e2e = process.platform === 'win32' && process.env.HWP_AUTOMATION_E2E === '1'
const itE2E = e2e ? it : it.skip

describe('automation smoke', () => {
  itE2E('GetMessageBoxMode returns number', async () => {
    const hwp = createHwp()
    const mode = await hwp.method.GetMessageBoxMode()
    expect(typeof mode).toBe('number')
  })

  itE2E('InsertText roundtrip appears in text export', async () => {
    const hwp = createHwp()
    const token = `hello-${Date.now()}`
    const results = await hwp.batch([
      { op: 'action', action: 'InsertText', setId: 'InsertText', fields: { Text: token } },
      { op: 'getTextFile', format: 'TEXT', option: '' },
    ] as any)

    const t = results.find((r: any) => r.op === 'getTextFile') as any
    expect(t).toBeTruthy()
    expect(typeof t.text).toBe('string')
    expect(t.text.includes(token)).toBe(true)
  })
})
