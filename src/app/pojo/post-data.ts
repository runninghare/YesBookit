
import {UserInputData} from './user-input-data';
import {TariffData} from './tariff-data';
import {RulesData} from './rules-data';

export interface RatePostData {
	clean_tariff_files?: number;
	user_input?: UserInputData|UserInputData[];
	tariff?: TariffData;
	rules?: RulesData;
}