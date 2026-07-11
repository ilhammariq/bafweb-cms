import { useForm, useStore } from '@tanstack/react-form'
import { requiredField } from '../Form/Validator/Validator'
import TextInput from '../Form/Fields/TextInput'
import Select from '../Form/Fields/Select'
import FormField from '../Form/Fields/FormField'
import { PlusCircle, Trash2 } from 'lucide-react'
// import { useCreateEvent } from '@/hooks/useEvent'
import { useGeneralSetting } from '@/hooks/useGeneralSetting'

// ===== Field statis (tanpa eventDate) =====
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
            options: [],
        },
        validators: requiredField('Kategori'),
    },
    {
        name: 'location',
        label: 'Lokasi',
        component: TextInput,
        props: { placeholder: 'Masukkan lokasi event' },
        validators: requiredField('Lokasi'),
    },
]

// ===== Sesi kosong (dengan date) =====
const emptySession = () => ({
    date: '',
    startTime: '',
    endTime: '',
    isOpenEnded: false,
})

export default function AddEvent() {
    const { data: categorySettings, isLoading: isCategoryLoading } =
        useGeneralSetting('CATEGORY_EVENT')
    const { data: statusSettings, isLoading: isStatusLoading } =
        useGeneralSetting('STATUS_EVENT')
    // const { mutate: createEvent, isPending: isSubmitting } = useCreateEvent()

    const form = useForm({
        defaultValues: {
            eventTitle: '',
            categoryCode: '',
            location: '',
            sessions: [emptySession()],
        },
        onSubmit: async ({ value }) => {
            const payload = {
                ...value,
                sessions: value.sessions.map((session) => ({
                    date: session.date,
                    startTime: session.startTime,
                    endTime: session.endTime,
                })),
            }
            console.log(payload)
            // createEvent(payload, {
            //   onSuccess: () => form.reset(),
            //   onError: (error) => console.error(error.message),
            // })
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
                {/* Field statis */}
                {staticFields.map(({ name, label, component: Component, props, validators }) => {
                    let dynamicProps = props
                    if (name === 'categoryCode') {
                        dynamicProps = {
                            ...props,
                            options: categoryOptions,
                            disabled: isCategoryLoading,
                        }
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

                {/* ===== Sesi (array) ===== */}
                <form.Field name="sessions" mode="array">
                    {(sessionsField) => (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700">
                                    Sesi Waktu
                                </label>
                                <button
                                    type="button"
                                    onClick={() => sessionsField.pushValue(emptySession())}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                                >
                                    <PlusCircle className="w-5 h-5" />
                                    Tambah Sesi
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

                {/* Tombol Submit */}
                <button
                    type="submit"
                    // disabled={isCategoryLoading || isStatusLoading || isSubmitting}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Simpan
                </button>
            </form>
        </div>
    )
}

// ============================================================
// Komponen baris sesi (dengan UI yang ditingkatkan)
// ============================================================
function SessionRow({ form, index, onRemove, canRemove }) {
    const isOpenEnded = useStore(
        form.store,
        (state) => state.values.sessions[index]?.isOpenEnded
    )

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 space-y-4 transition-all hover:shadow-md">
            {/* Header */}
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 tracking-wider uppercase">
                    Sesi {index + 1}
                </span>
                {canRemove && (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="text-red-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
                        aria-label="Hapus sesi"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Tanggal */}
            <FormField
                form={form}
                name={`sessions[${index}].date`}
                label="Tanggal Sesi"
                validators={requiredField('Tanggal Sesi')}
            >
                <TextInput type="date"/>
            </FormField>

            {/* Waktu Mulai & Selesai */}
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
                >
                    <TextInput
                        type="time"
                        disabled={isOpenEnded}
                    />
                </FormField>
            </div>

            {/* Checkbox "Sampai selesai" */}
            <form.Field name={`sessions[${index}].isOpenEnded`}>
                {(field) => (
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none pt-1">
                        <input
                            type="checkbox"
                            checked={field.state.value}
                            onChange={(e) => {
                                field.handleChange(e.target.checked)
                                if (e.target.checked) {
                                    form.setFieldValue(`sessions[${index}].endTime`, '')
                                }
                            }}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <span>Sampai selesai (tidak ada batas waktu)</span>
                    </label>
                )}
            </form.Field>
        </div>
    )
}