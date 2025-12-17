import type { Company } from '../types';
import { delay } from '../utils/delay';

/**
 * Fetch all companies
 */
export const getCompanies = async (): Promise<Company[]> => {
  await delay(800);
  const companiesData = await import('../data/companies.json');
  return companiesData.default as Company[];
};

/**
 * Fetch a single company by ID
 */
export const getCompanyById = async (id: string): Promise<Company | null> => {
  await delay(600);
  const companiesData = await import('../data/companies.json');
  const companies = companiesData.default as Company[];
  return companies.find(company => company.id === id) || null;
};
