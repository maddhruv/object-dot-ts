import { assertType, describe, expect, it } from "vitest";
import { set } from "..";

describe("set", () => {
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

	describe("basic property setting", () => {
		it("set root string property", () => {
			const result = set(testObject, "title", "newTitle");
			expect(result.title).toBe("newTitle");
			expect(testObject.title).toBe("testTitle"); // Original unchanged
			assertType<string>(result.title);
		});

		it("set root boolean property", () => {
			const result = set(testObject, "active", false);
			expect(result.active).toBe(false);
			expect(testObject.active).toBe(true); // Original unchanged
			assertType<boolean>(result.active);
		});

		it("set root number property", () => {
			const result = set(testObject, "score", 100);
			expect(result.score).toBe(100);
			expect(testObject.score).toBe(95.5); // Original unchanged
			assertType<number>(result.score);
		});

		it("set root array property", () => {
			const newTags = ["new", "tags"];
			const result = set(testObject, "tags", newTags);
			expect(result.tags).toEqual(newTags);
			expect(testObject.tags).toEqual(["admin", "user"]); // Original unchanged
			assertType<string[]>(result.tags);
		});
	});

	describe("nested property setting", () => {
		it("set nested string property", () => {
			const result = set(testObject, "user.name", "Jane");
			expect(result.user.name).toBe("Jane");
			expect(testObject.user.name).toBe("John"); // Original unchanged
			assertType<string>(result.user.name);
		});

		it("set nested number property", () => {
			const result = set(testObject, "user.age", 31);
			expect(result.user.age).toBe(31);
			expect(testObject.user.age).toBe(30); // Original unchanged
			assertType<number>(result.user.age);
		});

		it("set deeply nested string property", () => {
			const result = set(testObject, "user.address.city", "Los Angeles");
			expect(result.user.address.city).toBe("Los Angeles");
			expect(testObject.user.address.city).toBe("New York"); // Original unchanged
			assertType<string>(result.user.address.city);
		});

		it("set deeply nested boolean property", () => {
			const result = set(
				testObject,
				"user.preferences.notifications.email",
				false,
			);
			expect(result.user.preferences.notifications.email).toBe(false);
			expect(testObject.user.preferences.notifications.email).toBe(true); // Original unchanged
			assertType<boolean>(result.user.preferences.notifications.email);
		});

		it("set nested array property", () => {
			const newHobbies = ["coding", "gaming"];
			const result = set(testObject, "user.hobbies", newHobbies);
			expect(result.user.hobbies).toEqual(newHobbies);
			expect(testObject.user.hobbies).toEqual(["reading", "swimming"]); // Original unchanged
			assertType<string[]>(result.user.hobbies);
		});
	});

	describe("array access with bracket notation", () => {
		it("set array element with bracket notation", () => {
			const result = set(testObject, "tags.0", "newAdmin");
			expect(result.tags[0]).toBe("newAdmin");
			expect(result.tags[1]).toBe("user"); // Other elements preserved
			expect(testObject.tags[0]).toBe("admin"); // Original unchanged
			assertType<string | undefined>(result.tags[0]);
		});

		it("set nested array element with bracket notation", () => {
			const result = set(testObject, "user.hobbies.1", "running");
			expect(result.user.hobbies[1]).toBe("running");
			expect(result.user.hobbies[0]).toBe("reading"); // Other elements preserved
			expect(testObject.user.hobbies[1]).toBe("swimming"); // Original unchanged
			assertType<string | undefined>(result.user.hobbies[1]);
		});

		it("set mixed dot and bracket notation", () => {
			const result = set(testObject, "user.hobbies.0", "writing");
			expect(result.user.hobbies[0]).toBe("writing");
			expect(result.user.hobbies[1]).toBe("swimming"); // Other elements preserved
			expect(testObject.user.hobbies[0]).toBe("reading"); // Original unchanged
			assertType<string | undefined>(result.user.hobbies[0]);
		});
	});

	describe("complex nested structures", () => {
		it("mixed array and object setting", () => {
			const mixedObject = {
				items: [
					{ name: "item1" as string, value: 100 },
					{ name: "item2", value: 200 },
				],
			} as const;
			const result = set(mixedObject, "items.0.name", "updated item1");
			expect(result.items[0].name).toBe("updated item1");
			expect(result.items[1].name).toBe("item2"); // Other item unchanged
			expect(mixedObject.items[0].name).toBe("item1"); // Original unchanged
			assertType<string>(result.items[0].name);
		});
	});

	describe("special characters in keys", () => {
		it("keys with dashes", () => {
			const specialObject = { "key-with-dash": "value1" };
			const result = set(specialObject, "key-with-dash", "new value");
			expect(result["key-with-dash"]).toBe("new value");
			expect(specialObject["key-with-dash"]).toBe("value1"); // Original unchanged
			assertType<string>(result["key-with-dash"]);
		});

		it("keys with dots using array notation", () => {
			const specialObject = { "key.with.dots": "value2" };
			const result = set(specialObject, ["key.with.dots"], "updated value");
			expect(result["key.with.dots"]).toBe("updated value");
			expect(specialObject["key.with.dots"]).toBe("value2"); // Original unchanged
			assertType<string>(result["key.with.dots"]);
		});

		it("numeric string keys", () => {
			const numericObject = { "0": "zero", "1": "one" };
			const result = set(numericObject, "0", "new zero");
			expect(result["0"]).toBe("new zero");
			expect(result["1"]).toBe("one"); // Other key unchanged
			expect(numericObject["0"]).toBe("zero"); // Original unchanged
			assertType<string>(result["0"]);
		});
	});

	describe("immutability verification", () => {
		it("preserves original object structure", () => {
			const result = set(testObject, "user.name", "New Name");

			// Check that original is unchanged
			expect(testObject.user.name).toBe("John");
			expect(testObject.user.age).toBe(30);
			expect(testObject.user.address.city).toBe("New York");
			expect(testObject.tags).toEqual(["admin", "user"]);

			// Check that result has the change
			expect(result.user.name).toBe("New Name");
			expect(result.user.age).toBe(30); // Other properties preserved
			expect(result.user.address.city).toBe("New York"); // Other properties preserved
			expect(result.tags).toEqual(["admin", "user"]); // Other properties preserved

			// Check that objects are different references
			expect(result).not.toBe(testObject);
			expect(result.user).not.toBe(testObject.user);
			expect(result.user.address).not.toBe(testObject.user.address);
		});

		it("preserves nested object references when not modified", () => {
			const result = set(testObject, "title", "New Title");

			// The user object should be a new reference (due to structuredClone)
			expect(result.user).not.toBe(testObject.user);
			expect(result.user.address).not.toBe(testObject.user.address);
		});
	});

	describe("type safety verification", () => {
		it("preserves exact types", () => {
			const result1 = set(testObject, "user.age", 35);
			const result2 = set(testObject, "user.name", "New Name");
			const result3 = set(
				testObject,
				"user.preferences.notifications.email",
				false,
			);
			const result4 = set(testObject, "tags", ["new", "tags"]);

			expect(result1.user.age).toBe(35);
			expect(result2.user.name).toBe("New Name");
			expect(result3.user.preferences.notifications.email).toBe(false);
			expect(result4.tags).toEqual(["new", "tags"]);

			// Type assertions
			assertType<number>(result1.user.age);
			assertType<string>(result2.user.name);
			assertType<boolean>(result3.user.preferences.notifications.email);
			assertType<string[]>(result4.tags);
		});
	});
});
