# object-get-set

A lightweight TypeScript utility library for safely getting and setting nested object properties with full type safety.

[![npm version](https://badge.fury.io/js/object-get-set.svg)](https://www.npmjs.com/package/object-get-set)

## Features

- 🔒 **Type Safe**: Full TypeScript support with strict type checking
- 🛡️ **Safe**: Handles null/undefined objects gracefully
- 🚀 **Immutable**: All operations return new objects, never mutate the original
- 📦 **Lightweight**: Zero dependencies, minimal bundle size
- 🧪 **Well Tested**: 100% test coverage with comprehensive test suite
- 📚 **Well Documented**: Clear JSDoc comments and examples

## Installation

```bash
npm install object-get-set
```

```bash
yarn add object-get-set
```

```bash
pnpm add object-get-set
```

## Usage

### Import

```typescript
import { get, set } from 'object-get-set';
```

### get - Safely get nested properties

```typescript
const user = {
  profile: {
    name: 'John',
    settings: {
      theme: 'dark'
    }
  }
};

// Get simple property
const name = get(user, 'profile.name'); // 'John'

// Get with default value
const age = get(user, 'profile.age', 25); // 25

// Get with array path
const theme = get(user, ['profile', 'settings', 'theme']); // 'dark'

// Safe handling of missing properties
const missing = get(user, 'profile.missing.deep.property'); // undefined
```

### set - Safely set nested properties

```typescript
const user = {
  profile: {
    name: 'John'
  }
};

// Set simple property
const updated = set(user, 'profile.name', 'Jane');
// { profile: { name: 'Jane' } }

// Create nested structure
const withSettings = set(user, 'profile.settings.theme', 'light');
// { profile: { name: 'John', settings: { theme: 'light' } } }

// Set with array path
const withArray = set(user, ['profile', 'age'], 30);
// { profile: { name: 'John', age: 30 } }

// Handle complex nested structures
const complexUser = {
  data: {
    personal: {
      contact: {
        email: 'john@example.com'
      }
    }
  }
};

// Get deeply nested value
const email = get(complexUser, 'data.personal.contact.email'); // 'john@example.com'

// Set deeply nested value
const withPhone = set(complexUser, 'data.personal.contact.phone', '+1234567890');
// Creates the full nested structure if it doesn't exist

// Type safety - TypeScript will catch invalid paths
// const invalid = get(user, 'profile.invalid.path'); // TypeScript error
// const invalidSet = set(user, 'profile.invalid.path', 'value'); // TypeScript error
```

## API Reference

### `get<T, P, D>(obj: T, path: P, defaultValue?: D): Get<T, P> | D`

Safely gets a nested property value from an object using a dot-notation path.

**Parameters:**

- `obj` - The object to get the value from
- `path` - The path to the property (supports dot notation like 'user.profile.name' or array notation like ['user', 'profile', 'name'])
- `defaultValue` - Optional default value to return if the property doesn't exist

**Returns:** The value at the specified path, or the default value if the path doesn't exist

### `set<T, P, V>(obj: T, path: P | string[], value: V): T`

Safely sets a nested property value in an object using a dot-notation path. Returns a new object with the property set, without mutating the original object.

**Parameters:**

- `obj` - The object to set the value in
- `path` - The path to the property (supports dot notation like 'user.profile.name' or array notation like ['user', 'profile', 'name'])
- `value` - The value to set at the specified path

**Returns:** A new object with the property set at the specified path

## Development

### Available Scripts

```bash
# Build the project
npm run build

# Run tests
npm run test

# Run tests in watch mode with UI
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Format code using Biome
npm run format
```

### Development Workflow

1. **Make your changes** in the `src/` directory
2. **Run tests** to ensure everything works: `npm run test`
3. **Format your code**: `npm run format`
4. **Build the project**: `npm run build`
5. **Check coverage**: `npm run test:coverage`

## License

MIT © [Dhruv Jain](https://maddhruv.dev)

## Contributing

We welcome contributions to `object-get-set`! Here's how you can help:

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:

   ```bash
   git clone https://github.com/YOUR_USERNAME/object-get-set.git
   cd object-get-set
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Create a new branch** for your feature or bugfix:

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bugfix-name
   ```

### Development Guidelines

#### Code Style

- We use **Biome** for formatting and linting
- Run `npm run format` before committing
- Follow TypeScript best practices
- Write clear, descriptive commit messages

#### Testing

- All new features must include tests
- Maintain 100% test coverage
- Run `npm run test:coverage` to check coverage
- Use `npm run test:watch` for development

#### Type Safety

- All code must be fully typed
- Use proper TypeScript generics
- Avoid `any` types (except in test files where needed)
- Ensure type definitions are exported correctly

## Author

- 🌐 [maddhruv.dev](https://maddhruv.dev)
- 🐙 [@maddhruv on GitHub](https://github.com/maddhruv)

## Repository

- **GitHub**: [https://github.com/maddhruv/object-get-set](https://github.com/maddhruv/object-get-set)
- **Issues**: [https://github.com/maddhruv/object-get-set/issues](https://github.com/maddhruv/object-get-set/issues)
- **NPM**: [https://www.npmjs.com/package/object-get-set](https://www.npmjs.com/package/object-get-set)
