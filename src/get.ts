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

export { get };
