import { useForm, type SubmitHandler } from "react-hook-form";
import { type EventFormData, EventType } from "../models/Event";

interface Props {
    initialValues?: Partial<EventFormData>;
    onSubmit: SubmitHandler<EventFormData>;
    serverErrors?: string[];
    submitLabel?: string;
}

export default function EventForm({
    initialValues = {},
    onSubmit,
    serverErrors = [],
    submitLabel = "Create Event",
}: Props) {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<EventFormData>({
        defaultValues: {
            name: "",
            description: "",
            happening_at: "",
            happening_until: "",
            publish: false,
            max_attendees: undefined,
            event_type: EventType.ONLINE,
            meeting: {
                id: "",
                link: "",
                created_at: "",
                updated_at: "",
            },
            address: {
                address_line: "",
                city: "",
                postcode: ""
            },
            ...initialValues
        }
    });

    const selectedType = watch("event_type");

    const handleFormSubmit: SubmitHandler<EventFormData> = (data) => {
        if (data.event_type === EventType.ONLINE) {
            data.address = null;
            if (!data.meeting) data.meeting = null;
        } else {
            data.meeting = null;
            if (data.address && !data.address.address_line) {
                data.address = null;
            }
        }
        onSubmit(data);
    };

    return (
        <form className="space-y-5" onSubmit={handleSubmit(handleFormSubmit)}>
            <div>
                <label className="block text-sm font-medium mb-1 text-accent">Name</label>
                <input
                    {...register("name", { required: "Name is required", maxLength: 50 })}
                    className={`${errors.name ? "border-red-500" : ""} w-full px-4 py-2 border rounded-xl`}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1 text-accent">Description</label>
                <textarea
                    {...register("description")}
                    className="w-full px-4 py-2 border rounded-xl"
                ></textarea>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1 text-accent">Happening At</label>
                <input
                    type="datetime-local"
                    {...register("happening_at", { required: "Start date is required" })}
                    className={`${errors.happening_at ? "border-red-500" : ""} w-full px-4 py-2 border rounded-xl`}
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1 text-accent">Happening Until</label>
                <input
                    type="datetime-local"
                    {...register("happening_until", {
                        validate: (value) => {
                            const start = watch("happening_at");
                            if (!value) return true;
                            if (new Date(value) < new Date(start)) {
                                return "Happening until must be on or after happening at";
                            }
                            return true;
                        }
                    })}
                    className={`w-full px-4 py-2 border rounded-xl ${errors.happening_until ? "border-red-500" : ""}`}
                />
                {errors.happening_until && (
                    <p className="text-red-500 text-sm">{errors.happening_until.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1 text-accent">Max Attendees</label>
                <input
                    type="number"
                    {...register("max_attendees", {
                        valueAsNumber: true,
                        min: { value: 1, message: "Minimum attendees is 1" },
                    })}
                    className={`w-full px-4 py-2 border rounded-xl ${errors.max_attendees ? "border-red-500" : ""}`}
                />
                {errors.max_attendees && (
                    <p className="text-red-500 text-sm">{errors.max_attendees.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1 text-accent">
                    Event Type
                </label>

                <div className="flex gap-6 mt-2">
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            value={EventType.ONLINE}
                            {...register("event_type", { required: true })}
                        />
                        Online Event
                    </label>

                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            value={EventType.ADDRESS}
                            {...register("event_type", { required: true })}
                        />
                        Physical Address
                    </label>
                </div>

                {errors.event_type && (
                    <p className="text-red-500 text-sm">Please choose event type</p>
                )}
            </div>

            {selectedType === EventType.ONLINE && (
                <div>
                    <label className="block text-sm mb-1 text-accent">Meeting Link</label>
                    <input
                        {...register("meeting.link", {
                            required:
                                selectedType === EventType.ONLINE
                                    ? "Meeting link is required."
                                    : false,

                            validate: (value) => {
                                if (selectedType !== EventType.ONLINE) return true;
                                const url = value ?? "";
                                try {
                                    new URL(url);
                                    return true;
                                } catch {
                                    return "Please enter a valid URL.";
                                }
                            }
                        })}
                        className={`w-full px-4 py-2 border rounded-xl ${errors.meeting?.link ? "border-red-500" : ""}`}
                    />
                    {errors.meeting?.link && (
                        <p className="text-red-500 text-sm">{errors.meeting.link.message}</p>
                    )}
                </div>
            )}

            {selectedType === EventType.ADDRESS && (
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm mb-1">Address Line</label>
                        <input
                            {...register("address.address_line", {
                                required: selectedType === EventType.ADDRESS ? "Address line required" : false
                            })}
                            className={`${errors.address?.address_line ? "border-red-500" : ""} w-full px-4 py-2 border rounded-xl`}
                        />
                        {errors.address?.address_line && (
                            <p className="text-red-500 text-sm">{errors.address.address_line.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm mb-1">City</label>
                        <input
                            {...register("address.city", {
                                required:
                                    selectedType === EventType.ADDRESS
                                        ? "City is required"
                                        : false,
                            })}
                            className={`w-full px-4 py-2 border rounded-xl ${errors.address?.city ? "border-red-500" : ""}`}
                        />
                        {errors.address?.city && (
                            <p className="text-red-500 text-sm">{errors.address.city.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Postcode</label>
                        <input
                            {...register("address.postcode", {
                                required:
                                    selectedType === EventType.ADDRESS
                                        ? "Postcode is required"
                                        : false,
                            })}
                            className={`w-full px-4 py-2 border rounded-xl ${errors.address?.postcode ? "border-red-500" : ""}`}
                        />
                        {errors.address?.postcode && (
                            <p className="text-red-500 text-sm">{errors.address.postcode.message}</p>
                        )}
                    </div>
                </div>
            )}
            <div className="flex items-center gap-2">
                <input type="checkbox" {...register("publish")} />
                <label className="text-accent">Publish</label>
            </div>

            <button
                type="submit"
                className="w-full py-2 bg-primary text-white rounded-xl hover:bg-primary/90 cursor-pointer"
            >
                {submitLabel}
            </button>

            {serverErrors.length > 0 && (
                <ul className="list-none mt-3">
                    {serverErrors.map((err, i) => (
                        <li key={i} className="text-red-500">{err}</li>
                    ))}
                </ul>
            )}
        </form>
    );
}