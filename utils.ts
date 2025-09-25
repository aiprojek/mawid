// File utilitas untuk menampung fungsi-fungsi pembantu yang dapat digunakan kembali.

/**
 * Mengonversi string waktu (misal: "12:30") menjadi objek Date untuk hari ini.
 * @param timeStr String waktu dalam format HH:mm.
 * @returns Objek Date yang merepresentasikan waktu tersebut pada hari ini.
 */
export const parseTimeToDate = (timeStr: string) => {
    if (!timeStr) return new Date(0); // Mengembalikan tanggal yang valid namun sudah sangat lampau
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
};
