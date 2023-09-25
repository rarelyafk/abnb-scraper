import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { executablePath } from 'puppeteer';

puppeteer.use(StealthPlugin());

const getBrowserInstance = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1920,1080", "--single-process"],
    executablePath: executablePath(),
  });

  const page = (await browser.pages())[0];
  await page.setViewport({
    width: 1600,
    height: 900,
  });
  page.setDefaultNavigationTimeout(60000);

  const closeBrowser = async () => await browser.close();

  return { page, closeBrowser };
};

export default getBrowserInstance;
