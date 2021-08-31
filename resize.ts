import {
  App,
  inject,
  InjectionKey,
  reactive,
  ref,
  ToRefs,
  toRefs,
  watchEffect,
} from 'vue'
import { BreakpointOptions, BreakpointState } from './breakpoint.interface'
import _ from 'lodash'

function getClientWidth(): number {
  return Math.max(document.documentElement?.clientWidth, window.innerWidth)
}

function getClientHeight(): number {
  return Math.max(document.documentElement?.clientHeight, window.innerHeight)
}

const defaultOptions: BreakpointOptions = {
  delay: 150,
  thresholds: {
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    '2xl': 1440,
    '3xl': 1904,
  },
}

export const DisplaySymbol: InjectionKey<ToRefs<BreakpointState>> =
  Symbol.for('app:breakpoints')

function createDisplay(
  options: BreakpointOptions = defaultOptions
): ToRefs<BreakpointState> {
  const { thresholds, delay } = Object.assign(defaultOptions, options)
  const state = reactive({} as BreakpointState)
  const width = ref<number>(getClientWidth())
  const height = ref<number>(getClientHeight())

  const onResize = _.throttle(() => {
    height.value = getClientHeight()
    width.value = getClientWidth()
  }, delay)

  watchEffect(() => {
    const xs = width.value < thresholds.sm
    const sm = width.value < thresholds.md && !xs
    const md = width.value < thresholds.lg && !(sm || xs)
    const lg = width.value < thresholds.xl && !(md || sm || xs)
    const xl = width.value < thresholds['2xl'] && !(lg || md || sm || xs)
    const xxl = width.value < thresholds['3xl'] && !(xl || lg || md || sm || xs)
    const xxxl = width.value >= thresholds['3xl']
    const name = xs
      ? 'xs'
      : sm
      ? 'sm'
      : md
      ? 'md'
      : lg
      ? 'lg'
      : xl
      ? 'xl'
      : xxl
      ? '2xl'
      : '3xl'
    state.height = height.value
    state.width = width.value
    state.xs = xs
    state.sm = sm
    state.md = md
    state.lg = lg
    state.xl = xl
    state['2xl'] = xxl
    state['3xl'] = xxxl
    state.name = name
    state.smAndUp = !xs
    state.mdAndUp = !(xs || sm)
    state.lgAndUp = !(xs || sm || md)
    state.xlAndUp = !(xs || sm || md || lg)
    state.xxlAndUp = !(xs || sm || md || lg || xl)
    state.xxxlAndUp = !(xs || sm || md || lg || xl || xxl)
    state.smAndDown = !(md || lg || xl || xxl || xxxl)
    state.mdAndDown = !(lg || xl || xxl || xxxl)
    state.lgAndDown = !(xl || xxl || xxxl)
    state.xlAndDown = !(xxl || xxxl)
    state.xxlAndDown = !xxxl
  })

  window.addEventListener('resize', onResize, { passive: true })

  return toRefs(state)
}

export default {
  install: (app: App, options: BreakpointOptions): void => {
    app.provide(DisplaySymbol, createDisplay(options))
    app.mixin({
      computed: {
        $breakpoints() {
          return inject(DisplaySymbol)
        },
      },
    })
  },
}

export function useBreakpoint(): ToRefs<BreakpointState> {
  const display = inject(DisplaySymbol)

  if (!display) throw new Error('Could not find display injection')

  return display
}
