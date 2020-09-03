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


export default class CodeGenerator {
	helperFunctionsToInclude: any;

	constructor(options: any) {
		this.helperFunctionsToInclude = {};
	}

	generate(events: any){
		const generatedEventsCode = this._handleEvents(events);
		return importPlayWright + this.addHelperFunctionsIfAny() + header + generatedEventsCode + footer;
	}

	addHelperFunctionsIfAny(){
		const helperFunctions = Object.keys(this.helperFunctionsToInclude);
		let codeToAdd = "";
		for(let fun of helperFunctions){
			if(fun === EXTRACT_INFO){
				codeToAdd+= extractInfoUsingScriptFunction;
			}
		}
		return codeToAdd;
	}

	_handleEvents(events: any){
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
			const { event_type, selector, value } = events[i];
			switch (event_type) {
				case NAVIGATE_URL:
					if(firstTimeNavigate) {
						firstTimeNavigate = false;
						code += `const page = await browserContext.newPage({});\nawait page.goto('${value}');\n`;
					} else {
						code += `await page.goto('${value}');\n`;
					}
					break;
				case CLICK:
					code += `await page.click('${selector}');\n`;
					break;
				case HOVER:
					code += `await page.hover('${selector}');\n`;
					break;
				case SCREENSHOT:
					screenShotFileName = selector.replace(/[^\w\s]/gi, '').replace(/ /g, '_') + `_${i}`;
					code += `const h_${i} = await page.$('${selector}');\nawait h_${i}.screenshot({path: '${screenShotFileName}.png'});\n`
					break;
				case PAGE_SCREENSHOT:
					screenShotFileName = value.replace(/[^\w\s]/gi, '').replace(/ /g,"_") + `_${i}`;
					code += `await page.screenshot({path: '${screenShotFileName}.png', fullPage: true});\n`;
					break;
				case SCROLL_TO_VIEW:
					code += `const stv_${i} = await page.$('${selector}');\nstv_${i}.scrollIntoViewIfNeeded();\n`
					break;
				case INPUT:
					code += `await page.type('${selector}', '${value}');\n`;
					break;
				case EXTRACT_INFO:
					const variable_name = Object.keys(value)[0];
					const validation_script = value[variable_name];
					this.helperFunctionsToInclude[EXTRACT_INFO] = true;
					code += `let ${variable_name} = await extractInfoUsingScript(page, '${selector}', ` + '`' + validation_script + '`' + `)\n`;
					break;
				case ASSERT_TEXT:
					this.helperFunctionsToInclude[ASSERT_TEXT] = true;
					code += ` `;
				default:
					console.error("Not supported event");
			}

		}
		return code;
	}
}
