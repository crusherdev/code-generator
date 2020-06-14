import {GENERATOR_TYPES} from "./constants/generatorTypes";
import PuppeteerCodeGenerator from './puppeteer-code-generator';
import PlaywrightCodeGenerator from './playwright-code-generator';

export default function CodeGenerator(options: any = {}, type: string = GENERATOR_TYPES.PLAYWRIGHT){
	if(type === GENERATOR_TYPES.PUPPETEER){
			return new PuppeteerCodeGenerator(options);
	} else {
		return new PlaywrightCodeGenerator(options);
	}
}