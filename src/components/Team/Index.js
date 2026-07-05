import { useForm } from '@tanstack/react-form'
import FormField from '../Form/Fields/FormField'
import TextInput from '../Form/Fields/TextInput'
import TextArea from '../Form/Fields/TextArea'
import { requiredField, email } from '../Form/Validator/Validator'

const fields = [
    {
        name: 'name',
        label: 'Nama',
        component: TextInput,
        props: { placeholder: 'Masukkan nama' },
        validators: requiredField('Nama'),
    },
    {
        name: 'email',
        label: 'Email',
        component: TextInput,
        props: { type: 'email', placeholder: 'nama@email.com' },
        validators: requiredField('Email', email()),
    },
]

export default function AddSquadComponent( { handleSubmit }) {
    const form = useForm({
        defaultValues: {
            name: '',
            email: '',
        },
        onSubmit: async ({ value }) => {
            handleSubmit(value)
            form.reset()
        },
    })

    return (
        <div className="py-5">
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                }}
                className="max-w-md w-full space-y-5"
            >
                {fields.map(({ name, label, component: Component, props, validators }) => (
                    <FormField
                        key={name}
                        form={form}
                        name={name}
                        label={label}
                        validators={validators}
                    >
                        <Component {...props} />
                    </FormField>
                ))}

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Simpan
                </button>
            </form>
        </div>
    )
}