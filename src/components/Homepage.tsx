export function Homepage() {
  return (
    <main className="homepage">
      <section className="homepage-hero">
        <p className="eyebrow">Working-title public good communications project</p>
        <h1>Freexster</h1>
        <p className="lede">Private inbox + public topic channels + trust registry.</p>
        <div className="homepage-actions">
          <a className="button primary" href="#downloads">Desktop download</a>
          <a className="button" href="#channels">Browse public channels</a>
        </div>
      </section>
      <section className="homepage-grid" id="downloads">
        <article>
          <h2>Private inbox</h2>
          <p>Download the desktop app for private SimpleX-backed inbox features.</p>
        </article>
        <article id="channels">
          <h2>Public channels</h2>
          <p>Read curated public topic channels and verify registry proofs on the web.</p>
        </article>
        <article>
          <h2>Trust registry</h2>
          <p>Freexster uses ICP canisters for identity, stewardship, and certified public data.</p>
        </article>
      </section>
    </main>
  );
}
