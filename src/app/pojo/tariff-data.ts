export interface DatePairData  {
    from: string;
    to: string;
}

export interface GroupData {
          dsow?: string;
          active?: string;
          version?: number;
          dmax?: number;
          brief?: string;
          dow?: string;
          dowd?: number,
          dmin?: number;
          col?: number;
          xdow?: any;
          factor?: number,
          name?: string;
          pairs?: DatePairData[];
          aonly?: number;
        };

export interface SchemeData {
          maxdays?: number;
          infantsfactor?:number;
          name?:string;
          groups?:number[];
          guestsfactor?:number;
          kidsfactor?:number;
          crossover_days?:number; 
          infantsage?:any;
          round?:number;
          guestsnum?:number;
          overrides?:any[];
          tax?:number;
          kidsage?:number;
        };        

export interface TariffData {
        base_nightly?: number; 
        Bfee?: number ; 
        cds?: number;
        cpb?: number; 
        cpd ?: number;
        exec?: number;
        bond?: number;
        guest_min?: number;
        guest_max?: number;
        guest_above?: number;
        guest_surcharge?:number;
        child_above?:number;
        child_surcharge?:number;

        OM_1?:string;
        OPR_1?:string;
        OV_1?:number;
        OW1_1?:number;

        OM_2?:string;
        OPR_2?:string;
        OV_2?:number;
        OW1_2?:number;

        test_scheme_override?: SchemeData;

        test_seasons_override?: {
            [index: number]: GroupData;
        }
}