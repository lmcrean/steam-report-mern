await page.addInitScript(() => {
  window._lastAlert = null;
  window.alert = (msg) => {
    window._lastAlert = msg;
  };
});
