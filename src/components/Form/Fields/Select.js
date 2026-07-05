import ReactSelect from 'react-select';

export default function Select({
    field,
    options = [],
    placeholder = 'Pilih...',
    disabled = false,
    isMulti = false
}) {
    const hasError =
        field.state.meta.isTouched &&
        field.state.meta.errors.length > 0;

    const currentInputValue = isMulti
        ? options.filter((opt) =>
            (field.state.value || []).includes(opt.value)
        )
        : options.find((opt) => opt.value === field.state.value) || null;

    return (
        <div className="w-full">
            <ReactSelect
                id={field.name}
                inputId={field.name}
                instanceId={field.name}
                name={field.name}
                value={currentInputValue}
                options={options}
                placeholder={placeholder}
                isDisabled={disabled}
                isMulti={isMulti}
                onBlur={field.handleBlur}

                onChange={(val) => {
                    if (isMulti) {
                        field.handleChange(val ? val.map(v => v.value) : []);
                    } else {
                        field.handleChange(val ? val.value : '');
                    }
                }}

                noOptionsMessage={() => "Data tidak ditemukan"}
                unstyled
                classNames={{
                    control: ({ isFocused }) =>
                        `w-full border rounded-lg px-2 py-1 bg-white transition-all transition-colors duration-200 flex ${hasError
                            ? 'border-red-400 ring-2 ring-red-400'
                            : isFocused
                                ? 'border-blue-500 ring-2 ring-blue-500'
                                : 'border-gray-300'
                        }`,
                    placeholder: () => 'text-gray-400 text-sm pl-1',
                    input: () => 'text-sm pl-1 text-slate-800',
                    singleValue: () => 'text-sm pl-1 text-slate-800',
                    valueContainer: () => 'gap-1',
                    dropdownIndicator: () =>
                        'text-gray-400 p-1 hover:text-gray-600 cursor-pointer',
                    clearIndicator: () =>
                        'text-gray-400 p-1 hover:text-red-500 cursor-pointer',
                    menu: () =>
                        'mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden',
                    menuList: () => 'py-1',
                    option: ({ isFocused, isSelected }) =>
                        `px-3 py-2 text-sm cursor-pointer transition-colors ${isSelected
                            ? 'bg-blue-600 text-white'
                            : isFocused
                                ? 'bg-blue-50 text-slate-900'
                                : 'text-slate-700 hover:bg-slate-50'
                        }`,
                    noOptionsMessage: () =>
                        'text-gray-400 p-2 text-sm text-center',
                }}
            />
        </div>
    );
}