export const formatNumber = (number) =>
  `${number}`
    .split('')
    .reverse()
    .map((v, i) => i % 3 === 0 && i ? `${v},` : v)
    .reverse()
    .join('')
