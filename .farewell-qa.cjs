const {chromium}=require('C:/Users/Lenovo Thinkpad/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const out='C:/Users/Lenovo Thinkpad/.codex/visualizations/2026/10/12/01a130e4-1af9-7813-9537-dd124f8e458f';
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try {
  const page=await browser.newPage({viewport:{width:390,height:900},reducedMotion:'reduce'});
  const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{window.open=()=>{throw Error('Unexpected external navigation')};});
  for(const [key,name] of [['julian','Julián'],['ana','Ana'],['sofia','Sofía']]) {
   await page.goto('http://127.0.0.1:4173/?invitado='+key+'#invitacion');
   assert.ok((await page.locator('#hero-title').textContent()).startsWith(name+','));
   assert.equal(await page.locator('#rsvp-guest-name').textContent(),name);
   assert.equal(await page.locator('#farewell-personal').textContent(),name+', nos vemos para escribir otro recuerdo');
  }
  for(const query of ['', '?invitado=no-existe','?invitado=constructor']) {
   await page.goto('http://127.0.0.1:4173/'+query+'#invitacion');
   assert.equal(await page.locator('#farewell-personal').textContent(),'Nos vemos para escribir otro recuerdo');
   assert.equal(await page.locator('#hero-title').textContent(),'Mi historia, contigo');
  }
  await page.goto('http://127.0.0.1:4173/?invitado=julian#invitacion');
  assert.ok(await page.evaluate(()=>document.getElementById('confirmacion').nextElementSibling.id==='despedida'));
  assert.equal(await page.locator('.studio-credit').getAttribute('href'),'https://rotfstudio.com/');
  assert.equal(await page.locator('#farewell-signature').textContent(),'Con cariño, Valentina');
  assert.equal(await page.locator('.gallery-card').count(),5);
  assert.equal(await page.locator('.people-card').count(),6);
  assert.ok((await page.locator('#event-save').getAttribute('href')).startsWith('blob:'));
  await page.locator('.rsvp-option-yes').click();
  await page.locator('#rsvp-message').fill('Este mensaje se conserva al volver al inicio.');
  await page.locator('#despedida').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>document.getElementById('farewell-photo').naturalWidth>0);
  assert.ok(await page.locator('#farewell-photo').isVisible());
  for(const width of [320,390,768,1440]) {
   await page.setViewportSize({width,height:1000});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+width);
   if(width===390||width===1440) {
    await page.locator('#despedida').screenshot({path:out+'/despedida-'+width+'.png'});
   }
  }
  await page.locator('#back-to-top').focus(); await page.keyboard.press('Enter');
  assert.equal(await page.evaluate(()=>window.scrollY),0);
  assert.equal(await page.locator(':focus').getAttribute('id'),'hero-title');
  assert.ok(await page.locator('#rsvp-yes').isChecked());
  assert.equal(await page.locator('#rsvp-message').inputValue(),'Este mensaje se conserva al volver al inicio.');
  assert.ok(await page.locator('#invitation-content').evaluate(e=>e.classList.contains('is-open')));
  // Imagen inexistente: conserva el marco y un monograma accesible.
  const source=fs.readFileSync('farewell-data.js','utf8');
  await page.route('**/farewell-data.js',r=>r.fulfill({contentType:'text/javascript',body:source+'\nwindow.farewellData.photo="assets/no-existe.jpg";'}));
  await page.reload();await page.locator('#despedida').scrollIntoViewIfNeeded();
  await page.locator('#farewell-photo-fallback').waitFor({state:'visible'});
  assert.ok(await page.locator('#farewell-photo').isHidden());
  assert.equal(await page.locator('#farewell-photo-fallback').getAttribute('aria-label'),'Monograma de Valentina');
  await page.unroute('**/farewell-data.js');
  // Verificar aparición y scroll suave sin esperar animaciones ajenas al cierre.
  await page.emulateMedia({reducedMotion:'no-preference'}); await page.reload();
  await page.locator('#despedida').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>document.querySelector('.farewell-copy').classList.contains('is-visible'));
  await page.evaluate(()=>{const original=window.scrollTo;window.scrollTo=function(options){window.lastScroll=options;return original.call(window,options);};});
  await page.locator('#back-to-top').click();
  assert.equal(await page.evaluate(()=>lastScroll.behavior),'smooth');
  assert.deepEqual(errors,[]);
  console.log('PASS: guest names agree in hero/RSVP/farewell; generic invalid/missing URL; image/fallback; responsive 320–1440; keyboard return and retained RSVP; smooth/reduced motion; previous sections present, no JS errors.');
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
