import { nanoid } from 'nanoid';

/**
 * [产生一个唯一的id字符串]
 *
 * @export
 * @returns {string} id
 */
export function generateUUID() {
  return nanoid();
}

/**
 * [产生一个唯一的短id，无法保证唯一性]
 *
 * @export
 * @returns
 */
export function getShortUUID() {
  return nanoid(10);
}
