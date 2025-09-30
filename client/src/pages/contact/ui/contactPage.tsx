import { getAllContactsThunk, type MainContact } from '@/entities'
import { useAppDispatch, useAppSelector } from '@/shared'
import { useEffect, useState } from 'react'
import styles from './ContactPage.module.css'
import { YMaps, Map, ObjectManager } from '@pbe/react-yandex-maps'
import { geocode } from '@/features/geocoder/lib/geocoder'
import { formatPhonePretty, formatTelHref } from '@/shared/lib/phone'

export function ContactPage() {
  const dispatch = useAppDispatch()
  const { loading, error, contacts } = useAppSelector((state) => state.contact)
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!contacts || contacts.length === 0) return;
    geocode(contacts[0].address).then(coords => {
      if (coords) {
        setCoordinates([coords.lat, coords.lon]);
      } else {
        setCoordinates([55.75, 37.57]); // Москва по умолчанию, если не нашли координаты
      }
    });
  }, [contacts])

  useEffect(() => {
    dispatch(getAllContactsThunk())
  }, [dispatch])

  // форматирование вынесено в shared/lib/phone.ts

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Загрузка контактов...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Ошибка загрузки: {error}</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Контакты</h1>
        <p className={styles.subtitle}>Свяжитесь с нами любым удобным способом</p>

        <div className={styles.grid}>
          {contacts.length > 0 ? (
            contacts.map((contact: MainContact) => (
              <div key={contact.id} className={styles.card}>
                <h3 className={styles.cardTitle}>{contact.name}</h3>
                <div className={styles.info}>
                  <div className={styles.item}>
                    <span className={styles.label}>Email:</span>
                    <a href={`mailto:${contact.email}`} className={styles.link}>
                      {contact.email}
                    </a>
                  </div>
                  <div className={styles.item}>
                    <span className={styles.label}>Телефон:</span>
                    <a href={formatTelHref(contact.phone as unknown as string)} className={styles.link}>
                      {formatPhonePretty(contact.phone as unknown as string)}
                    </a>
                  </div>
                  <div className={styles.item}>
                    <span className={styles.label}>Telegram:</span>
                    <a href={contact.telegram} target="_blank" rel="noopener noreferrer" className={styles.link}>
                      {contact.telegram.replace('https://t.me/', '@')}
                    </a>
                  </div>
                  <div className={styles.item}>
                    <span className={styles.label}>Адрес:</span>
                    <span className={styles.text}>{contact.address}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.empty}>Контакты не найдены</div>
          )}
        <div className={styles.map}>
          <YMaps>
            <Map state={{ center: coordinates || [55.75, 37.57], zoom: 12 }} width="100%" height="100%">
              <ObjectManager
                options={{
                  clusterize: false,
                  gridSize: 64,
                }}
                objects={{
                  openBalloonOnClick: true,
                  preset: 'islands#greenDotIcon',
                }}
                clusters={{
                  preset: 'islands#greenClusterIcons',
                }}
                features={coordinates ? [
                  {
                    type: 'Feature',
                    id: 1,
                    geometry: { type: 'Point', coordinates },
                    properties: {
                      balloonContent: `<div class="${styles.balloon}">
  <div class="${styles.balloonTitle}">${contacts[0].name}</div>
  <div class="${styles.balloonAddress}">${contacts[0].address}</div>
</div>`,
                      hintContent: `<div class="${styles.hint}">
  <div class="${styles.hintTitle}">${contacts[0].name}</div>
  <div class="${styles.hintAddress}">${contacts[0].address}</div>
</div>`,
                    },
                  },
                ] : []}
                modules={[
                  'objectManager.addon.objectsBalloon',
                  'objectManager.addon.objectsHint',
                ]}
              />
            </Map>
          </YMaps>
        </div>
        </div>
      </div>
    </div>
  )
}