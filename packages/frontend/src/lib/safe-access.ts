/**
 * Safe Array and Object Access Utilities
 * Prevents out-of-bounds errors and null/undefined access
 */

// Types for safe access
export type SafeAccessResult<T> = {
  value: T | null
  exists: boolean
  index?: number
  path?: string
}

export type SafeArrayResult<T> = SafeAccessResult<T> & {
  length: number
  isEmpty: boolean
}

/**
 * Safely access array element by index
 */
export function safeArrayAccess<T>(
  array: T[] | null | undefined,
  index: number,
  defaultValue: T | null = null
): SafeArrayResult<T> {
  if (!Array.isArray(array)) {
    return {
      value: defaultValue,
      exists: false,
      length: 0,
      isEmpty: true
    }
  }

  const length = array.length
  const isEmpty = length === 0

  if (isEmpty) {
    return {
      value: defaultValue,
      exists: false,
      length,
      isEmpty: true
    }
  }

  // Handle negative indices
  const normalizedIndex = index < 0 ? length + index : index

  if (normalizedIndex < 0 || normalizedIndex >= length) {
    return {
      value: defaultValue,
      exists: false,
      index: normalizedIndex,
      length,
      isEmpty: false
    }
  }

  return {
    value: array[normalizedIndex],
    exists: true,
    index: normalizedIndex,
    length,
    isEmpty: false
  }
}

/**
 * Safely access nested object properties
 */
export function safeObjectAccess<T>(
  obj: any,
  path: string | string[],
  defaultValue: T | null = null
): SafeAccessResult<T> {
  if (!obj || typeof obj !== 'object') {
    return {
      value: defaultValue,
      exists: false,
      path: Array.isArray(path) ? path.join('.') : path
    }
  }

  const keys = Array.isArray(path) ? path : path.split('.')
  let current = obj
  let currentPath = ''

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    currentPath = currentPath ? `${currentPath}.${key}` : key

    if (current == null || typeof current !== 'object' || !(key in current)) {
      return {
        value: defaultValue,
        exists: false,
        path: currentPath
      }
    }

    current = current[key]
  }

  return {
    value: current as T,
    exists: true,
    path: keys.join('.')
  }
}

/**
 * Safely get array element with bounds checking and logging
 */
export function safeGet<T>(
  array: T[] | null | undefined,
  index: number,
  context: string = 'unknown',
  logErrors: boolean = true
): T | null {
  const result = safeArrayAccess(array, index)

  if (!result.exists && logErrors) {
    console.warn(`Safe access failed in ${context}:`, {
      index,
      arrayLength: result.length,
      attemptedIndex: result.index,
      isEmpty: result.isEmpty
    })
  }

  return result.value
}

/**
 * Safely get nested object property with logging
 */
export function safeProp<T>(
  obj: any,
  path: string | string[],
  context: string = 'unknown',
  logErrors: boolean = true
): T | null {
  const result = safeObjectAccess(obj, path)

  if (!result.exists && logErrors) {
    console.warn(`Safe property access failed in ${context}:`, {
      path: result.path,
      object: obj
    })
  }

  return result.value
}

/**
 * Safely iterate over array with bounds checking
 */
export function safeForEach<T>(
  array: T[] | null | undefined,
  callback: (item: T, index: number) => void,
  context: string = 'unknown'
): void {
  if (!Array.isArray(array)) {
    console.warn(`safeForEach called with non-array in ${context}:`, array)
    return
  }

  array.forEach(callback)
}

/**
 * Safely map array with bounds checking
 */
export function safeMap<T, U>(
  array: T[] | null | undefined,
  callback: (item: T, index: number) => U,
  context: string = 'unknown'
): U[] {
  if (!Array.isArray(array)) {
    console.warn(`safeMap called with non-array in ${context}:`, array)
    return []
  }

  return array.map(callback)
}

/**
 * Safely filter array with bounds checking
 */
export function safeFilter<T>(
  array: T[] | null | undefined,
  predicate: (item: T, index: number) => boolean,
  context: string = 'unknown'
): T[] {
  if (!Array.isArray(array)) {
    console.warn(`safeFilter called with non-array in ${context}:`, array)
    return []
  }

  return array.filter(predicate)
}

/**
 * Safely find element in array
 */
