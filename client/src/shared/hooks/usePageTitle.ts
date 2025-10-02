import { useEffect } from 'react';

/**
 * Хук для установки динамического заголовка страницы
 * @param title - заголовок страницы (без префикса "WOP:")
 */
export function usePageTitle(title: string) {
    useEffect(() => {
        // Устанавливаем заголовок страницы с префиксом "WOP:"
        document.title = `Romario: ${title}`;

        // Очищаем заголовок при размонтировании компонента
        return () => {
            document.title = 'WOP';
        };
    }, [title]);
}
