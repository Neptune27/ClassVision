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