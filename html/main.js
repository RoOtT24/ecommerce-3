import * as dotenv from 'dotenv';
dotenv.config();

export const redirect = (e) => {
    window.location.href = process.env.FE_URL;
}