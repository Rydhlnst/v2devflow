import { techMap } from "@/constants/techMap";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// Mengimport fungsi getDevIconClassName yang berfungsi akan menerima techName yang bertipe string -> techName tadi akan diambil dari tagCards (name) -> lalu akan di lowercase, lalu pada techMap akan menyesesuaikan ke devIconnya, akhirnya akan direturn techMap yang mengambil nilai dari normalizedTechName
export const getDevIconClassName = (techName: string) => {
  const normalizedTechName = techName.replace(/[ .]/g, "").toLowerCase();

  return techMap[normalizedTechName] ? `${techMap[normalizedTechName]} colored` : "devicon-devicon-plain"
}