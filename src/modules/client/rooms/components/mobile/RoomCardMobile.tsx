'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Room } from '../../models/rooms.model';
import styles from './RoomCardMobile.module.css';

interface Props {
  room: Room;
  delay?: number;
}

export default function RoomCardMobile({ room, delay = 0 }: Props) {
  return (
    <Link
      href={`/rooms/${room.concept}`}
      className={styles.card}
      style={{ transitionDelay: `${delay}s` }}
    >
      <div className={styles.image}>
        <Image
          src={room.img}
          alt={`${room.name} room`}
          fill
          className={styles.img}
          sizes="100vw"
        />
        <span className={styles.num}>{room.num}</span>
        <div className={styles.overlay} />
      </div>

      <div className={styles.body}>
        <div className={styles.concept}>Concept — {room.concept}</div>
        <div className={styles.name}>{room.name}</div>
        <p className={styles.desc}>{room.desc}</p>
        <div className={styles.features}>
          {room.features.map((f) => (
            <span key={f} className={styles.feature}>{f}</span>
          ))}
        </div>
        <div className={styles.footer}>
          <div className={styles.price}>
            <strong>{room.price}k</strong> VND / night
          </div>
          <div className={styles.bookBtn}>
            Book
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M1 4h10M8 1l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
