// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { UiButton, UiIconButton } from '@/components/ui'

describe('UiButton', () => {
  it('rendert mit `to` einen RouterLink mit den Button-Klassen', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div />' } },
        { path: '/app/', component: { template: '<div />' } },
      ],
    })
    await router.push('/')
    const w = mount(UiButton, {
      props: { to: '/app/', variant: 'primary' },
      slots: { default: 'Los' },
      global: { plugins: [router] },
    })
    expect(w.element.tagName).toBe('A')
    expect(w.attributes('href')).toBe('/app/')
    expect(w.classes()).toEqual(expect.arrayContaining(['btn', 'btn-primary']))
  })

  it('rendert einen sekundären <button type="button"> als Standard', () => {
    const w = mount(UiButton, { slots: { default: 'Speichern' } })
    const el = w.element
    expect(el.tagName).toBe('BUTTON')
    expect(el.getAttribute('type')).toBe('button')
    expect([...el.classList]).toEqual(['btn', 'btn-secondary'])
    expect(el.textContent).toBe('Speichern')
  })

  it('setzt Variante und Größe als globale Klassen aus button.css', () => {
    const w = mount(UiButton, { props: { variant: 'primary', size: 'sm' } })
    expect([...w.element.classList]).toEqual(['btn', 'btn-primary', 'btn-sm'])
    const d = mount(UiButton, { props: { variant: 'danger' } })
    expect([...d.element.classList]).toEqual(['btn', 'btn-danger'])
  })

  it('reicht disabled, Attribute, Klassen und Klicks durch', async () => {
    let clicks = 0
    const w = mount(UiButton, {
      props: { disabled: true },
      attrs: { id: 'startRecordingBtn', title: 'Start', class: 'extra', onClick: () => clicks++ },
    })
    expect(w.element.disabled).toBe(true)
    expect(w.attributes('id')).toBe('startRecordingBtn')
    expect(w.attributes('title')).toBe('Start')
    expect(w.classes()).toContain('extra')
    await w.setProps({ disabled: false })
    await w.trigger('click')
    expect(clicks).toBe(1)
  })

  it('rendert mit href einen Download-Link ohne type und disabled', () => {
    const w = mount(UiButton, { props: { href: 'blob:x', download: 'alarm.webm' } })
    expect(w.element.tagName).toBe('A')
    expect(w.attributes('href')).toBe('blob:x')
    expect(w.attributes('download')).toBe('alarm.webm')
    expect(w.attributes('type')).toBeUndefined()
    expect(w.attributes('disabled')).toBeUndefined()
  })

  it('lässt download ohne Dateinamen weg', () => {
    const w = mount(UiButton, { props: { href: '/x' } })
    expect(w.attributes('download')).toBeUndefined()
  })
})

describe('UiIconButton', () => {
  it('benennt die Aktion über aria-label und title', () => {
    const w = mount(UiIconButton, {
      props: { label: 'Verwerfen', variant: 'danger', size: 'sm' },
      slots: { default: '<i class="fas fa-times" aria-hidden="true"></i>' },
    })
    expect(w.element.tagName).toBe('BUTTON')
    expect(w.attributes('aria-label')).toBe('Verwerfen')
    expect(w.attributes('title')).toBe('Verwerfen')
    expect([...w.element.classList]).toEqual(['btn', 'btn-danger', 'btn-sm'])
  })
})

describe('Keine rohen .btn-Klassen in Komponenten', () => {
  it('nutzt überall UiButton statt class="btn …"', async () => {
    const { readdirSync, readFileSync, statSync } = await import('node:fs')
    const { join } = await import('node:path')
    const { fileURLToPath, URL: NodeURL } = await import('node:url')
    const root = fileURLToPath(new NodeURL('../src', import.meta.url))
    const offenders: string[] = []
    const walk = (dir: string): void => {
      for (const e of readdirSync(dir)) {
        const p = join(dir, e)
        if (statSync(p).isDirectory()) walk(p)
        else if (p.endsWith('.vue') && !p.endsWith('UiButton.vue')) {
          if (/class="btn\b/.test(readFileSync(p, 'utf8'))) offenders.push(p)
        }
      }
    }
    walk(root)
    expect(offenders).toEqual([])
  })
})
