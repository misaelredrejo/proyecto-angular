import { Pipe, PipeTransform } from '@angular/core';
/*
 * Given an array of string and a number (max characters) returns a limited substring concatenating its items
 * Takes a numberCharacters argument that defaults to 50.
 * Usage:
 *   value | limitArray:numberCharacters
 * Example:
 *   {{ ['str1'], ['str2]] | limitArray:8 }}
 *   formats to: 'str1, st'
*/
@Pipe({
  name: 'limitArray'
})
export class LimitArrayPipe implements PipeTransform {

  transform(value: string[], numberCharacters: number = 50): string {
    if (!value) return '';
    let str: string = value.join(', ');
    let limitedStr = str.substr(0, numberCharacters);
    if (limitedStr.length >= numberCharacters) limitedStr += '...'
    return limitedStr;
  }

}
