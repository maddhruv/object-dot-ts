import type { Paths as IPaths, Get as IGet } from "type-fest";

export type Paths<T extends Record<string, unknown>> = IPaths<
	T,
	{
		maxRecursionDepth: 10;
	}
>;

export type Get<T extends Record<string, unknown>, P extends Paths<T>> = IGet<
	T,
	P
>;
