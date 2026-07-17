export const required = (message = 'Wajib diisi') => (value) => {
    if (value === undefined || value === null) return message
    if (typeof value === 'string' && value.trim() === '') return message
    if (Array.isArray(value) && value.length === 0) return message
    return undefined
}

export const email = (message = 'Format email tidak valid') => (value) => {
    if (!value) return undefined
    return /\S+@\S+\.\S+/.test(value) ? undefined : message
}

export const minLength = (min, message) => (value) => {
    if (!value) return undefined
    return value.length < min ? message || `Minimal ${min} karakter` : undefined
}

export const maxLength = (max, message) => (value) => {
    if (!value) return undefined
    return value.length > max ? message || `Maksimal ${max} karakter` : undefined
}

export const pattern = (regex, message = 'Format tidak valid') => (value) => {
    if (!value) return undefined
    return regex.test(value) ? undefined : message
}

export const combine = (...validators) => (value) => {
    for (const validator of validators) {
        const error = validator(value)
        if (error) return error
    }
    return undefined
}

export const onChangeValidator = (...validators) => ({
    onChange: ({ value }) => combine(...validators)(value),
})

export const requiredField = (label, ...extraValidators) =>
    onChangeValidator(required(`${label} wajib diisi`), ...extraValidators)