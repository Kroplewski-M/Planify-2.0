export const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short"
})

export function formatDuration(start: string | Date, end: string | Date) {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();

    if (e <= s) return null;

    let diff = Math.floor((e - s) / 1000); 
    const minutes = Math.floor(diff / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) {
        return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    }

    if (hours < 24) {
        const remainingMinutes = minutes % 60;
        return `${hours} hour${hours !== 1 ? "s" : ""}${
            remainingMinutes ? ` ${remainingMinutes} min` : ""
        }`;
    }
    const remainingHours = hours % 24;
    return `${days} day${days !== 1 ? "s" : ""}${
        remainingHours ? ` ${remainingHours} hour${remainingHours !== 1 ? "s" : ""}` : ""
    }`;
}