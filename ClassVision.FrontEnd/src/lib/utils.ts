import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ComboboxData } from "../components/ui/combobox";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getDisplayId = (display: string) => {
    return display.split("|")[0].trim();
}


export const toDisplayValue = (original: string, display: ComboboxData[]) => {
    return display.find(d => getDisplayId(d.value) == original)?.value ?? ""
}

export function getKeyByValue<TData>(object: {
    [K in keyof TData] : string
}, value: string) {
    return Object.keys(object).find(key => object[key] === value);
}

export function triggerFetch(store: {
    fetchTrigger: boolean
}) {
    store.fetchTrigger = !store.fetchTrigger
}

export const getImageDimensions = (url: string): Promise<{ width: number, height: number }> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({
            width: img.width,
            height: img.height,
        });
        img.onerror = (error) => reject(error);
        img.src = url;
    });
};

export const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max);
}