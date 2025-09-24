import { useState, useEffect } from "react";
import styles from "./HomePage.module.css";
import { useAppDispatch, useAppSelector } from '@/shared';
import { useTransition, animated, config } from "@react-spring/web";
import { getAllNewsThunk } from "@/entities";

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
  const dispatch = useAppDispatch();
  const news = useAppSelector((s) => s.news.list);
  const [newsIndex, setNewsIndex] = useState<number>(0);

  const imagesPerSlide = 4;
  const totalImages = images.length;

  useEffect(() => {
    dispatch(getAllNewsThunk());
  }, [dispatch]);

  useEffect(() => {
    if (!news || news.length === 0) return;
    const id = setInterval(() => {
      setNewsIndex((prev) => (prev + 1) % news.length);
    }, 10000);
    return () => clearInterval(id);
  }, [news]);

  useEffect(() => {
    if (!images || images.length === 0 || totalImages <= imagesPerSlide || isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev: number) => (prev + 1) % totalImages);
    }, 8000); 

    return () => clearInterval(interval);
  }, [images, totalImages, isPaused]);

  const currentNews = news.length ? news[newsIndex] : null;
  const newsTransition = useTransition(currentNews, {
    keys: (item) => (item ? item.id : newsIndex),
    from: { opacity: 0, y: 8 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: -8 },
    config: { tension: 140, friction: 18 },
  });

  const slideTransition = useTransition(currentSlide, {
    keys: (s) => s,
    from: { opacity: 0, y: 4 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: -4 },
    config: config.slow,
  });

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
        <div className={styles.newsTicker}>
          {news.length > 0 ? (
            newsTransition((style, item) => (
              <animated.div style={{ position: 'absolute', left: 16, right: 16, top: 0, ...style }} className={styles.newsCard}>
                {item?.img ? (
                  <img className={styles.newsImage} src={item.img as string} alt={item.title} />
                ) : (
                  <div className={styles.newsImagePlaceholder}>Ромарио</div>
                )}
                <div className={styles.newsContent}>
                  <h3 className={styles.newsTitle}>{item?.title}</h3>
                  {item?.discription && (
                    <p className={styles.newsDescription}>{item.discription}</p>
                  )}
                </div>
              </animated.div>
            ))
          ) : (
            <div className={styles.newsEmpty}>Новости скоро появятся</div>
          )}
        </div>
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
              <div className={styles.images_stage}>
                {slideTransition((style) => (
                  <animated.div style={{ position: 'absolute', left: 0, right: 0, top: 0, ...style }} className={styles.images_grid}>
                    {getVisibleImages().map((image, index) => (
                      <div key={`${currentSlide}-${index}`} className="image-item">
                        <img
                          src={image}
                          alt={`Изображение ${index + 1}`}
                          className={styles.slider_image}
                        />
                      </div>
                    ))}
                  </animated.div>
                ))}
              </div>
            </div>
            <button
              className={styles.slider_btn}
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
