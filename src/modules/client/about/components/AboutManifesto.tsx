'use client';

import styles from './AboutManifesto.module.css';

export default function AboutManifesto() {
  return (
    <section className={`${styles.manifesto} reveal-fade-up`}>
      <div className={styles.manifestoInner}>
        <div className={styles.manifestoAside}>
          <div className={styles.manifestoAsideLabel}>
            <span className={styles.goldLine} />
            <span>Philosophy</span>
          </div>
          <div className={styles.manifestoAsideNum}>01</div>
        </div>
        <div className={`${styles.manifestoBody} reveal-fade-up`}>
          <h2 className={styles.manifestoPull}>
            People remember<br /><em>feelings,</em><br />not floor plans.
          </h2>
          <div className={styles.manifestoText}>
            <p>
              We design each room with a single clear atmosphere — then remove anything that
              does not serve that mood. The result is a space that feels intentional. Every
              object has a reason; everything else has been edited out.
            </p>
            <p>
              We care about materials, light, and quiet details — the kind you notice slowly.
              The texture of a linen pillow. The way afternoon light moves across concrete.
              The silence between sounds. These are the things that make a stay memorable.
            </p>
            <p>
              Another House is not trying to be everything. It is trying to be exactly one
              thing, done very well.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
