import { assertType, describe, expect, it } from "vitest";

import { get } from "../get";

describe("get", () => {
	const testObject = {
		user: {
			name: "John",
			age: 30,
			address: {
				street: "123 Main St",
				city: "New York",
				country: "USA",
			},
			hobbies: ["reading", "swimming"],
			preferences: {
				theme: "dark",
				notifications: {
					email: true,
					push: false,
				},
			},
		},
		title: "testTitle",
		active: true,
		score: 95.5,
		tags: ["admin", "user"],
	};

	describe("basic property access", () => {
		it("root string property", () => {
			const result = get(testObject, "title");
			expect(result).toBe("testTitle");
			assertType<string>(result);
		});

		it("root boolean property", () => {
			const result = get(testObject, "active");
			expect(result).toBe(true);
			assertType<boolean>(result);
		});

		it("root number property", () => {
			const result = get(testObject, "score");
			expect(result).toBe(95.5);
			assertType<number>(result);
		});

		it("root array property", () => {
			const result = get(testObject, "tags");
			expect(result).toEqual(["admin", "user"]);
			assertType<string[]>(result);
		});
	});

	describe("nested property access", () => {
		it("nested string property", () => {
			const result = get(testObject, "user.name");
			expect(result).toBe("John");
			assertType<string>(result);
		});

		it("nested number property", () => {
			const result = get(testObject, "user.age");
			expect(result).toBe(30);
			assertType<number>(result);
		});

		it("deeply nested string property", () => {
			const result = get(testObject, "user.address.city");
			expect(result).toBe("New York");
			assertType<string>(result);
		});

		it("deeply nested boolean property", () => {
			const result = get(testObject, "user.preferences.notifications.email");
			expect(result).toBe(true);
			assertType<boolean>(result);
		});

		it("nested array property", () => {
			const result = get(testObject, "user.hobbies");
			expect(result).toEqual(["reading", "swimming"]);
			assertType<string[]>(result);
		});
	});

	describe("array access with bracket notation", () => {
		it("array element access with bracket notation", () => {
			const result = get(testObject, "tags.0");
			expect(result).toBe("admin");
			assertType<string | undefined>(result);
		});

		it("nested array element access with bracket notation", () => {
			const result = get(testObject, "user.hobbies.1");
			expect(result).toBe("swimming");
			assertType<string | undefined>(result);
		});

		it("mixed dot and bracket notation", () => {
			const result = get(testObject, "user.hobbies.0");
			expect(result).toBe("reading");
			assertType<string | undefined>(result);
		});
	});

	describe("default values", () => {
		it("default value with existing property", () => {
			const result = get(testObject, "title", "default");
			expect(result).toBe("testTitle");
			assertType<string>(result);
		});

		it("default value with non-existent property", () => {
			const result = get(testObject, "nonExistent" as any, "default");
			expect(result).toBe("default");
			assertType<string | typeof testObject>(result);
		});

		it("default value with different type", () => {
			const result = get(testObject, "title", 1);
			expect(result).toBe("testTitle");
			assertType<string | number>(result);
		});

		it("default value with nested non-existent property", () => {
			const result = get(testObject, "user.nonExistent" as any, "default");
			expect(result).toBe("default");
			assertType<string | typeof testObject>(result);
		});

		it("default value with array element out of bounds", () => {
			const result = get(testObject, "tags.5", "default");
			expect(result).toBe("default");
			assertType<string | undefined>(result);
		});
	});

	describe("edge cases", () => {
		it("empty string path", () => {
			const result = get(testObject, "" as any);
			expect(result).toBe(testObject);
			assertType<typeof testObject>(result);
		});

		it("empty array path", () => {
			const result = get(testObject, [] as any);
			expect(result).toBe(testObject);
			assertType<typeof testObject>(result);
		});

		it("null object", () => {
			const result = get(null as any, "path" as never);
			expect(result).toBeUndefined();
			assertType<undefined>(result);
		});

		it("undefined object", () => {
			const result = get(undefined as any, "path" as never);
			expect(result).toBeUndefined();
			assertType<undefined>(result);
		});

		it("null object with default", () => {
			const result = get(null as any, "path" as never, "default");
			expect(result).toBe("default");
			assertType<string>(result);
		});

		it("undefined object with default", () => {
			const result = get(undefined as any, "path" as never, "default");
			expect(result).toBe("default");
			assertType<string>(result);
		});
	});

	describe("complex nested structures", () => {
		it("very deep nesting", () => {
			const deepObject = {
				a: {
					b: {
						c: { d: { e: { f: { g: { h: { i: { j: "deep value" } } } } } } },
					},
				},
			};
			const result = get(deepObject, "a.b.c.d.e.f.g.h.i.j");
			expect(result).toBe("deep value");
			assertType<string>(result);
		});

		it("mixed array and object access", () => {
			const mixedObject = {
				items: [
					{ name: "item1", value: 100 },
					{ name: "item2", value: 200 },
				],
			};
			const result = get(mixedObject, "items.0.name");
			expect(result).toBe("item1");
			assertType<string | undefined>(result);
		});

		it("array of objects with bracket notation", () => {
			const arrayObject = {
				users: [
					{ id: 1, name: "Alice" },
					{ id: 2, name: "Bob" },
				],
			};
			const result = get(arrayObject, "users.1.name");
			expect(result).toBe("Bob");
			assertType<string | undefined>(result);
		});
	});

	describe("special characters in keys", () => {
		it("keys with dashes", () => {
			const specialObject = { "key-with-dash": "value1" };
			const result = get(specialObject, "key-with-dash");
			expect(result).toBe("value1");
			assertType<string>(result);
		});

		it("numeric string keys", () => {
			const numericObject = { "0": "zero", "1": "one" };
			const result = get(numericObject, "0");
			expect(result).toBe("zero");
			assertType<string>(result);
		});
	});

	describe("type safety verification", () => {
		it("preserves exact types", () => {
			const result1 = get(testObject, "user.age");
			const result2 = get(testObject, "user.name");
			const result3 = get(testObject, "user.preferences.notifications.email");
			const result4 = get(testObject, "tags");

			expect(result1).toBe(30);
			expect(result2).toBe("John");
			expect(result3).toBe(true);
			expect(result4).toEqual(["admin", "user"]);

			// Type assertions
			assertType<number>(result1);
			assertType<string>(result2);
			assertType<boolean>(result3);
			assertType<string[]>(result4);
		});

		it("union types with default values", () => {
			const result1 = get(testObject, "nonExistent" as any, "string default");
			const result2 = get(testObject, "nonExistent" as any, 42);
			const result3 = get(testObject, "nonExistent" as any, true);

			expect(result1).toBe("string default");
			expect(result2).toBe(42);
			expect(result3).toBe(true);

			assertType<string | typeof testObject>(result1);
			assertType<number | typeof testObject>(result2);
			assertType<boolean | typeof testObject>(result3);
		});
	});
});
