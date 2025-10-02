import { useState, useEffect, useMemo } from "react";
import styles from "./HomePage.module.css";
import { useAppDispatch, useAppSelector, usePageTitle } from "@/shared";
import { useTransition, animated } from "@react-spring/web";
import { getAllNewsThunk, getAllProductImagesThunk } from "@/entities";

export function HomePage() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const news = useAppSelector((s) => s.news.list);
  const productImages = useAppSelector((s) => s.products.images);
  const [newsIndex, setNewsIndex] = useState<number>(0);

  usePageTitle("Главная");

  const imagesPerSlide = 4;
  const images = useMemo(
    () => productImages.map((p) => p.img).filter(Boolean) as string[],
    [productImages]
  );
  const totalImages = images.length;

  useEffect(() => {
    dispatch(getAllNewsThunk());
    dispatch(getAllProductImagesThunk());
  }, [dispatch]);

  useEffect(() => {
    if (images.length > 0) {
      images.forEach((imageSrc) => {
        const img = new Image();
        img.src = imageSrc;
      });
    }
  }, [images]);

  useEffect(() => {
    if (!news || news.length === 0) return;
    const id = setInterval(() => {
      setNewsIndex((prev) => (prev + 1) % news.length);
    }, 10000);
    return () => clearInterval(id);
  }, [news]);

  useEffect(() => {
    if (
      !images ||
      images.length === 0 ||
      totalImages <= imagesPerSlide ||
      isPaused
    )
      return;

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
    from: { opacity: 0, y: 2 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: -2 },
    config: { tension: 300, friction: 30 },
  });

  const nextSlide = () => {
    setCurrentSlide((prev: number) => (prev + 1) % totalImages);
  };

  const prevSlide = () => {
    setCurrentSlide((prev: number) => (prev - 1 + totalImages) % totalImages);
  };

  const getVisibleImages = useMemo(() => {
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
  }, [images, currentSlide, totalImages, imagesPerSlide]);

  return (
    <div className={styles.mainPage}>
      <div className={styles.banner}>
        <div className={styles.newsTicker}>
          {news.length > 0 ? (
            newsTransition((style, item) => (
              <animated.div
                style={style}
                className={`${styles.newsCard} ${styles.animatedNewsCard}`}
              >
                {item?.img ? (
                  <img
                    className={styles.newsImage}
                    src={item.img as string}
                    alt={item.title}
                  />
                ) : (
                  <div className={styles.newsImagePlaceholder}>Ромарио</div>
                )}
                <div className={styles.newsContent}>
                  <h3 className={styles.newsTitle}>{item?.title}</h3>
                  {item?.description && (
                    <p className={styles.newsDescription}>{item.description}</p>
                  )}
                </div>
              </animated.div>
            ))
          ) : (
            <div className={styles.newsEmpty}>Новости скоро появятся</div>
          )}
        </div>
      </div>
      <section className={styles.about}>
        <div className={styles.container}>
          <h1 className={styles.aboutHeading} id="about">
            О нас
          </h1>
          <div className={styles.aboutCard}>
            <h2 className={styles.aboutTitle}>
              Мы рядом, чтобы кормить вкусно
            </h2>
            <div className={styles.aboutText}>
              <p>
                Мы — небольшое семейное производство, создающее вкусную и
                качественную свежую выпечку, салаты, первые и вторые блюда. Наша
                главная ценность — забота о каждом клиенте и внимательное
                отношение к ингредиентам и рецептам.
              </p>
              <p>
                Всё, что мы готовим, создаётся с любовью и соблюдением традиций,
                при этом мы используем только свежие и натуральные продукты без
                лишних консервантов и добавок.
              </p>
              <p>
                Мы гордимся тем, что наши блюда находят отклик у многих дилеров
                и их клиентов, предлагая отличный вкус и стабильное качество.
                Наша миссия — сделать ваш ассортимент вкуснее и разнообразнее,
                чтобы вместе радовать людей вкусной и полезной едой.
              </p>
              <p>
                Семейные традиции, внимание к деталям и стремление к
                совершенству — вот что стоит за каждым кусочком нашей продукции.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className={styles.categories} id="products">
        <div className={styles.container}>
          <h1 className={styles.aboutHeading}>Наша продукция</h1>
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
                  <animated.div
                    style={style}
                    className={`${styles.images_grid} ${styles.animatedSliderGrid}`}
                  >
                    {getVisibleImages.map((image, index) => (
                      <div
                        key={`${currentSlide}-${index}`}
                        className="image-item"
                      >
                        <img
                          src={image}
                          alt={`Изображение ${index + 1}`}
                          className={styles.slider_image}
                          loading="eager"
                          decoding="async"
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
                  className={`slider-dot ${
                    index === currentSlide ? "slider-dot--active" : ""
                  }`}
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
