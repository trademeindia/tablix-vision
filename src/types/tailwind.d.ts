
/// <reference types="react" />

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number
  }
}

declare module '*.svg' {
  const content: any
  export default content
}
