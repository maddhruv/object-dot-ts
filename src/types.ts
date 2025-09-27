import type { Get as IGet, Paths as IPaths } from "type-fest";

export type ToRecord<T> = T extends Record<string, unknown>
	? T
	: Record<string, unknown> & T;

export type Paths<T> = IPaths<
	ToRecord<T>,
	{
		maxRecursionDepth: 10;
	}
>;

export type Get<T, P extends Paths<T>> = IGet<ToRecord<T>, P>;
