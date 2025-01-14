import {
  IResponse,
  ResponseErrorFromValidationErrors
} from "@pagopa/ts-commons/lib/responses";
import { Either } from "fp-ts/lib/Either";
import { fromNullable, none, Option, some } from "fp-ts/lib/Option";
import { IRequestMiddleware } from "io-functions-commons/dist/src/utils/request_middleware";
import * as t from "io-ts";
import { fromEither, taskEither } from "fp-ts/lib/TaskEither";
import {
  ProductCategory,
  ProductCategoryEnum
} from "../generated/definitions/ProductCategory";

// this utility function can be used to turn a TypeScript enum into a io-ts codec.
const fromEnum = <EnumType>(
  enumName: string,
  theEnum: Record<string, string | number>
): t.Type<EnumType> => {
  const isEnumValue = (input: unknown): input is EnumType =>
    Object.values<unknown>(theEnum).includes(input);

  return new t.Type<EnumType>(
    enumName,
    isEnumValue,
    (input, context) =>
      isEnumValue(input) ? t.success(input) : t.failure(input, context),
    t.identity
  );
};

const productCategoryCodec = fromEnum<ProductCategory>(
  "ProductCategory",
  ProductCategoryEnum
);

const CommaSeparatedListOf = (
  decoder: t.Mixed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): t.Type<ReadonlyArray<any>, string, unknown> =>
  new t.Type<ReadonlyArray<t.TypeOf<typeof decoder>>, string, unknown>(
    `CommaSeparatedListOf<${decoder.name}>`,
    (value: unknown): value is ReadonlyArray<t.TypeOf<typeof decoder>> =>
      Array.isArray(value) && value.every(e => decoder.is(e)),
    input =>
      t.readonlyArray(decoder).decode(
        typeof input === "string"
          ? input
              .split(",")
              .map(e => e.trim())
              .filter(Boolean)
          : !input
          ? [] // fallback to empty array in case of empty input
          : input // it should not happen, but in case we let the decoder fail
      ),
    String
  );

export const OptionalProductCategoryListMiddleware = (
  name: string
): IRequestMiddleware<
  "IResponseErrorValidation",
  Option<ReadonlyArray<ProductCategory>>
> => async (
  request
): Promise<
  Either<
    IResponse<"IResponseErrorValidation">,
    Option<ReadonlyArray<ProductCategory>>
  >
> =>
  taskEither
    .of<IResponse<"IResponseErrorValidation">, Option<unknown>>(
      fromNullable(request.query[name])
    )
    .chain(maybeQuery =>
      maybeQuery.foldL(
        () => taskEither.of(none),
        query =>
          fromEither(
            CommaSeparatedListOf(productCategoryCodec).decode(query)
          ).bimap(ResponseErrorFromValidationErrors(ProductCategory), some)
      )
    )
    .run();
