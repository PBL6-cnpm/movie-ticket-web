const WEEKDAY_LABELS = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
]

export const VIETNAM_OFFSET_MS = 7 * 60 * 60 * 1000
export const VIETNAM_TIMEZONE = 'Asia/Ho_Chi_Minh'

export const toVietnamDate = (isoString?: string | null): Date | null => {
    if (!isoString) return null

    const parsed = new Date(isoString)
    if (Number.isNaN(parsed.getTime())) {
        return null
    }

    return new Date(parsed.getTime() + VIETNAM_OFFSET_MS)
}

export const formatVietnamDateFromDate = (date: Date | null): string | null => {
    if (!date) return null

    const weekday = WEEKDAY_LABELS[date.getUTCDay()]
    const day = String(date.getUTCDate()).padStart(2, '0')
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')

    return `${weekday}, ${day}/${month}`
}

export const formatVietnamDateLabel = (isoString?: string | null): string => {
    const vietnamDate = toVietnamDate(isoString)
    return formatVietnamDateFromDate(vietnamDate) ?? ''
}

export const formatVietnamDateValue = (isoString?: string | null): string => {
    const vietnamDate = toVietnamDate(isoString)
    if (!vietnamDate) return ''

    const year = vietnamDate.getUTCFullYear()
    const month = String(vietnamDate.getUTCMonth() + 1).padStart(2, '0')
    const day = String(vietnamDate.getUTCDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}

export const formatTo24HourTime = (timeString?: string | null): string => {
    if (!timeString) return ''

    const trimmed = timeString.trim()
    const match = /^([0-9]{1,2}):([0-9]{2})\s*(AM|PM)$/i.exec(trimmed)

    if (!match) {
        return trimmed
    }

    let hours = Number(match[1])
    const minutes = match[2]
    const period = match[3].toUpperCase()

    if (period === 'PM' && hours < 12) {
        hours += 12
    }

    if (period === 'AM' && hours === 12) {
        hours = 0
    }

    return `${String(hours).padStart(2, '0')}:${minutes}`
}

export const formatVietnamDateTime = (
    isoString?: string | null,
    options?: Intl.DateTimeFormatOptions
): string => {
    if (!isoString) return ''

    const parsed = new Date(isoString)
    if (Number.isNaN(parsed.getTime())) {
        return ''
    }

    return new Intl.DateTimeFormat('en-US', {
        timeZone: VIETNAM_TIMEZONE,
        ...options
    }).format(parsed)
}
