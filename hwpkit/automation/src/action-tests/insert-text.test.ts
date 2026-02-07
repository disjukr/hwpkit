import assert from 'node:assert/strict'
import { describe, expect, it } from 'vitest'
import { createHwp } from '../hwp.js'

const e2e = process.platform === 'win32' && process.env.HWP_AUTOMATION_E2E === '1'
const itE2E = e2e ? it : it.skip

describe('InsertText action', () => {
  it('rejects unknown parameter key', async () => {
    const hwp = createHwp()
    await assert.rejects(
      () => hwp.action('InsertText' as any, { Text: 'ok', __extra: 1 } as any),
      (e: any) => {
        expect(String(e?.message ?? e)).toContain('unknown param key for InsertText')
        return true
      }
    )
  })

  itE2E('batch roundtrip includes inserted text', async () => {
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
