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
                    endTime: session.isOpenEnded ? null : (session.endTime || null),
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
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700">Sesi Waktu</label>
                                <button
                                    type="button"
                                    onClick={() => sessionsField.pushValue(emptySession())}
                                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
                                >
                                    <span className="text-base leading-none">+</span> Tambah Sesi
                                </button>
                            </div>

                            <div className="space-y-2">
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
        <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
            <span className="mt-2.5 text-xs font-medium text-gray-400 w-4 shrink-0">
                {index + 1}
            </span>

            <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                    <form.Field name={`sessions[${index}].startTime`} validators={requiredField('Waktu Mulai')}>
                        {(field) => (
                            <input
                                type="time"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                                className="flex-1 min-w-0 border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        )}
                    </form.Field>

                    <span className="text-sm text-gray-400 shrink-0">s/d</span>

                    <form.Field name={`sessions[${index}].endTime`}>
                        {(field) => (
                            <input
                                type="time"
                                value={field.state.value}
                                disabled={isOpenEnded}
                                onChange={(e) => field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                                className="flex-1 min-w-0 border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                            />
                        )}
                    </form.Field>

                    {canRemove && (
                        <button
                            type="button"
                            onClick={onRemove}
                            className="shrink-0 text-gray-400 hover:text-red-500 cursor-pointer p-1"
                            aria-label="Hapus sesi"
                        >
                            ✕
                        </button>
                    )}
                </div>

                <form.Field name={`sessions[${index}].isOpenEnded`}>
                    {(field) => (
                        <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={field.state.value}
                                onChange={(e) => {
                                    field.handleChange(e.target.checked)
                                    if (e.target.checked) {
                                        form.setFieldValue(`sessions[${index}].endTime`, '')
                                    }
                                }}
                                className="w-3.5 h-3.5 accent-blue-600 cursor-pointer"
                            />
                            Sampai selesai
                        </label>
                    )}
                </form.Field>
            </div>
        </div>
    )
}