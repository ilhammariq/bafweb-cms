export default function TextArea({ field, placeholder, rows = 4 }) {
    const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0

    return (
        <textarea
            rows={rows}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${hasError
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
        />
    )
}