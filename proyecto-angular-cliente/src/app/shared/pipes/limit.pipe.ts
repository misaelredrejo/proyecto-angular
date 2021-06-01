import { Pipe, PipeTransform } from '@angular/core';
/*
 * Given a string and a number (max characters) returns a limited substring concatenated with '...'
 * Takes a numberCharacters argument that defaults to 50.
 * Usage:
 *   value | limit:numberCharacters
 * Example:
 *   {{ 'hello' | limit:3 }}
 *   formats to: 'hell...'
*/
@Pipe({
  name: 'limit'
})
export class LimitPipe implements PipeTransform {

  transform(value: string, numberCharacters: number = 50): string {
    if (!value) return '';
    let limitedStr = value.substr(0, numberCharacters);
    if (value.length > numberCharacters) limitedStr += '...';
    return limitedStr;
  }

}
