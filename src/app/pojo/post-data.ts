
import {UserInputData} from './user-input-data';
import {TariffData} from './tariff-data';
import {RulesData} from './rules-data';

export interface RatePostData {
    user_input?: UserInputData|UserInputData[];
    tariff?: TariffData;
    rules?: RulesData;
}