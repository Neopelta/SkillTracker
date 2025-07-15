export class GoogleSheetsHandler {
    async readData() {
      try {
        const response = await fetch('/api/sheets/data');
        const text = await response.text();
        // console.log('Response text:', text);
        const data = JSON.parse(text);
        return data;
      } catch (error) {
        console.error('Error in readData:', error);
        console.error('Full error:', {
          message: error.message,
          stack: error.stack
        });
        throw error;
      }
    }
  
    async updateRow(rowIndex, newRow) {
      try {
        const response = await fetch(`/api/sheets/update/${rowIndex}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ values: newRow })
        });
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error in updateRow:', error);
        throw error;
      }
    }
  }