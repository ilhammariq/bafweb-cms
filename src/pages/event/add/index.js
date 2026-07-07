import AddEvent from "@/components/Event/AddEvent";

export default function Index() {
    return (
        <div className='p-10 rounded-lg shadow-lg bg-white'>
            <h1 className="text-2xl font-bold">Add Event</h1>
            <AddEvent />
        </div>
    )
}