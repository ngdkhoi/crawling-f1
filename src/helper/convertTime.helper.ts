export function convertMinToSecond (stringTime: string): number {
  const time = stringTime.split(':')
  return parseInt(time[0]) * 3600 + parseInt(time[1]) * 60 + parseFloat(time[2])

}
  