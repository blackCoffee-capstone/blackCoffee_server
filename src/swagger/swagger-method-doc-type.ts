export type SwaggerMethodDoc<T> = {
	[K in keyof T]: (description: string) => MethodDecorator;
};
