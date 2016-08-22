
export interface YBIExistingTariffResponseResult {
    day?: string;
    day1?: string;
    bond?: number;
    vtotal?: string;
    price?: number;
    desc?: string;
    gmax?: number;
    gmin?: number;
    total?: number;
    adjust?: number;
    aonly?: number;
    Bfee?: number;
    gs?: number;
    clean?: number;
    xgs?: number;
    xfee?: number;
}

export interface YBIExistingTariffResponse {
    tariff_file: string;
    result: YBIExistingTariffResponseResult[];
}