export function safeFind<T>(
  array: T[] | null | undefined,
  predicate: (item: T, index: number) => boolean,
  context: string = 'unknown'
): T | null {
  if (!Array.isArray(array)) {
    console.warn(`safeFind called with non-array in ${context}:`, array)
    return null
  }

  return array.find(predicate) || null
}

/**
 * Safely get array slice with bounds checking
 */
export function safeSlice<T>(
  array: T[] | null | undefined,
  start: number = 0,
  end?: number,
  context: string = 'unknown'
): T[] {
  if (!Array.isArray(array)) {
    console.warn(`safeSlice called with non-array in ${context}:`, array)
    return []
  }

  const length = array.length
  const normalizedStart = Math.max(0, Math.min(start, length))
  const normalizedEnd = end === undefined ? length : Math.max(normalizedStart, Math.min(end, length))

  return array.slice(normalizedStart, normalizedEnd)
}

/**
 * Safely check if index is within array bounds
 */
export function isValidIndex(array: any[] | null | undefined, index: number): boolean {
  if (!Array.isArray(array)) {
    return false
  }

  const normalizedIndex = index < 0 ? array.length + index : index
  return normalizedIndex >= 0 && normalizedIndex < array.length
}

/**
 * Safely get array length
 */
export function safeLength(array: any[] | null | undefined): number {
  return Array.isArray(array) ? array.length : 0
}

/**
 * Safely check if array is empty
 */
export function safeIsEmpty(array: any[] | null | undefined): boolean {
  return !Array.isArray(array) || array.length === 0
}

/**
 * Safe array operations with comprehensive error handling
 */
export class SafeArray<T> {
  private array: T[]
  private context: string

  constructor(array: T[] | null | undefined, context: string = 'SafeArray') {
    this.array = Array.isArray(array) ? array : []
    this.context = context
  }

  get length(): number {
    return this.array.length
  }

  get isEmpty(): boolean {
    return this.array.length === 0
  }

  get(index: number, defaultValue: T | null = null): T | null {
    return safeGet(this.array, index, `${this.context}.get`, true) ?? defaultValue
  }

  set(index: number, value: T): boolean {
    if (!isValidIndex(this.array, index)) {
      console.warn(`SafeArray.set failed in ${this.context}:`, {
        index,
        arrayLength: this.array.length
      })
      return false
    }

    this.array[index] = value
    return true
  }

  push(...items: T[]): number {
    return this.array.push(...items)
  }

  pop(): T | null {
    if (this.isEmpty) {
      console.warn(`SafeArray.pop failed in ${this.context}: array is empty`)
      return null
    }
    return this.array.pop() || null
  }

  shift(): T | null {
    if (this.isEmpty) {
      console.warn(`SafeArray.shift failed in ${this.context}: array is empty`)
      return null
    }
    return this.array.shift() || null
  }

  unshift(...items: T[]): number {
    return this.array.unshift(...items)
  }

  splice(start: number, deleteCount?: number, ...items: T[]): T[] {
    const safeStart = Math.max(0, Math.min(start, this.array.length))
    const safeDeleteCount = deleteCount !== undefined
      ? Math.max(0, Math.min(deleteCount, this.array.length - safeStart))
      : this.array.length - safeStart

    return this.array.splice(safeStart, safeDeleteCount, ...items)
  }

  slice(start: number = 0, end?: number): T[] {
    return safeSlice(this.array, start, end, `${this.context}.slice`)
  }

  forEach(callback: (item: T, index: number) => void): void {
    safeForEach(this.array, callback, `${this.context}.forEach`)
  }

  map<U>(callback: (item: T, index: number) => U): U[] {
    return safeMap(this.array, callback, `${this.context}.map`)
  }

  filter(predicate: (item: T, index: number) => boolean): T[] {
    return safeFilter(this.array, predicate, `${this.context}.filter`)
  }

  find(predicate: (item: T, index: number) => boolean): T | null {
    return safeFind(this.array, predicate, `${this.context}.find`)
  }

  findIndex(predicate: (item: T, index: number) => boolean): number {
    if (!Array.isArray(this.array)) {
      return -1
    }
    return this.array.findIndex(predicate)
  }

  includes(item: T): boolean {
    return this.array.includes(item)
  }

