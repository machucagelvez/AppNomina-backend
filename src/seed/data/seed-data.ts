import { addMonths, format, subMonths, subYears } from 'date-fns';
import { eliminateTimeZone } from 'src/common/helpers/eliminate-time-zone';

interface SeedContract {
  name: string;
}

interface SeedPaymentFrequency {
  name: string;
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

type ValidRoles = 'admin' | 'user';
type ValidDocumentTypes = 'cc' | 'ce' | 'nit';

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
  contractId: number;
  paymentFrequencyId: number;
}

interface SeedData {
  contract: SeedContract[];
  paymentFrequency: SeedPaymentFrequency[];
  users: SeedUser[];
  employees: SeedEmployee[];
}

export const seedData: SeedData = {
  contract: [{ name: 'indefinite-term' }, { name: 'fixed-term' }],
  paymentFrequency: [{ name: 'biweekly' }, { name: 'monthly' }],
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
      contractId: 2,
      paymentFrequencyId: 2,
    },
  ],
};
