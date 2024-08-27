import { addMonths, format, subMonths, subYears } from 'date-fns';
import { eliminateTimeZone } from 'src/common/helpers/eliminate-time-zone';

type ValidRoles = 'admin' | 'user';
type ValidDocumentTypes = 'cc' | 'ce' | 'nit';
type ValidDiscountDate = 'first' | 'last' | 'both' | null;

interface SeedContract {
  name: string;
}

interface SeedPaymentFrequency {
  name: string;
}

interface SeedLegalValue {
  pension_percentage: number;
  health_insurance_percentage: number;
  transportation_assistance: number;
  minimum_wage: number;
  severance_pay_interest: number;
  night_surcharge_percentage: number;
  holiday_night_surcharge_percentage: number;
  holiday_daytime_surcharge_percentage: number;
  night_overtime_percentage: number;
  daytime_overtime_percentage: number;
  holiday_night_overtime_percentage: number;
  holiday_daytime_overtime_percentage: number;
}

interface SeedUser {
  first_name: string;
  last_name: string;
  email: string;
  document: string;
  document_type: ValidDocumentTypes;
  password: string;
  role: ValidRoles[];
}

interface SeedEmployee {
  first_name: string;
  last_name: string;
  email: string;
  document: string;
  document_type: ValidDocumentTypes;
  eps: string;
  afp: string;
  ccf: string;
  salary: number;
  start_date: string;
  end_date?: string;
  discount_date: ValidDiscountDate;
  contractId: number;
  paymentFrequencyId: number;
}

interface SeedData {
  contract: SeedContract[];
  paymentFrequency: SeedPaymentFrequency[];
  legalValue: SeedLegalValue[];
  users: SeedUser[];
  employees: SeedEmployee[];
}

export const seedData: SeedData = {
  contract: [{ name: 'indefinite-term' }, { name: 'fixed-term' }],
  paymentFrequency: [{ name: 'biweekly' }, { name: 'monthly' }],
  legalValue: [
    {
      pension_percentage: 0.04,
      health_insurance_percentage: 0.04,
      transportation_assistance: 162000,
      minimum_wage: 1300000,
      severance_pay_interest: 0.12,
      night_surcharge_percentage: 0.35,
      holiday_night_surcharge_percentage: 1.1,
      holiday_daytime_surcharge_percentage: 0.75,
      night_overtime_percentage: 1.75,
      daytime_overtime_percentage: 1.25,
      holiday_night_overtime_percentage: 2.5,
      holiday_daytime_overtime_percentage: 2,
    },
  ],
  users: [
    {
      first_name: 'Empleador',
      last_name: 'Uno',
      email: 'empleador1@correo.com',
      document: '465789',
      document_type: 'cc',
      password: 'Password123*',
      role: ['user'],
    },
    {
      first_name: 'Administrador',
      last_name: 'Uno',
      email: 'admin1@correo.com',
      document: '123456',
      document_type: 'nit',
      password: 'Password123*',
      role: ['admin'],
    },
  ],
  employees: [
    {
      first_name: 'Ozzy',
      last_name: 'Osbourne',
      email: 'ozzyo@correo.com',
      document: '789456',
      document_type: 'cc',
      eps: 'Sura',
      afp: 'Porvenir',
      ccf: 'Comfama',
      salary: 1300000,
      start_date: format(
        subYears(eliminateTimeZone(new Date()), 1),
        'yyyy-MM-dd',
      ),
      discount_date: null,
      contractId: 1,
      paymentFrequencyId: 1,
    },
    {
      first_name: 'Omara',
      last_name: 'Portuondo',
      email: 'omarap@correo.com',
      document: '369852',
      document_type: 'ce',
      eps: 'Nueva eps',
      afp: 'Colpensiones',
      ccf: 'Comfenalco',
      salary: 2300000,
      start_date: format(
        subMonths(eliminateTimeZone(new Date()), 8),
        'yyyy-MM-dd',
      ),
      discount_date: 'both',
      contractId: 1,
      paymentFrequencyId: 2,
    },
    {
      first_name: 'Stevie',
      last_name: 'Nicks',
      email: 'stevien@correo.com',
      document: '159753',
      document_type: 'cc',
      eps: 'Sanitas',
      afp: 'Protección',
      ccf: 'Comfaoriente',
      salary: 3300000,
      start_date: format(
        subMonths(eliminateTimeZone(new Date()), 5),
        'yyyy-MM-dd',
      ),
      end_date: format(
        addMonths(eliminateTimeZone(new Date()), 7),
        'yyyy-MM-dd',
      ),
      discount_date: 'first',
      contractId: 2,
      paymentFrequencyId: 2,
    },
  ],
};
