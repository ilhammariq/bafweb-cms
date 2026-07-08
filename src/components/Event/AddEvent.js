import { useForm, useStore } from '@tanstack/react-form'
import { requiredField } from '../Form/Validator/Validator'
import TextInput from '../Form/Fields/TextInput';
import Select from '../Form/Fields/Select';
import FormField from '../Form/Fields/FormField';
// import { useCreateEvent } from '@/hooks/useEvent';
import { useGeneralSetting } from '@/hooks/useGeneralSetting';

const staticFields = [
    {
        name: 'eventTitle',
        label: 'Judul Event',
        component: TextInput,
        props: { placeholder: 'Masukkan judul event' },
        validators: requiredField('Judul Event'),
    },
    {
        name: 'categoryCode',
        label: 'Kategori',
        component: Select,
        props: {
            placeholder: 'Pilih kategori...',
            options: []
        },
        validators: requiredField('Kategori'),
    },
    {
        name: 'eventDate',
        label: 'Tanggal Event',
        component: TextInput,
        props: { type: 'date' },
        validators: requiredField('Tanggal Event'),
    },
    {
        name: 'location',
        label: 'Lokasi',
        component: TextInput,
        props: { placeholder: 'Masukkan lokasi event' },
        validators: requiredField('Lokasi'),
    },
]

const emptySession = () => ({
    startTime: '',
    endTime: '',
    isOpenEnded: false,
})

export default function AddEvent() {
    const { data: categorySettings, isLoading: isCategoryLoading } = useGeneralSetting('CATEGORY_EVENT');
    const { data: statusSettings, isLoading: isStatusLoading } = useGeneralSetting('STATUS_EVENT');
    // const { mutate: createEvent, isPending: isSubmitting } = useCreateEvent();

    const form = useForm({
        defaultValues: {
            eventTitle: '',
            categoryCode: '',
            eventDate: '',
            location: '',
            sessions: [emptySession()],
        },
        onSubmit: async ({ value }) => {
            const payload = {
                ...value,
                sessions: value.sessions.map((session) => ({
                    startTime: session.startTime,
                    endTime: session.isOpenEnded ? null : session.endTime,
                })),
            }

            createEvent(payload, {
                onSuccess: () => {
                    form.reset();
                },
                onError: (error) => {
                    console.error(error.message);
                },
            });
        },
    })

    const categoryOptions = categorySettings?.map((item) => ({
        value: item.code,
        label: item.desc,
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
                    let dynamicProps = props;

                    if (name === 'categoryCode') {
                        dynamicProps = { ...props, options: categoryOptions, disabled: isCategoryLoading };
                    }

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

                <form.Field name="sessions" mode="array">
                    {(sessionsField) => (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700">Sesi Waktu</label>
                                <button
                                    type="button"
                                    onClick={() => sessionsField.pushValue(emptySession())}
                                    className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
                                >
                                    + Tambah Sesi
                                </button>
                            </div>

                            {sessionsField.state.value.map((_, index) => (
                                <SessionRow
                                    key={index}
                                    form={form}
                                    index={index}
                                    onRemove={() => sessionsField.removeValue(index)}
                                    canRemove={sessionsField.state.value.length > 1}
                                />
                            ))}
                        </div>
                    )}
                </form.Field>

                <button
                    type="submit"
                    // disabled={isCategoryLoading || isStatusLoading || isSubmitting}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {/* {isSubmitting ? 'Menyimpan...' : 'Simpan'} */}
                    Simpan
                </button>
            </form>
        </div>
    )
}

function SessionRow({ form, index, onRemove, canRemove }) {
    const isOpenEnded = useStore(
        form.store,
        (state) => state.values.sessions[index]?.isOpenEnded
    )

    return (
        <div className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Sesi {index + 1}</span>
                {canRemove && (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="text-xs text-red-500 hover:text-red-600 cursor-pointer"
                    >
                        Hapus
                    </button>
                )}
            </div>

            <div className="grid grid-cols-2 gap-3">
                <FormField
                    form={form}
                    name={`sessions[${index}].startTime`}
                    label="Waktu Mulai"
                    validators={requiredField('Waktu Mulai')}
                >
                    <TextInput type="time" />
                </FormField>

                <FormField
                    form={form}
                    name={`sessions[${index}].endTime`}
                    label="Waktu Selesai"
                    validators={isOpenEnded ? undefined : requiredField('Waktu Selesai')}
                >
                    <TextInput type="time" disabled={isOpenEnded} />
                </FormField>
            </div>

            <form.Field name={`sessions[${index}].isOpenEnded`}>
                {(field) => (
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={field.state.value}
                            onChange={(e) => {
                                field.handleChange(e.target.checked)
                                if (e.target.checked) {
                                    form.setFieldValue(`sessions[${index}].endTime`, '')
                                }
                            }}
                            className="w-4 h-4 accent-blue-600 cursor-pointer"
                        />
                        Sampai selesai
                    </label>
                )}
            </form.Field>
        </div>
    )
}