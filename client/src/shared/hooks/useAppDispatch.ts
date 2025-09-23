// Импортируем типы из нашего собственного хранилища и встроенных хуков Redux
import type { AppDispatch } from "@/app/store/store";
import { useDispatch } from "react-redux";

// Создаем пользовательский хук для получения диспетчера с правильным типом
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
