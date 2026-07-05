import { useForm } from '@tanstack/react-form'
import { requiredField, email } from '../Form/Validator/Validator'
import { useRoles } from '@/hooks/useRole'
import TextInput from '../Form/Fields/TextInput';
import Select from '../Form/Fields/Select';
import FormField from '../Form/Fields/FormField';
import { useCreateMember } from '@/hooks/useMember';

const staticFields = [
    {
        name: 'memberName',
        label: 'Nama',
        component: TextInput,
        props: { placeholder: 'Masukkan nama' },
        validators: requiredField('Nama'),
    },
    {
        name: 'memberEmail',
        label: 'Email',
        component: TextInput,
        props: { type: 'email', placeholder: 'nama@email.com' },
        validators: requiredField('Email', email()),
    },
    {
        name: 'memberRole',
        label: 'Role',
        component: Select,
        props: {
            placeholder: 'Pilih role...',
            options: []
        },
        validators: requiredField('Role'),
    },
]

export default function AddMember() {
    const { data: roles = [], isLoading: isRoleLoading, } = useRoles();
    const {mutate: createMember, isPending: isSubmitting} = useCreateMember();

    const form = useForm({
        defaultValues: {
            memberName: '',
            memberEmail: '',
            memberRole: '',
        },
        onSubmit: async ({ value }) => {
            createMember(value, {
                onSuccess: () => {
                    form.reset();
                },
                onError: (error) => {
                    console.error(error.message);
                },
            });
        },
    })

    const roleOptions = roles.map((role) => ({
        value: role.id,
        label: role.name,
    }))

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
                {staticFields.map(({ name, label, component: Component, props, validators }) => {
                    const dynamicProps = name === 'memberRole'
                        ? { ...props, options: roleOptions, disabled: isRoleLoading }
                        : props;

                    return (
                        <FormField
                            key={name}
                            form={form}
                            name={name}
                            label={label}
                            validators={validators}
                        >
                            <Component {...dynamicProps} />
                        </FormField>
                    )
                })}

                <button
                    type="submit"
                    disabled={isRoleLoading || isSubmitting}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
            </form>
        </div>
    )
}