// eslint-disable @typescript-eslint/no-explicit-any

import * as t from "io-ts";

import { isLeft, isRight } from "fp-ts/lib/Either";
import { isNone, isSome } from "fp-ts/lib/Option";

import { OptionalQueryParamMiddleware } from "../optional_query_param";

const middleware = OptionalQueryParamMiddleware("param", t.string);

describe("OptionalParamMiddleware", () => {
  it("should respond with none if the parameter is missing", async () => {
    const result = await middleware({
      query: {}
    } as any);

    expect(isRight(result)).toBeTruthy();
    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      const maybeValue = result.value;
      expect(isNone(maybeValue)).toBeTruthy();
    }
  });

  it("should respond with a validation error if the parameter is present but NOT valid", async () => {
    const result = await middleware({
      query: {
        param: 5
      }
    } as any);

    expect(isLeft(result)).toBeTruthy();
    if (isLeft(result)) {
      expect(result.value.kind).toBe("IResponseErrorValidation");
    }
  });

  it("should extract the parameter if it is present and valid", async () => {
    const result = await middleware({
      query: {
        param: "hello"
      }
    } as any);

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      const maybeValue = result.value;
      expect(isSome(maybeValue)).toBeTruthy();
      if (isSome(maybeValue)) {
        const value = maybeValue.value;
        expect(value).toBe("hello");
      }
    }
  });
});
