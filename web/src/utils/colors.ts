// See https://css-tricks.com/converting-color-spaces-in-javascript/ for reference
export function hexToHsl (hex: string) {
  // Convert hex to RGB first
  let r = 0; let g = 0; let b = 0
  if (hex.length === 4) {
    r = Number('0x' + hex[1] + hex[1])
    g = Number('0x' + hex[2] + hex[2])
    b = Number('0x' + hex[3] + hex[3])
  } else if (hex.length === 7) {
    r = Number('0x' + hex[1] + hex[2])
    g = Number('0x' + hex[3] + hex[4])
    b = Number('0x' + hex[5] + hex[6])
  }
  // Then to HSL
  r /= 255
  g /= 255
  b /= 255
  const cmin = Math.min(r, g, b)
  const cmax = Math.max(r, g, b)
  const delta = cmax - cmin
  let h = 0
  let s = 0
  let l = 0

  if (delta === 0) { h = 0 } else if (cmax === r) { h = ((g - b) / delta) % 6 } else if (cmax === g) { h = (b - r) / delta + 2 } else { h = (r - g) / delta + 4 }

  h = Math.round(h * 60)

  if (h < 0) { h += 360 }

  l = (cmax + cmin) / 2
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))
  s = +(s * 100).toFixed(1)
  l = +(l * 100).toFixed(1)

  return {
    h,
    s,
    l
  }
}

// Used to return black or white overlay depending on the color
// Darker color will returns white as it will be visible above it
// Lighter color will returns black as it will be visible above it
export function blackOrWhite (hsl: {h: number;s: number; l: number}) {
  if (hsl.s > 90 && hsl.l > 50) {
    return '#000'
  }
  if (hsl.l > 58) {
    return '#000'
  }
  return '#fff'
}
