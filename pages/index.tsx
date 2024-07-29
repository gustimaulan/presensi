import { useState, useEffect } from 'react';
import axios from 'axios';

interface RowData {
  No: string;
  'Nama Tentor': string;
  'Hari dan Tanggal Les': string;
  'Jam Kegiatan Les': string;
  'Nama Siswa': string;
}

const DataTable: React.FC = () => {
  const [data, setData] = useState<RowData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchData = async () => {
    try {
      const response = await axios.get<RowData[]>('/api/fetch-data');
      setData(response.data);
    } catch (error) {
      setError('Error fetching data');
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000); // Fetch data every 5 minutes
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <div className='flex justify-between items-center'>
      <h1 className="text-2xl font-bold mb-4">Presensi</h1>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-md">
          <thead className="bg-[#2C9CDA] text-white sticky top-0 z-10">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-medium">No</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Nama Tentor</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Hari dan Tanggal Les</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Jam Kegiatan Les</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Nama Siswa</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-200 ${
                    index % 2 === 0 ? 'bg-[#E1F5FE]' : 'bg-white'
                  }`}
                >
                  <td className="py-3 px-4 text-sm text-gray-600">{row.No}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{row['Nama Tentor']}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{row['Hari dan Tanggal Les']}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{row['Jam Kegiatan Les']}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{row['Nama Siswa']}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-3 px-4 text-sm text-gray-600 text-center">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
