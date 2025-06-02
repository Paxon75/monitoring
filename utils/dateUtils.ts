import { Week } from '../types.ts';

export function getWeeksInMonth(year: number, monthIndex: number): Week[] {
  const weeks: Week[] = [];
  const lastDateOfMonth = new Date(year, monthIndex + 1, 0);
  const numDaysInMonth = lastDateOfMonth.getDate();

  let currentDayPointer = 1;
  let weekCounter = 1;

  while (currentDayPointer <= numDaysInMonth) {
    const weekStartDate = new Date(year, monthIndex, currentDayPointer);
    
    let weekEndDateDay = currentDayPointer;
    // A week ends on Sunday (getDay() === 0) or at the end of the month.
    while(weekEndDateDay <= numDaysInMonth) {
        const currentDate = new Date(year, monthIndex, weekEndDateDay);
        if (currentDate.getDay() === 0) { // It's a Sunday
            break;
        }
        if (weekEndDateDay === numDaysInMonth) { // End of month
            break;
        }
        weekEndDateDay++;
    }
    
    const weekEndDate = new Date(year, monthIndex, weekEndDateDay);
    const daysInThisWeekSegment: number[] = [];
    for (let d = currentDayPointer; d <= weekEndDateDay; d++) {
      daysInThisWeekSegment.push(d);
    }

    weeks.push({
      weekNumber: weekCounter,
      days: daysInThisWeekSegment,
      startDate: weekStartDate,
      endDate: weekEndDate,
      label: `Tydzień ${weekCounter} (${formatDate(weekStartDate)} - ${formatDate(weekEndDate)})`
    });

    currentDayPointer = weekEndDateDay + 1;
    weekCounter++;
  }
  return weeks;
}

export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}`;
}

export function formatDateFull(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}