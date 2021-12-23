// eslint-disable @typescript-eslint/no-explicit-any

import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import { ProductCategoryEnum } from "../../generated/definitions/ProductCategory";

import { OptionalProductCategoryListMiddleware } from "../optional_product_category_list_middleware";

const middleware = OptionalProductCategoryListMiddleware("param");

describe("OptionalProductCategoryListMiddleware", () => {
  it("should respond with none if the parameter is missing", async () => {
    const result = await middleware({
      query: {}
    } as any);

    expect(E.isRight(result)).toBeTruthy();
    expect(E.isRight(result)).toBeTruthy();
    if (E.isRight(result)) {
      const maybeValue = result.right;
      expect(O.isNone(maybeValue)).toBeTruthy();
    }
  });

  it("should respond with a validation error if the parameter is present but NOT valid", async () => {
    const result = await middleware({
      query: {
        param: "something"
      }
    } as any);

    expect(E.isLeft(result)).toBeTruthy();
    if (E.isLeft(result)) {
      expect(result.left.kind).toBe("IResponseErrorValidation");
    }
  });

  it("should extract the parameter if it is present and valid", async () => {
    const result = await middleware({
      query: {
        param: "shopping,entertainment"
      }
    } as any);

    expect(E.isRight(result)).toBeTruthy();
    if (E.isRight(result)) {
      const maybeValue = result.right;
      expect(O.isSome(maybeValue)).toBeTruthy();
      if (O.isSome(maybeValue)) {
        const value = maybeValue.value;
        expect(value).toStrictEqual([
          ProductCategoryEnum.shopping,
          ProductCategoryEnum.entertainment
        ]);
      }
    }
  });
});
