export { getAllNewsThunk, newsReducer, type INewsItem } from "./news";
export {
  getAllProductImagesThunk,
  productsReducer,
  type IProductImage,
  type IProductArrayType,
  type ICreateProduct,
  editOneProduct,
  deleteOneProduct,
  updateFullProductThunk,
  deleteProductThunk,
} from "./products";
export { getProductsThunk, infoReducer, type IProduct } from "./info";
export { getAllVacanciesThunk, vacancyReducer, type IVacancy } from "./vacancy";
export {
  getAllContactsThunk,
  contactReducer,
  type MainContact,
  CONTACT_API_ROUTES,
} from "./contact";

export {
  type IUser,
  type ISignInData,
  type ISignUpData,  
  USER_API_ROUTES,
  UserValidator,
  signOutThunk,
  signInThunk,
  signUpThunk,
  refreshTokensThunk,
  userReducer,
} from "./user";

// admin
export {
  type IAdminMainContact,
  getMainContactThunk,
  updateMainContactThunk,
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
  editOneNews,
  deleteOneNews,
  editOneVacancy,
  deleteOneVacancy,
  type IOrder,
  type OrderArrayType,
  type IAdminVacancy,
  type ICreateAdminVacancy,
  type AdminVacancyArrayType,
  getAllAdminVacanciesThunk,
  getVacancyByIdThunk,
  createVacancyThunk,
  updateVacancyThunk,
  deleteVacancyThunk,
} from "./admin";

// calculations
export {
  getOrdersByDateThunk,
  calculationsReducer,
  type IOrder as ICalculationOrder,
  CALCULATIONS_API_ROUTES,
} from "./calculations";

// categories
export {
  getAllCategoriesThunk,
  categoriesReducer,
  type ICreateCategory,
  type ICategory,
  type CategoriesArrayType,
  CATEGORIES_API_ROUTES,
} from "./categories";

// partner
export {
  getAllPartnersThunk,
  getAllPartnersWithUserThunk,
  getPartnerByIdThunk,
  createPartnerThunk,
  updatePartnerThunk,
  deletePartnerThunk,
  partnerReducer,
  editOnePartner,
  deleteOnePartner,
  type IPartner,
  type ICreatePartner,
  type PartnersArrayType,
  type IPartnerWithUser,
  type ICreatePartnerWithUser,
  type PartnersArrayWithUserType,
  PARTNER_API_ROUTES,
} from "./partner";