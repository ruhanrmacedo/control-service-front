import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  constructor(private datePipe: DatePipe) {}

  transform(value: string | Date): string {
    if (!value) return '';
    if (typeof value === 'string') {
      // Convert the string "dd/MM/yyyy" to a Date object
      const parts = value.split('/');
      if (parts.length === 3) {
        value = new Date(+parts[2], +parts[1] - 1, +parts[0]);
      } else {
        return value; // Return as is if not a valid date string
      }
    }
    return this.datePipe.transform(value, 'dd/MM/yyyy')!;
  }
}
