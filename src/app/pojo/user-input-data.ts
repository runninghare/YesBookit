
import {GuestData} from './guest-data';

export interface UserInputData {
    guests?: number|GuestData;
    arrival?: number[];
    departure?: number[];
    arrival_date?: string;
    adults?: number;
    children?: number;
};