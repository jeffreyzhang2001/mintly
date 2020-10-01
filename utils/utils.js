export const secondsToDate = (seconds) => {
    const x = new Date(0)
    x.setSeconds(seconds)
    return x.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}
