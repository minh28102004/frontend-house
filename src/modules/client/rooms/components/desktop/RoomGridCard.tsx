'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Room } from '../../models/rooms.model';
import styles from './RoomGridCard.module.css';

interface Props {
  room: Room;
  delay?: number;
}

export default function RoomGridCard({ room, delay = 0 }: Props) {
  return (
    <Link
      href={`/rooms/${room.concept}`}
      className={styles.card}
      style={{ transitionDelay: `${delay}s` }}
    >
      <div className={styles.imgWrap}>
        <Image
          src={room.img}
          alt={`${room.name} room`}
          fill
          className={styles.img}
          sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className={styles.overlay} />
      <div className={styles.body}>
        <div className={styles.num}>{room.num}</div>
        <div className={styles.name}>{room.name}</div>
        <div className={styles.price}>
          <strong>{room.price}k</strong> / night
        </div>
        <div className={styles.tags}>
          {room.features.map((f) => (
            <span key={f} className={styles.tag}>{f}</span>
          ))}
        </div>
        <div className={styles.cta}>
          Book room
          <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
            <path d="M1 4.5h10M7 1l3.5 3.5L7 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
