const express = require('express');
const path = require('node:path');
const app = express();
const aliases = new Set(['playtest.html', 'online-play-szoba-v3-1.html', 'online-play-szoba-v3-2.html', 'online-play-szoba-v3-3.html']);
app.disable('x-powered-by');
app.use((req, res, next) => {
  // Enable only after DNS and HTTPS for azelsokkora.hu have been verified.
  if (process.env.REDIRECT_TO_CANONICAL === 'true' && req.hostname !== 'azelsokkora.hu') {
    return res.redirect(301, 'https://azelsokkora.hu' + req.originalUrl);
  }
  if (req.path === '/Elsokora' || req.path.startsWith('/Elsokora/')) {
    const destination = '/' + req.path.slice('/Elsokora'.length).replace(/^\/+/, '');
    return res.redirect(301, destination + req.originalUrl.slice(req.path.length));
  }
  if (req.path === '/index.html') return res.redirect(301, '/' + req.originalUrl.slice(req.path.length));
  if (aliases.has(req.path.slice(1))) return res.redirect(301, '/online-play.html' + req.originalUrl.slice(req.path.length));
  next();
});
app.use(express.static(path.join(__dirname, 'site'), {dotfiles: 'deny'}));
app.use((req, res) => res.status(404).type('html').send('<!doctype html><html lang="hu"><meta charset="utf-8"><meta name="robots" content="noindex"><title>Az oldal nem található | Az Elsők Kora</title><h1>Az oldal nem található</h1><a href="/">Az Elsők Kora főoldala</a></html>'));
if (require.main === module) app.listen(process.env.PORT || 3000, '0.0.0.0', () => console.log('Az Elsők Kora elindult.'));
module.exports = app;
