const scrollPage = async (page) => {
  await page.evaluate(async () => {
    let [scrollPosition, documentHeight] = [0, document.body.scrollHeight];

    while (documentHeight > scrollPosition) {
      window.scrollBy(0, documentHeight);
      // NOTE: setTimeout's without clearTimeout's = BAD PRACTICE
      await new Promise(resolve => setTimeout(resolve, 1000));
      [scrollPosition, documentHeight] = [documentHeight, document.body.scrollHeight];
    }
  });
};

export default scrollPage;
