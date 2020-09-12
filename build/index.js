module.exports=function(e){var t={};function n(a){if(t[a])return t[a].exports;var i=t[a]={i:a,l:!1,exports:{}};return e[a].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=e,n.c=t,n.d=function(e,t,a){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(n.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(a,i,function(t){return e[t]}.bind(null,i));return a},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return c}));var a="PLAYWRIGHT",i="PUPPETEER",r=function(){function e(e){this.helperFunctionsToInclude={}}return e.prototype.generate=function(e){var t=this._handleEvents(e);return"const puppeteer = require('puppeteer');\n\n"+this.addHelperFunctionsIfAny()+"const browser = puppeteer.launch();\nconst page = await browser.newPage();\n"+t+"await browser.close();\n"},e.prototype.addHelperFunctionsIfAny=function(){for(var e="",t=0,n=Object.keys(this.helperFunctionsToInclude);t<n.length;t++){"EXTRACT_INFO"===n[t]&&(e+="async function extractInfoUsingScript(page, selector, validationScript){\n    const elHandle = await page.$(selector);\n    const escapedInnerHTML = (await elHandle.innerHTML()).toString().replace(/\\`/g, \"\\\\`\").trim();\n    const escapedInnerText = (await elHandle.innerText()).replace(/\\`/g, \"\\\\`\").trim();;\n    \n    const scriptToEvaluate = `(` + validationScript + `)(` + '`' + escapedInnerHTML + '`' + `, ` + '`' + `${escapedInnerText}` + '`' + `, elHandle)`;\n    const output = eval(scriptToEvaluate);\n    \n    return output;\n}\n\n")}return e},e.prototype._handleEvents=function(e){for(var t,n="\n",a=0;a<e.length;a++){var i=e[a],r=i.event_type,o=i.selector,l=i.value;switch(r){case"NAVIGATE_URL":n+="  await page.goto('"+l+"');\n";break;case"CLICK":n+="  await page.click('"+o+"');\n";break;case"HOVER":n+="  await page.hover('"+o+"');\n";break;case"SCREENSHOT":t=o.replace(/[^\w\s]/gi,"").replace(/ /g,"_")+"_"+a,n+="  const h_"+a+" =  await page.$('"+o+"');\n   h_"+a+".screenshot({path: '"+t+".png'});\n";break;case"PAGE_SCREENSHOT":n+="  await page.screenshot({path: '"+(t=l.replace(/[^\w\s]/gi,"").replace(/ /g,"_")+"_"+a)+".png'});\n";break;case"SCROLL_TO_VIEW":n+="  const stv_"+a+" =  await page.$('"+o+"');\n  stv_"+a+".scrollIntoViewIfNeeded();\n";break;case"INPUT":n+="  await page.type('"+o+"', '"+l+"');\n";break;case"EXTRACT_INFO":var s=Object.keys(l)[0],c=l[s];this.helperFunctionsToInclude.EXTRACT_INFO=!0,n+="  let "+s+" = await extractInfoUsingScript(page, '"+o+"', `"+c+"`)\n";break;case"ASSERT_TEXT":this.helperFunctionsToInclude.ASSERT_TEXT=!0,n+=" ";default:console.error("Not supported event")}}return n},e}(),o=[{name:"Google Chrome",value:"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36",appVersion:"Mac OS X 10.14.0",platform:"Mac OS X"},{name:"Mozilla Firefox",value:"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:66.0) Gecko/20100101 Firefox/66.0",appVersion:"Mac OS X 10.14.0",platform:"Mac OS X"},{name:"Microsoft Edge",value:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393",appVersion:"Windows 10 0.0.0",platform:"Windows 10"},{name:"iPhone",value:"Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1",appVersion:"iOS 10.3.1",platform:"iOS"},{name:"iPad",value:"Mozilla/5.0 (iPad; CPU OS 8_4_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12H321 Safari/600.1.4",appVersion:"iOS 8.4.1",platform:"iOS"},{name:"Samsung Phone",value:"Mozilla/5.0 (Linux; Android 6.0.1; SAMSUNG SM-G570Y Build/MMB29K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/4.0 Chrome/44.0.2403.133 Mobile Safari/537.36",appVersion:"Android 6.0.1",platform:"Android"},{name:"Google Pixel",value:"Mozilla/5.0 (Linux; Android 7.1.1; Pixel Build/NOF27B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.132 Mobile Safari/537.36",appVersion:"Android 8.0.0",platform:"Android"}],l=[{id:"iphoneXRXSMax",name:"iPhone XR, XS Max",width:414,height:896,visible:!0,userAgent:"iPhone"},{id:"iPhoneXSX",name:"iPhone XS, X",width:375,height:812,visible:!0,userAgent:"iPhone"},{id:"iPhone8Plus7Plus6SPlus",name:"iPhone 8 Plus, 7 Plus, 6S Plus",width:414,height:736,visible:!1,userAgent:"iPhone"},{id:"iPhone876S6",name:"iPhone 8, 7, 6S, 6",width:375,height:667,visible:!1,userAgent:"iPhone"},{id:"GalaxyS9PlusS8Plus",name:"Galaxy S9 Plus, S8 Plus",width:412,height:846,visible:!0,userAgent:"Samsung Phone"},{id:"GalaxyS9NOte8S8",name:"Galaxy S9, Note 8, S8",width:360,height:740,visible:!0,userAgent:"Samsung Phone"},{id:"Pixel33XL",name:"Pixel 3, 3 XL",width:393,height:786,visible:!0,userAgent:"Google Pixel"},{id:"GoogleChromeMediumScreen",name:"Medium Screen",width:1024,height:800,visible:!0,userAgent:"Google Chrome"},{id:"GoogleChromeLargeScreen",name:"Large Screen",width:1280,height:800,visible:!0,userAgent:"Google Chrome"}],s=function(){function e(e){this.helperFunctionsToInclude={}}return e.prototype.generate=function(e,t){void 0===t&&(t=!1);var n=this._handleEvents(e,t);return"const playwright = require('playwright');\n\n"+this.addHelperFunctionsIfAny(t)+'const browser = await playwright["chromium"].launch();\n'+n+(t?"await captureVideo.stop();\n":"")+"await browser.close();\n"},e.prototype.addHelperFunctionsIfAny=function(e){void 0===e&&(e=!1);for(var t="",n=0,a=Object.keys(this.helperFunctionsToInclude);n<a.length;n++){"EXTRACT_INFO"===a[n]&&(t+="async function extractInfoUsingScript(page, selector, validationScript){\n    const elHandle = await page.$(selector);\n    const escapedInnerHTML = (await elHandle.innerHTML()).toString().replace(/\\`/g, \"\\\\`\").trim();\n    const escapedInnerText = (await elHandle.innerText()).replace(/\\`/g, \"\\\\`\").trim();;\n    \n    const scriptToEvaluate = `(` + validationScript + `)(` + '`' + escapedInnerHTML + '`' + `, ` + '`' + `${escapedInnerText}` + '`' + `, elHandle)`;\n    const output = eval(scriptToEvaluate);\n    \n    return output;\n}\n\n")}return e&&(t+="\nconst DEFAULT_SLEEP_TIME = 500;\nconst TYPE_DELAY = 100;\nfunction sleep(time){\n    return new Promise((resolve, reject)=>{\n        setTimeout(()=>{\n            resolve(true);\n        }, time);\n    })\n}\n\n"),t},e.prototype._handleEvents=function(e,t){var n;void 0===t&&(t=!1);var a="\n",i=!0;if(e[0]&&"SET_DEVICE"!==e[0].event_type){var r=l[7],s=o.find((function(e){return e.name===r.userAgent}));r.width,r.height,a+="const browserContext = await browser.newContext({width: '"+r.width+"px', height: '"+r.height+"px', userAgent: \""+s.value+'"});\n'}else if(e[0]&&"SET_DEVICE"===e[0].event_type){var c=e[0].value,p=l.find((function(e){return e.id===c})),u=p||l[7];s=o.find((function(e){return e.name===u.userAgent}));u.width,u.height,a+="const browserContext = await browser.newContext({userAgent: '"+s.value+"', viewport: { width: "+u.width+", height: "+u.height+"}});\n"}for(var d=0;d<e.length;d++){var h=e[d],g=h.event_type,w=h.selector,S=h.value;switch(g){case"NAVIGATE_URL":i?(i=!1,a+="const page = await browserContext.newPage({});\n"+(t?"const {saveVideo} = require('playwright-video');\nconst captureVideo = await saveVideo(page, 'video.mp4');\n":"")+"await page.goto('"+S+"');\n"):a+="await page.goto('"+S+"');\nawait sleep(DEFAULT_SLEEP_TIME);\n",t&&(a+="await sleep(DEFAULT_SLEEP_TIME);\n");break;case"CLICK":a+="await page.waitForSelector('"+w+"', {state: \"attached\"});\nawait page.click('"+w+"');\n",t&&(a+="await sleep(DEFAULT_SLEEP_TIME);\n");break;case"HOVER":a+="await page.waitForSelector('"+w+"', {state: \"attached\"});\nawait page.hover('"+w+"');\n",t&&(a+="await sleep(DEFAULT_SLEEP_TIME);\n");break;case"SCREENSHOT":n=w.replace(/[^\w\s]/gi,"").replace(/ /g,"_")+"_"+d,a+="await page.waitForSelector('"+w+'\', {state: "attached"});\nconst h_'+d+" = await page.$('"+w+"');\nawait h_"+d+".screenshot({path: '"+n+".png'});\n",t&&(a+="await sleep(DEFAULT_SLEEP_TIME);\n");break;case"PAGE_SCREENSHOT":a+="await page.screenshot({path: '"+(n=S.replace(/[^\w\s]/gi,"").replace(/ /g,"_")+"_"+d)+".png', fullPage: true});\n",t&&(a+="await sleep(DEFAULT_SLEEP_TIME);\n");break;case"SCROLL_TO_VIEW":a+="await page.waitForSelector('"+w+'\', {state: "attached"});\nconst stv_'+d+" = await page.$('"+w+"');\nstv_"+d+".scrollIntoViewIfNeeded();\n",t&&(a+="await sleep(DEFAULT_SLEEP_TIME);\n");break;case"INPUT":a+="await page.waitForSelector('"+w+"', {state: \"attached\"});\nawait page.type('"+w+"', '"+S+"', {delay: "+(t?"TYPE_DELAY":25)+"});\n",t&&(a+="await sleep(DEFAULT_SLEEP_TIME);\n");break;case"EXTRACT_INFO":var E=Object.keys(S)[0],T=S[E];this.helperFunctionsToInclude.EXTRACT_INFO=!0,a+="await page.waitForSelector('"+w+'\', {state: "attached"});\nlet '+E+" = await extractInfoUsingScript(page, '"+w+"', `"+T+"`)\n",t&&(a+="await sleep(DEFAULT_SLEEP_TIME);\n");break;case"ASSERT_TEXT":this.helperFunctionsToInclude.ASSERT_TEXT=!0,t&&(a+="await sleep(DEFAULT_SLEEP_TIME);\n"),a+=" ";default:console.error("Not supported event")}}return a},e}();function c(e,t){return void 0===e&&(e={}),void 0===t&&(t=a),t===i?new r(e):new s(e)}}]);