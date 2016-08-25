
import {GuestData} from './guest-data';

export interface UserInputData {
    guests?: number|GuestData;
    arrival?: number[];
    departure?: number[];
};