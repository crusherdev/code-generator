// @ts-nocheck

import {
	ASSERT_TEXT,
	CLICK, EXTRACT_INFO,
	HOVER,
	INPUT,
	NAVIGATE_URL,
	PAGE_SCREENSHOT,
	SCREENSHOT,
	SCROLL_TO_VIEW, SET_DEVICE
} from "./constants/eventsToRecord";
import userAgents from "./constants/userAgents";
import devices from "./constants/devices";

const importPlayWright = `const playwright = require('playwright');\n\n`

const header = `const browser = await playwright["chromium"].launch();\n`

const footer = `await browser.close();\n`


const extractInfoUsingScriptFunction = `async function extractInfoUsingScript(page, selector, validationScript){
    const elHandle = await page.$(selector);
    const escapedInnerHTML = (await elHandle.innerHTML())` + '.toString().replace(/\\`/g, "\\\\`").trim()' + `;
    const escapedInnerText = (await elHandle.innerText())` + '.replace(/\\`/g, "\\\\`").trim();' + `;
    
    `+ "const scriptToEvaluate = \`(\` + validationScript + \`)(\` + '\`' + escapedInnerHTML + '\`' + \`, \` + '\`' + \`${escapedInnerText}\` + '\`' + \`, elHandle)\`" + `;
    const output = eval(scriptToEvaluate);
    
    return output;
}\n\n`;

const sleepScriptFunction = `
const DEFAULT_SLEEP_TIME = 500;
const TYPE_DELAY = 100;
function sleep(time){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve(true);
        }, time);
    })
}\n\n`;

export default class CodeGenerator {
	helperFunctionsToInclude: any;

	constructor(options: any) {
		this.helperFunctionsToInclude = {};
	}

	generate(events: any, isRecordingVideo: boolean = false){
		const generatedEventsCode = this._handleEvents(events, isRecordingVideo);
		return importPlayWright + this.addHelperFunctionsIfAny(isRecordingVideo) + (isRecordingVideo ? `let captureVideo;\n` : ``) + header + generatedEventsCode + (isRecordingVideo ? `await captureVideo.stop();\n}catch(ex){ await captureVideo.stop(); throw ex;}\n` : '') + footer;
	}

	addHelperFunctionsIfAny(isRecordingVideo = false){
		const helperFunctions = Object.keys(this.helperFunctionsToInclude);
		let codeToAdd = "";
		for(let fun of helperFunctions){
			if(fun === EXTRACT_INFO){
				codeToAdd+= extractInfoUsingScriptFunction;
			}
		}
		if(isRecordingVideo){
			codeToAdd += sleepScriptFunction;
		}
		return codeToAdd;
	}

