import { config } from 'dotenv';

config();

export const PORT = Number(process.env.PORT ?? 4000);
export const HOSTAWAY_ACCOUNT_ID = process.env.HOSTAWAY_ACCOUNT_ID ;
export const HOSTAWAY_API_KEY = process.env.HOSTAWAY_API_KEY ;
export const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY ;

