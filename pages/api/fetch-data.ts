// pages/api/fetch-data.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import Papa from 'papaparse';

interface RowData {
  No: string;
  'Nama Tentor': string;
  'Hari dan Tanggal Les': string;
  'Jam Kegiatan Les': string;
  'Nama Siswa': string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vRBfctrrn2D8ZuJbkT0Xv3v9PqmQZnrSaAan1fki9CS89pR4cwYIk8qnx1huDxaWpA6lx3jt_TmlPRI/pub?gid=996852795&single=true&output=csv');
    const csvData = response.data;

    console.log('Raw CSV Data:', csvData); // Log raw CSV data

    Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log('Parsed Results:', results); // Log parsed results
        const rows = results.data as RowData[]; // Type assertion
        console.log('Mapped Data:', rows); // Log mapped data
        res.status(200).json(rows);
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        res.status(500).json({ error: 'Error parsing CSV' });
      },
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
}
