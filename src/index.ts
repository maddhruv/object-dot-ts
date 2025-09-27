import type { Get, Paths } from "./types";

/**
 * Safely gets a nested property value from an object using a dot-notation path.
 *
 * @template T - The type of the source object
 * @template P - The type of the path (must be a valid path in T)
 * @template D - The type of the default value (optional)
 *
 * @param obj - The object to get the value from
 * @param path - The path to the property (supports dot notation like 'user.profile.name' or array notation like ['user', 'profile', 'name'])
 * @param defaultValue - Optional default value to return if the property doesn't exist
 *
 * @returns The value at the specified path, or the default value if the path doesn't exist
 *
 * @example
 * ```typescript
 * const user = {
 *   profile: {
 *     name: 'John',
 *     settings: {
 *       theme: 'dark'
 *     }
 *   }
 * };
 *
 * // Get simple property
 * const name = get(user, 'profile.name'); // 'John'
 *
 * // Get with default value
 * const age = get(user, 'profile.age', 25); // 25
 *
 * // Get with array path
 * const theme = get(user, ['profile', 'settings', 'theme']); // 'dark'
 *
 * // Safe handling of missing properties
 * const missing = get(user, 'profile.missing.deep.property'); // undefined
 * ```
 */
function get<T extends Record<string, unknown>, P extends Paths<T>>(
	obj: T,
	path: P,
): Get<T, P>;
function get<
	T extends Record<string, unknown>,
	P extends Paths<T>,
	D = undefined,
>(obj: T, path: P, defaultValue: D): Get<T, P> | D;
function get<
	T extends Record<string, unknown>,
	P extends Paths<T>,
	D = undefined,
>(obj: T, path: P, defaultValue?: D): Get<T, P> | D {
	if (!path || (Array.isArray(path) && path.length === 0) || path === "") {
		return defaultValue as D;
	}

	// Convert path to array of keys
	const keys = path
		.replace(/\[(\d+)\]/g, ".$1")
		.split(".")
		.filter(Boolean);

	// Traverse the object
	let current: unknown = obj;

	for (const key of keys) {
		if (current === null || current === undefined) {
			return defaultValue as D;
		}

		// Type-safe property access
		if (typeof current === "object" && key in current) {
			current = current[key as keyof typeof current];
		} else {
			return defaultValue as D;
		}
	}

	// Return the result
	return current === undefined ? (defaultValue as D) : (current as Get<T, P>);
}

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
function set<
	T extends Record<string, unknown>,
	P extends Paths<T>,
	V extends Get<T, P>,
>(obj: T, path: P | string[], value: V) {
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
}

export { get, set };
