export function Homepage() {
  return (
    <main className="homepage">
      <section className="homepage-hero">
        <p className="eyebrow">Working-title public good communications project</p>
        <h1>Freexster</h1>
        <p className="lede">Foundation preview for private inboxing, public channels, and trust registry work.</p>
        <div className="homepage-actions">
          <a className="button primary" href="#downloads">Desktop preview plan</a>
          <a className="button" href="#channels">Explore public channels surface</a>
        </div>
      </section>
      <section className="homepage-grid" id="downloads">
        <article>
          <h2>Private inbox</h2>
          <p>The first desktop build will provide a SimpleX-backed private inbox experience.</p>
        </article>
        <article id="channels">
          <h2>Public channels</h2>
          <p>This web surface is meant for browsing curated public topic channels and planned proof views.</p>
        </article>
        <article>
          <h2>Trust registry</h2>
          <p>Early trust registry work is designed for ICP canisters, stewardship records, and certified public data.</p>
        </article>
      </section>
    </main>
  );
}
