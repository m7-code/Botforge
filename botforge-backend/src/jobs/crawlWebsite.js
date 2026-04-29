import axios from 'axios';
import * as cheerio from 'cheerio';
import { encode } from 'gpt-tokenizer';
import prisma from '../lib/prisma.js';

// Text ko chunks mein split karne ka function
function splitIntoChunks(text, maxTokens = 500, overlap = 50) {
  const words = text.split(' ').filter(w => w.trim().length > 0);
  const chunks = [];
  let current = [];
  let tokenCount = 0;

  for (const word of words) {
    const wordTokens = encode(word).length;
    if (tokenCount + wordTokens > maxTokens) {
      const chunkText = current.join(' ').trim();
      if (chunkText.length > 50) chunks.push(chunkText);
      current = current.slice(-overlap);
      tokenCount = encode(current.join(' ')).length;
    }
    current.push(word);
    tokenCount += wordTokens;
  }

  if (current.length > 0) {
    const chunkText = current.join(' ').trim();
    if (chunkText.length > 50) chunks.push(chunkText);
  }

  return chunks;
}

// Same domain check
function isSameDomain(href, baseUrl) {
  try {
    const base = new URL(baseUrl);
    const url = new URL(href, baseUrl);
    return url.hostname === base.hostname;
  } catch {
    return false;
  }
}

// Asset URLs exclude karne ka function
function isAssetUrl(href) {
  return /\.(pdf|jpg|jpeg|png|gif|css|js|svg|ico|xml|zip|mp4|mp3|avi|mov|webm|woff|woff2|ttf|eot|otf|map)$/i.test(href);
}

// Page se clean text extract karo
function extractText($page) {
  // Sab unnecessary elements remove karo
  $page([
    'nav', 'footer', 'header', 'script', 'style', 'noscript',
    'img', 'video', 'audio', 'figure', 'picture', 'svg',
    '.navbar', '.footer', '.header', '.sidebar', '.menu',
    '.nav', '.navigation', '.cookie', '.popup', '.modal',
    '.banner', '.advertisement', '.ads', '.social-links',
    '.breadcrumb', '.pagination', '.comments', 'form',
    'button', 'input', 'select', 'textarea', 'iframe',
    '.widget', '.related-posts', '.tags', '.share-buttons'
  ].join(', ')).remove();

  // Main content area dhundo
  const mainSelectors = [
    'main', 'article', '[role="main"]',
    '.main-content', '#main-content',
    '.content', '#content',
    '.page-content', '#page-content',
    '.post-content', '.entry-content',
    '.container', '#main', '.wrapper'
  ];

  let text = '';

  for (const selector of mainSelectors) {
    const el = $page(selector);
    if (el.length > 0) {
      text = el.text();
      break;
    }
  }

  // Agar koi main content nahi mila to body use karo
  if (!text || text.trim().length < 100) {
    text = $page('body').text();
  }

  // Text clean karo
  const cleaned = text
    .replace(/\t/g, ' ')
    .replace(/\r/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ ]{2,}/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned;
}

export async function crawlWebsite(websiteId) {
  const website = await prisma.websites.findUnique({ where: { id: websiteId } });
  if (!website) throw new Error('Website not found');

  // Step 1 — Status crawling
  await prisma.websites.update({
    where: { id: websiteId },
    data: { status: 'crawling' },
  });

  console.log(`🕷️ Crawling: ${website.url}`);

  try {
    // Step 2 — Homepage fetch
    const { data: html } = await axios.get(website.url, {
      timeout: 15000,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BotForge/1.0)' }
    });
    const $ = cheerio.load(html);

    // Website name extract karo
    const websiteName = $('title').text().trim() || website.url;
    await prisma.websites.update({
      where: { id: websiteId },
      data: { name: websiteName }
    });

    // Step 3 — Links extract karo
    const links = new Set();
    links.add(website.url);

    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (!href) return;
      try {
        const full = new URL(href, website.url).toString();
        const cleanUrl = full.split('#')[0].split('?')[0]; // Remove fragments & query strings
        if (
          isSameDomain(cleanUrl, website.url) &&
          !isAssetUrl(cleanUrl) &&
          !cleanUrl.includes('sitemap') &&
          !cleanUrl.includes('wp-admin') &&
          !cleanUrl.includes('wp-login')
        ) {
          links.add(cleanUrl);
        }
      } catch {}
    });

    // Step 4 — Limit 100
    const urls = [...links].slice(0, 100);
    console.log(`Found ${urls.length} URLs`);

    let pagesCrawled = 0;
    const allChunks = [];

    // Step 5 — Har URL crawl karo
    for (const url of urls) {
      try {
        const { data: pageHtml } = await axios.get(url, {
          timeout: 15000,
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BotForge/1.0)' }
        });
        const $page = cheerio.load(pageHtml);

        // Title
        const title = $page('title').text().trim();

        // Step 5 & 6 — Clean text extract karo
        const cleaned = extractText($page);

        if (cleaned.length < 100) {
          console.log(`⏭️ Skipped (too short): ${url}`);
          continue;
        }

        // Step 7 — Chunks banao
        const chunks = splitIntoChunks(cleaned);

        if (chunks.length === 0) continue;

        chunks.forEach((chunk, index) => {
          allChunks.push({
            websiteId,
            source_url: url,
            content: chunk,
            chunk_index: index,
            metadata: {
              title,
              word_count: chunk.split(' ').length,
              url
            },
          });
        });

        pagesCrawled++;
        console.log(`✅ Crawled: ${url} → ${chunks.length} chunks`);

      } catch (err) {
        console.log(`⚠️ Failed: ${url} → ${err.message}`);
      }
    }

    // Step 9 — Database mein save karo
    for (const chunk of allChunks) {
      await prisma.content_chunks.create({ data: chunk });
    }

    // Step 10 — Status ready
    await prisma.websites.update({
      where: { id: websiteId },
      data: { status: 'ready', pages_crawled: pagesCrawled },
    });

    console.log(`✅ Done! ${pagesCrawled} pages, ${allChunks.length} chunks`);
    return { pagesCrawled, chunksCreated: allChunks.length };

  } catch (err) {
    await prisma.websites.update({
      where: { id: websiteId },
      data: { status: 'failed' },
    });
    console.error(`❌ Crawl failed:`, err.message);
    throw err;
  }
}