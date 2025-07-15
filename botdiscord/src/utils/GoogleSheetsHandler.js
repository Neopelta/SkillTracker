const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
class GoogleSheetsHandler {
    constructor(spreadsheetId, range) {
        this.spreadsheetId = spreadsheetId;
        this.range = range;

        const auth = new google.auth.GoogleAuth({
            keyFile: path.join(__dirname, './spreadsheet.json'),
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        this.sheets = google.sheets({ version: 'v4', auth });
    }

    async readData() {
        try {
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.spreadsheetId,
                range: this.range,
            });

            return response.data.values;
        } catch (error) {
            console.error('Erreur lors de la lecture des données :', error);
            throw error;
        }
    }

    async writeData(newData) {
        try {

            const convertedData = newData.map(row =>
                row.map(value =>
                    Number(value)
                )
            );

            await this.sheets.spreadsheets.values.update({
                spreadsheetId: this.spreadsheetId,
                range: this.range,
                valueInputOption: 'RAW',
                resource: {
                    values: convertedData,
                },
            });

            console.log('Données mises à jour');
        } catch (error) {
            console.error('Erreur lors de la mise à jour des données :', error);
            throw error;
        }
    }

    async replaceElementInRow(rowIndex, columnIndex, newValue) {
        try {
            const range = `${this.range.split('!')[0]}!R${rowIndex + 1}C${columnIndex + 1}`;
            await this.sheets.spreadsheets.values.update({
                spreadsheetId: this.spreadsheetId,
                range: range,
                valueInputOption: 'RAW',
                resource: {
                    values: [[newValue]],
                },
            });
            console.log(`Élément remplacé dans la cellule ${range}`);
        } catch (error) {
            console.error('Erreur lors du remplacement de l\'élément :', error);
            throw error;
        }
    }
}

module.exports = GoogleSheetsHandler;
