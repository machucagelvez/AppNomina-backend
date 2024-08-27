export interface Payment {
  period?: string;
  baseSalary: number;
  pensionDiscount: number;
  healthInsuranceDiscount: number;
  transportationAssistance?: number;
  severancePayInterest?: number;
  nightSurcharge?: number;
  holidayNightSurcharge?: number;
  holidayDaytimeSurcharge?: number;
  nightOvertime?: number;
  daytimeOvertime?: number;
  holidayNightOvertime?: number;
  holidayDaytimeOvertime?: number;
  total?: number;
}
