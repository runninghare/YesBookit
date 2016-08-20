import {Injectable} from '@angular/core';

export interface DateData {
    booking_arrival: string;
    booking_departure: string;
    los?: number;
    season1_start?: string;
    season1_end?: string;
    season2_start?: string;
    season2_end?: string;
    season_exists: string;
    status?: string;
}