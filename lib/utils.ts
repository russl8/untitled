import { currentUser } from "@clerk/nextjs/server";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getmmdd(date: Date): string {
  date = new Date(date);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
  });
  return formattedDate;
}
export function getDayOfWeek(date:Date): string {

  const dayOfWeek = new Date(date).getDay();

  let res= ""
  switch(dayOfWeek) {
    case 0:
      res="Sun"
    case 1:
      res="Mon"
    case 2:
      res="Tue"
    case 3:
      res="Wed"
    case 4:
      res="Thu"
    case 5:
      res="Fri"
    case 6:
      res="Sat"
  }
  return res

}
