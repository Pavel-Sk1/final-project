export { partnerReducer } from './slice/partnerSlice';
export { type IPartner, type ICreatePartner, type PartnersArrayType, PARTNER_API_ROUTES } from './model';
export { getAllPartnersThunk, getPartnerByIdThunk, createPartnerThunk, updatePartnerThunk, deletePartnerThunk } from './api/partnerThunkApi';