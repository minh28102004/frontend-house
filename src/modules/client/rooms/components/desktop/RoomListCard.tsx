'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Room } from '../../models/rooms.model';
import styles from './RoomListCard.module.css';

interface Props {
  room: Room;
  delay?: number;
}

export default function RoomListCard({ room, delay = 0 }: Props) {
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
          sizes="(max-width: 900px) 100vw, 340px"
        />
        <div className={styles.numBadge}>{room.num}</div>
      </div>

      <div className={styles.body}>
        <div className={styles.top}>
          <div className={styles.concept}>Concept — {room.concept}</div>
          <div className={styles.name}>{room.name}</div>
          <p className={styles.desc}>{room.desc}</p>
          <div className={styles.features}>
            {room.features.map((f) => (
              <span key={f} className={styles.feature}>{f}</span>
            ))}
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.pricing}>
            <div className={styles.priceLabel}>From</div>
            <div className={styles.price}>
              {room.price}k<span className={styles.priceUnit}>VND / night</span>
            </div>
          </div>
          <div className={styles.book}>
            <span>Book this room</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
