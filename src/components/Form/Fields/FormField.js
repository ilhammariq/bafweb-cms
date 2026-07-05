import { cloneElement } from "react";

export default function FormField({ form, name, label, validators, children }) {
    return (
        <form.Field name={name} validators={validators}>
            {(field) => (
                <div>
                    {label && (
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {label}
                        </label>
                    )}
                    {cloneElement(children, { field })}
                    {field.state.meta.isTouched && field.state.meta.errors[0] && <p className="text-red-500 text-sm mt-1">{field.state.meta.errors[0]}</p>}
                </div>
            )}
        </form.Field>
    )
}