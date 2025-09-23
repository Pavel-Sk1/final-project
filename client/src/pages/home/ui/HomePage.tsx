import { useState, useEffect } from "react";
import styles from "./HomePage.module.css";

const mockImages = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=200fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop",
  "https://images.unsplash.com/photo-1501594907352-04dda38eb770?w=400&h=200&fit=crop",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=200&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop"
];

export function HomePage() {
  const [images] = useState<string[]>(mockImages);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const imagesPerSlide = 4;
  const totalImages = images.length;

  useEffect(() => {
    if (!images || images.length === 0 || totalImages <= imagesPerSlide || isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev: number) => (prev + 1) % totalImages);
    }, 3000); 

    return () => clearInterval(interval);
  }, [images, totalImages, isPaused]);

  const nextSlide = () => {
    setCurrentSlide((prev: number) => (prev + 1) % totalImages);
  };

  const prevSlide = () => {
    setCurrentSlide((prev: number) => (prev - 1 + totalImages) % totalImages);
  };

  const getVisibleImages = () => {
    if (!images || images.length === 0) {
      return [];
    }
    
    const visibleImages = [];
    for (let i = 0; i < imagesPerSlide; i++) {
      const index = (currentSlide + i) % totalImages;
      const image = images[index];
      if (image) {
        visibleImages.push(image);
      }
    }
    return visibleImages;
  };

  return (
    <div className={styles.mainPage}>      
      <div className={styles.banner}>
        <h1>Новости и актуальная информация</h1>
      </div>
      <div className={styles.banner}>
        <h1>О нас</h1>
      </div>
        <section className={styles.categories}>
        <div className={styles.container}>
          <h1>Наша продукция</h1>
          <div 
            className={styles.images_slider_container}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <button 
              className={styles.slider_btn} 
              onClick={prevSlide}
              disabled={totalImages <= imagesPerSlide}
              aria-label="Предыдущие изображения"
            >
              ‹
            </button>
            <div className={styles.images_slider}>
              <div className={styles.images_grid}>
                {getVisibleImages().map((image, index) => (
                  <div key={`${currentSlide}-${index}`} className="image-item">
                    <img 
                      src={image} 
                      alt={`Изображение ${index + 1}`}
                      className={styles.slider_image}
                    />
                  </div>
                ))}
              </div>
            </div>
            <button 
              className= {styles.slider_btn} 
              onClick={nextSlide}
              disabled={totalImages <= imagesPerSlide}
              aria-label="Следующие изображения"
            >
              ›
            </button>
          </div>
          {totalImages > imagesPerSlide && (
            <div className={styles.slider_dots}>
              {Array.from({ length: totalImages }).map((_, index) => (
                <button
                  key={index}
                  className={`slider-dot ${index === currentSlide ? 'slider-dot--active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Перейти к изображению ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
        </section>
        </div>
  );
}
