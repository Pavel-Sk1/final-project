export { type IProductImage, PRODUCTS_API_ROUTES, type IProductArrayType, type ICreateProduct, type IProduct } from './model';
export { getAllProductImagesThunk, getAllProductsThunk, createProductThunk, updateFullProductThunk, deleteProductThunk } from './api/productsThunkApi';
export { productsReducer } from './slice/productsSlice';


