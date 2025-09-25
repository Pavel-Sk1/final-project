
export { getAllNewsThunk, newsReducer, type INewsItem } from './news'
export { getAllProductImagesThunk, productsReducer, type IProductImage } from './products'
export { getProductsThunk, infoReducer, type IProduct } from './info'

export {
  type IUser,
  type ISignInData,
  type ISignUpData,
  UserValidator,
  signOutThunk,
  signInThunk,
  signUpThunk,
  refreshTokensThunk,
  userReducer,
} from "./user";

// admin
export {
  type ICreateAdminNews,
  type IAdminNews,
  type AdminNewsArrayType,
  type ICreateAdminProduct,
  type IAdminProduct,
  type AdminProductArrayType,
  ADMIN_API_ROUTES,
  getAllAdminNewsThunk,
  getNewsByIdThunk,
  createNewsThunk,
  updateNewsThunk,
  deleteNewsThunk,
  getAllProductsThunk,
  getProductByIdThunk,
  updateProductThunk,
  adminReducer,
  type IOrder,
  type OrderArrayType,
} from "./admin";

// calculations
export {
  getOrdersByDateThunk,
  calculationsReducer,
  type IOrder as ICalculationOrder,
  CALCULATIONS_API_ROUTES,
} from "./calculations";
