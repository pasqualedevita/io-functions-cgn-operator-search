import { Model } from "sequelize";

import { ProductCategoryEnumModelType } from "./ProductCategories";

export default class OfflineMerchantModel extends Model {
  public readonly id!: string;
  public readonly name!: string;
  public readonly product_categories!: ReadonlyArray<
    ProductCategoryEnumModelType
  >;
  public readonly address!: string;
  public readonly latitude!: number | undefined;
  public readonly longitude!: number | undefined;
  public readonly distance!: number | undefined;
}