  indexOf(item: T): number {
    return this.array.indexOf(item)
  }

  lastIndexOf(item: T): number {
    return this.array.lastIndexOf(item)
  }

  join(separator: string = ','): string {
    return this.array.join(separator)
  }

  toArray(): T[] {
    return [...this.array]
  }

  clear(): void {
    this.array.length = 0
  }

  clone(): SafeArray<T> {
    return new SafeArray([...this.array], `${this.context}.clone`)
  }
}

/**
 * Safe object operations with comprehensive error handling
 */
export class SafeObject {
  private obj: Record<string, any>
  private context: string

  constructor(obj: any, context: string = 'SafeObject') {
    this.obj = (obj && typeof obj === 'object') ? obj : {}
    this.context = context
  }

  get<T>(path: string | string[], defaultValue: T | null = null): T | null {
    return safeProp(this.obj, path, `${this.context}.get`) ?? defaultValue
  }

  set(path: string | string[], value: any): boolean {
    const keys = Array.isArray(path) ? path : path.split('.')
    let current = this.obj

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i]
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {}
      }
      current = current[key]
    }

    const finalKey = keys[keys.length - 1]
    current[finalKey] = value
    return true
  }

  has(path: string | string[]): boolean {
    const result = safeObjectAccess(this.obj, path)
    return result.exists
  }

  delete(path: string | string[]): boolean {
    const keys = Array.isArray(path) ? path : path.split('.')
    let current = this.obj

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i]
      if (!current[key] || typeof current[key] !== 'object') {
        return false
      }
      current = current[key]
    }

    const finalKey = keys[keys.length - 1]
    if (!(finalKey in current)) {
      return false
    }

    delete current[finalKey]
    return true
  }

  keys(): string[] {
    return Object.keys(this.obj)
  }

  values(): any[] {
    return Object.values(this.obj)
  }

  entries(): [string, any][] {
    return Object.entries(this.obj)
  }

  toObject(): Record<string, any> {
    return { ...this.obj }
  }

  clone(): SafeObject {
    return new SafeObject(JSON.parse(JSON.stringify(this.obj)), `${this.context}.clone`)
  }

  merge(other: Record<string, any>): SafeObject {
    return new SafeObject(
      { ...this.obj, ...other },
      `${this.context}.merge`
    )
  }
}

/**
 * Utility functions for common safe operations
 */
export const safeUtils = {
  // Array utilities
  first: <T>(array: T[] | null | undefined): T | null =>
    safeGet(array, 0, 'safeUtils.first'),

  last: <T>(array: T[] | null | undefined): T | null =>
    safeGet(array, -1, 'safeUtils.last'),

  // Object utilities
  pick: <T extends Record<string, any>, K extends keyof T>(
    obj: T | null | undefined,
    keys: K[]
  ): Pick<T, K> | null => {
    if (!obj || typeof obj !== 'object') return null

    const result = {} as Pick<T, K>
    keys.forEach(key => {
      if (key in obj) {
        result[key] = obj[key]
      }
    })
    return result
  },

  omit: <T extends Record<string, any>, K extends keyof T>(
    obj: T | null | undefined,
    keys: K[]
  ): Omit<T, K> | null => {
    if (!obj || typeof obj !== 'object') return null

    const result = { ...obj }
    keys.forEach(key => {
      delete result[key]
    })
    return result
  },

  // String utilities
  substring: (str: string | null | undefined, start: number, end?: number): string => {
    if (typeof str !== 'string') return ''
    const safeStart = Math.max(0, Math.min(start, str.length))
    const safeEnd = end === undefined ? str.length : Math.max(safeStart, Math.min(end, str.length))
    return str.substring(safeStart, safeEnd)
  },

  // Number utilities
  clamp: (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max)
  },

  // General utilities
  coalesce: <T>(...values: (T | null | undefined)[]): T | null => {
    for (const value of values) {
      if (value != null) return value
    }
    return null
  }
}

export default {
  safeArrayAccess,
  safeObjectAccess,
  safeGet,
  safeProp,
  safeForEach,
  safeMap,
  safeFilter,
  safeFind,
  safeSlice,
  isValidIndex,
  safeLength,
  safeIsEmpty,
  SafeArray,
  SafeObject,
  safeUtils
}
