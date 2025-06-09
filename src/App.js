import React, { useState } from 'react';
import FitParser from 'fit-file-parser';

export default function App() {
  const [records, setRecords] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    const fitParser = new FitParser({
      force: true,
      speedUnit: 'km/h',
      lengthUnit: 'm',
      temperatureUnit: 'celsius',
      elapsedRecordField: true,
      mode: 'list',
    });

    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      fitParser.parse(arrayBuffer, (error, data) => {
        if (error) {
          console.error('Error parsing .fit file:', error);
          return;
        }
        setRecords(data.records || []);
      });
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>FIT File Parser Demo</h1>
      <input type="file" accept=".fit" onChange={handleFileUpload} />
      <ul>
        {records.slice(0, 10).map((record, i) => (
          <li key={i}>
            {record.timestamp} | Power: {record.power ?? '–'} W | HR: {record.heart_rate ?? '–'} bpm | Cadence: {record.cadence ?? '–'} rpm
          </li>
        ))}
      </ul>
    </div>
  );
}
