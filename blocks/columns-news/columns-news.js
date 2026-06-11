export default function decorate(block) {
  const row = block.firstElementChild;
  const [textCol, imageCol] = [...row.children];

  // --- Text column: wrap each news link p into an item with a separate "Read More" link ---
  const allButtonPs = [...textCol.querySelectorAll('p.button-container')];
  const ctaP = allButtonPs.at(-1); // last p = Visit the Newsroom CTA
  const newsPs = allButtonPs.slice(0, -1);

  newsPs.forEach((p) => {
    const a = p.querySelector('a');
    if (!a) return;
    const item = document.createElement('div');
    item.className = 'columns-news-item';

    const title = document.createElement('p');
    title.className = 'columns-news-item-title';
    title.textContent = a.textContent.trim();

    const readMore = document.createElement('a');
    readMore.href = a.href;
    readMore.className = 'columns-news-read-more';
    readMore.innerHTML = 'Read More <span aria-hidden="true">›</span>';

    item.append(title, readMore);
    p.replaceWith(item);
  });

  // Mark the CTA paragraph
  if (ctaP) ctaP.classList.add('columns-news-cta');

  textCol.className = 'columns-news-text';

  // --- Image column: build collage from pictures ---
  const pictures = [...imageCol.querySelectorAll('picture')];
  const collage = document.createElement('div');
  collage.className = 'columns-news-collage';

  pictures.forEach((pic, i) => {
    const wrapper = document.createElement('div');
    wrapper.className = `columns-news-img columns-news-img-${i + 1}`;
    const img = pic.querySelector('img');
    if (img) img.loading = i === 0 ? 'eager' : 'lazy';
    wrapper.append(pic);
    collage.append(wrapper);
  });

  // Two orange accent shapes (CSS only, no content needed)
  const accent1 = document.createElement('div');
  accent1.className = 'columns-news-accent columns-news-accent-1';
  const accent2 = document.createElement('div');
  accent2.className = 'columns-news-accent columns-news-accent-2';
  collage.append(accent1, accent2);

  imageCol.replaceWith(collage);
}