	_handleEvents(events: any, isRecordingVideo = false){
		let screenShotFileName: string;
		let code = '\n';
		let firstTimeNavigate = true;
		let width = 1280;
		let height = 720;
		if(events[0] && events[0].event_type!==SET_DEVICE) {
			const device = devices[7];
			const userAgent = userAgents.find(agent => {
				return agent.name === device.userAgent;
			});
			width = device.width;
			height = device.height;
			code += `const browserContext = await browser.newContext({width: '${device.width}px', height: '${device.height}px', userAgent: "${userAgent.value}"});\n`;
		} else if(events[0] && events[0].event_type===SET_DEVICE) {
			const {value: deviceId} = events[0];
			const deviceFound = devices.find((_device)=>{
				return _device.id === deviceId;
			});
			const device = deviceFound ? deviceFound : devices[7];
			const userAgent = userAgents.find(agent => {
				return agent.name === device.userAgent;
			});
			width = device.width;
			height = device.height;
			code += `const browserContext = await browser.newContext({userAgent: '${userAgent.value}', viewport: { width: ${device.width}, height: ${device.height}}});\n`;
		}
		for (let i = 0; i < events.length; i++) {
			const { event_type, selectors, value } = events[i];
			switch (event_type) {
				case NAVIGATE_URL:
					if(firstTimeNavigate) {
						firstTimeNavigate = false;
						code += `const page = await browserContext.newPage({});\n` + (isRecordingVideo ? `const {saveVideo} = require('playwright-video');\ncaptureVideo = await saveVideo(page, 'video.mp4');\ntry{\n` : '') +`await page.goto('${value}');\n`;
					} else {
						code += `await page.goto('${value}');\nawait sleep(DEFAULT_SLEEP_TIME);\n`;
					}
					if(isRecordingVideo){
						code+= `await sleep(DEFAULT_SLEEP_TIME);\n`;
					}
					break;
				case CLICK:
					code += `await page.waitForSelector('${selectors[0].value}', {state: "attached"});\nconst stv_${i} = await page.$('${selectors[0].value}');\nawait stv_${i}.scrollIntoViewIfNeeded();\nawait stv_${i}.dispatchEvent('click');\n`
					if(isRecordingVideo){
						code+= `await sleep(DEFAULT_SLEEP_TIME);\n`;
					}
					break;
				case HOVER:
					code += `await page.waitForSelector('${selectors[0].value}', {state: "attached"});\nawait page.hover('${selectors[0].value}');\n`;
					if(isRecordingVideo){
						code+= `await sleep(DEFAULT_SLEEP_TIME);\n`;
					}
					break;
				case SCREENSHOT:
					screenShotFileName = selectors[0].value.replace(/[^\w\s]/gi, '').replace(/ /g, '_') + `_${i}`;
					code += `await page.waitForSelector('${selectors[0].value}', {state: "attached"});\nconst h_${i} = await page.$('${selectors[0].value}');\nawait h_${i}.screenshot({path: '${screenShotFileName}.png'});\n`
					if(isRecordingVideo){
						code+= `await sleep(DEFAULT_SLEEP_TIME);\n`;
					}
					break;
				case PAGE_SCREENSHOT:
					screenShotFileName = value.replace(/[^\w\s]/gi, '').replace(/ /g,"_") + `_${i}`;
					code += `await page.screenshot({path: '${screenShotFileName}.png', fullPage: true});\n`;
					if(isRecordingVideo){
						code+= `await sleep(DEFAULT_SLEEP_TIME);\n`;
					}
					break;
				case SCROLL_TO_VIEW:
					code += `await page.waitForSelector('${selectors[0].value}', {state: "attached"});\nconst stv_${i} = await page.$('${selectors[0].value}');\nawait stv_${i}.scrollIntoViewIfNeeded();\n`
					if(isRecordingVideo){
						code+= `await sleep(DEFAULT_SLEEP_TIME);\n`;
					}
					break;
				case INPUT:
					code += `await page.waitForSelector('${selectors[0].value}', {state: "attached"});\nawait page.type('${selectors[0].value}', '${value}', {delay: ${isRecordingVideo ? 'TYPE_DELAY' : 25}});\n`;
					if(isRecordingVideo){
						code+= `await sleep(DEFAULT_SLEEP_TIME);\n`;
					}
					break;
				case EXTRACT_INFO:
					const variable_name = Object.keys(value)[0];
					const validation_script = value[variable_name];
					this.helperFunctionsToInclude[EXTRACT_INFO] = true;
					code += `await page.waitForSelector('${selectors[0].value}', {state: "attached"});\nlet ${variable_name} = await extractInfoUsingScript(page, '${selectors[0].value}', ` + '`' + validation_script + '`' + `)\n`;
					if(isRecordingVideo){
						code+= `await sleep(DEFAULT_SLEEP_TIME);\n`;
					}
					break;
				case ASSERT_TEXT:
					this.helperFunctionsToInclude[ASSERT_TEXT] = true;
					if(isRecordingVideo){
						code+= `await sleep(DEFAULT_SLEEP_TIME);\n`;
					}
					code += ` `;
				default:
					console.error("Not supported event");
			}

		}
		return code;
	}
}
