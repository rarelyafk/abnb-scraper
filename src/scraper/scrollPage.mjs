async function scrollPage(page) {
  await page.evaluate(async () => {
    let scrollPosition = 0
    let documentHeight = document.body.scrollHeight

    while (documentHeight > scrollPosition) {
      window.scrollBy(0, documentHeight)
      await new Promise(resolve => {
        setTimeout(resolve, 1000)
      })
      scrollPosition = documentHeight
      documentHeight = document.body.scrollHeight
    }
  });
  // await page.evaluate(() => new Promise((resolve) => {
  //   let scrollTop = -1;
  //   const interval = setInterval(() => {
  //     window.scrollBy(0, 100);
  //     if(document.documentElement.scrollTop !== scrollTop) {
  //       scrollTop = document.documentElement.scrollTop;
  //       return;
  //     }
  //     clearInterval(interval);
  //     resolve();
  //   }, 10);
  // }));
};

export default scrollPage;
