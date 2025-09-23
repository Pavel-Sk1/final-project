// Импортируем типы из нашего собственного хранилища и встроенных хуков Redux
import type { RootState } from "@/app/store/store";
import { type TypedUseSelectorHook, useSelector } from "react-redux";

// Создаем пользовательский хук для использования селектора с правильным типом
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;