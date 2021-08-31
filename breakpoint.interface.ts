export interface BreakpointState {
  name: string
  height: number
  width: number
  xs: boolean
  sm: boolean
  md: boolean
  lg: boolean
  xl: boolean
  '2xl': boolean
  '3xl': boolean
  smAndUp: boolean
  mdAndUp: boolean
  lgAndUp: boolean
  xlAndUp: boolean
  xxlAndUp: boolean
  xxxlAndUp: boolean
  smAndDown: boolean
  mdAndDown: boolean
  lgAndDown: boolean
  xlAndDown: boolean
  xxlAndDown: boolean
}

export interface BreakpointOptions {
  delay: number
  thresholds: Thresholds
}

export interface Thresholds {
  sm: number
  md: number
  lg: number
  xl: number
  '2xl': number
  '3xl': number
}
