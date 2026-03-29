import { format } from "date-fns";

const dateFormat = "yyyy-MM-dd HH:mm:ss";
const dateFormatShort = "yyyy-MM-dd";
const timeFormat = "HH:mm:ss";
const dateFormatShort2 = "MM-dd";
const dateFormatShort3 = "MM-dd HH:mm";

export const getDateFormat = (date: Date | string) => {
    return format(new Date(date), dateFormat);
}

export const getDateFormatShort = (date: Date | string) => {
    return format(new Date(date), dateFormatShort);
}

export const getTimeFormat = (date: Date | string) => {
    return format(new Date(date), timeFormat);
}

export const getDateFormatShort2 = (date: Date | string) => {
    return format(new Date(date), dateFormatShort2);
}

export const getDateFormatShort3 = (date: Date | string) => {
    return format(new Date(date), dateFormatShort3);
}
