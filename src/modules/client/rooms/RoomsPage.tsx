'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  RoomsHeroDesktop,
  RoomGridCard,
  RoomListCard,
  ViewToggle,
  RoomsHeroMobile,
  RoomsFiltersMobile,
  RoomCardMobile,
} from './components';
import { useClientRooms } from './hooks/useClientRooms';
import styles from './RoomsPage.module.css';

function RoomsFiltersDesktopDynamic({
  activeFilter,
  count,
  onFilterChange,
  filters,
}: {
  activeFilter: string;
  count: number;
  onFilterChange: (filter: string) => void;
  filters: { id: string; label: string }[];
}) {
  return (
    <div className={styles.filtersBar}>
      <div className={styles.filtersInner}>
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`${styles.filterBtn} ${activeFilter === f.id ? styles.active : ''}`}
            onClick={() => onFilterChange(f.id)}
          >
            {f.label}
          </button>
        ))}
        <span className={styles.filtersCount}>{count} phòng</span>
      </div>
    </div>
  );
}

export default function RoomsPage() {
  const searchParams = useSearchParams();
  const urlFilter = searchParams.get('concept') || 'all';

  const { allRooms, filters, loading, error, getRoomsByFilter } = useClientRooms();
  const [activeFilter, setActiveFilter] = useState(urlFilter);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (urlFilter) setActiveFilter(urlFilter);
  }, [urlFilter]);

  const filteredRooms = getRoomsByFilter(activeFilter);

  return (
    <div className="w-full">
      {/* Desktop */}
      <div className="hide-mobile">
        <RoomsHeroDesktop />
        <RoomsFiltersDesktopDynamic
          activeFilter={activeFilter}
          count={filteredRooms.length}
          onFilterChange={setActiveFilter}
          filters={filters}
        />
        <section className={styles.roomsSection}>
          <div className={styles.container}>
            <ViewToggle view={view} onChange={setView} count={filteredRooms.length} />

            {loading ? (
              <div className={styles.empty}>
                <div className={styles.emptyTitle}>Đang tải...</div>
              </div>
            ) : error ? (
              <div className={styles.empty}>
                <div className={styles.emptyTitle}>Lỗi</div>
                <div className={styles.emptySub}>{error}</div>
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className={styles.empty}>
                <div className={styles.emptyTitle}>Chưa có phòng nào</div>
                <div className={styles.emptySub}>Hãy thử bộ lọc khác.</div>
              </div>
            ) : (
              <>
                <div className={styles.grid} style={{ display: view === 'grid' ? undefined : 'none' }}>
                  {filteredRooms.map((room, i) => (
                    <RoomGridCard key={room.id} room={room} delay={i * 0.08} />
                  ))}
                </div>
                <div className={styles.list} style={{ display: view === 'list' ? undefined : 'none' }}>
                  {filteredRooms.map((room, i) => (
                    <RoomListCard key={room.id} room={room} delay={i * 0.08} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      {/* Mobile */}
      <div className="show-mobile-only">
        <RoomsHeroMobile />
        <RoomsFiltersMobile
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          filters={filters}
        />
        <section className={styles.roomsSectionMobile}>
          <div className={styles.roomsHeader}>
            <span className={styles.roomsCount}>
              {loading ? '...' : `${filteredRooms.length} phòng`}
            </span>
          </div>

          {loading ? (
            <div className={styles.empty}>
              <div className={styles.emptyTitle}>Đang tải...</div>
            </div>
          ) : error ? (
            <div className={styles.empty}>
              <div className={styles.emptyTitle}>Lỗi</div>
              <div className={styles.emptySub}>{error}</div>
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyTitle}>Chưa có phòng nào</div>
              <div className={styles.emptySub}>Hãy thử bộ lọc khác.</div>
            </div>
          ) : (
            <div className={styles.mobileList}>
              {filteredRooms.map((room, i) => (
                <RoomCardMobile key={room.id} room={room} delay={i * 0.08} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
