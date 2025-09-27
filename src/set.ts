import type { Get, Paths } from "./types";

/**
 * Safely sets a nested property value in an object using a dot-notation path.
 * Returns a new object with the property set, without mutating the original object.
 *
 * @template T - The type of the source object
 * @template P - The type of the path (must be a valid path in T)
 * @template V - The type of the value to set (must match the expected type at the path)
 *
 * @param obj - The object to set the value in
 * @param path - The path to the property (supports dot notation like 'user.profile.name' or array notation like ['user', 'profile', 'name'])
 * @param value - The value to set at the specified path
 *
 * @returns A new object with the property set at the specified path
 *
 * @example
 * ```typescript
 * const user = {
 *   profile: {
 *     name: 'John'
 *   }
 * };
 *
 * // Set simple property
 * const updated = set(user, 'profile.name', 'Jane');
 * // { profile: { name: 'Jane' } }
 *
 * // Create nested structure
 * const withSettings = set(user, 'profile.settings.theme', 'light');
 * // { profile: { name: 'John', settings: { theme: 'light' } } }
 *
 * // Set with array path
 * const withArray = set(user, ['profile', 'age'], 30);
 * // { profile: { name: 'John', age: 30 } }
 *
 * // Original object is unchanged
 * console.log(user); // { profile: { name: 'John' } }
 * ```
 */
export const set = <
	T extends Record<string, unknown>,
	P extends Paths<T>,
	V extends Get<T, P>,
>(
	obj: T,
	path: P | string[],
	value: V,
) => {
	const chunks = Array.isArray(path) ? path : path.split(".");

	// Handle empty path - return a new object with the value
	if (chunks.length === 0 || (chunks.length === 1 && chunks[0] === "")) {
		return value as unknown as T;
	}

	const tempObj: T = structuredClone(obj);
	chunks.reduce<Record<string, unknown>>((acc, chunk, index) => {
		acc[chunk] ??= {};

		if (index === chunks.length - 1) acc[chunk] = value;

		return acc[chunk] as Record<string, unknown>;
	}, tempObj);
	return tempObj;
};
