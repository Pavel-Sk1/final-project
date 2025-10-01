export {
  partnerReducer,
  editOnePartner,
  deleteOnePartner,
} from "./slice/partnerSlice";
export {
  type IPartner,
  type ICreatePartner,
  type PartnersArrayType,
  type IPartnerWithUser,
  type PartnersArrayWithUserType,
  type ICreatePartnerWithUser,
  PARTNER_API_ROUTES,
} from "./model";
export {
  getAllPartnersThunk,
  getAllPartnersWithUserThunk,
  getPartnerByIdThunk,
  createPartnerThunk,
  updatePartnerThunk,
  deletePartnerThunk,
} from "./api/partnerThunkApi";
