using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Drawing.Charts;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.Wordprocessing;
using System.Reflection;

namespace ClassVision.API.Services;

public class SpreadsheetService
{

    private static IList<string> GetAllAttribute<T>(T item)
    {
        Type type = typeof(T);
        var properties = type.GetProperties(BindingFlags.Public | BindingFlags.Instance)
                            .Where(p => p.CanRead);

        var attributes = properties.Select(p => p.Name);
        return [.. attributes];
    }

    private static IList<IList<string>> GetAllValues<T>(IList<T> items)
    {
        Type type = typeof(T);
        var properties = type.GetProperties(BindingFlags.Public | BindingFlags.Instance)
                            .Where(p => p.CanRead);

        var values = items.Select(i => properties.Select(p => p.GetValue(i)?.ToString() ?? "").ToList()).ToList();
        return [.. values];
    }

    private IList<IList<string>> Serialize<T>(IList<T> items)
    {
        if (!items.Any())
        {
            return [];
        }

        var attributes = GetAllAttribute(items[0]);
        var values = GetAllValues(items);
        return [attributes, ..values];
    }
    private static Cell GetOrCreateCell(SheetData sheetData, int columnIndex, int rowIndex)
    {

        string cellReference = IndexToColumnName(columnIndex) + rowIndex; // e.g., A1, B1, C1

        Row row = sheetData.Elements<Row>().FirstOrDefault(r => r.RowIndex == rowIndex) 
            ?? sheetData.AppendChild(new Row()
        {
            RowIndex = (uint)rowIndex
        });

        Cell cell = row.Elements<Cell>().FirstOrDefault(c => c.CellReference.Value == cellReference);

        if (cell == null)
        {
            cell = new Cell() { CellReference = cellReference };
            if (row.ChildElements.Count < columnIndex)
                row.AppendChild(cell);
            else
                row.InsertAt(cell, (int)columnIndex);
        }

        return cell;
    }


    // Helper function to convert column letter to index (e.g., "A" -> 0, "B" -> 1)
    private static int ColumnNameToIndex(string columnName)
    {
        int index = 0;
        foreach (char c in columnName.ToUpper())
        {
            index = index * 26 + (c - 'A' + 1);
        }
        return index - 1;
    }

    // Helper function to convert index to column letter (e.g., 0 -> "A", 1 -> "B")
    private static string IndexToColumnName(int index)
    {
        string columnName = "";
        while (index >= 0)
        {
            columnName = (char)('A' + index % 26) + columnName;
            index = index / 26 - 1;
        }
        return columnName;
    }

    public void Export(IList<Dictionary<string, string>> items, string saveLocation, string startCell)
    {
        if (!items.Any())
        {
            ExportToFile([], saveLocation, startCell);
            return;
        }

        var keys = items[0].Keys.ToList();
        var values = items.Select(i => i.Values.ToList()).ToList();

        IList<IList<string>> serializedValues = [keys, ..values];

        ExportToFile(serializedValues, saveLocation, startCell);

    }

    public void Export<T>(IList<T> items, string saveLocation, string startCell)
    {
        var serializedValue = Serialize(items);
        ExportToFile(serializedValue, saveLocation, startCell);
    }

    private void ExportToFile(IList<IList<string>> serializedValue, string saveLocation, string startCell)
    {
        // Create a spreadsheet document by supplying the filepath.
        // By default, AutoSave = true, Editable = true, and Type = xlsx.
        using SpreadsheetDocument spreadsheetDocument = SpreadsheetDocument.Create(saveLocation, SpreadsheetDocumentType.Workbook);
        // Add a WorkbookPart to the document.
        WorkbookPart workbookPart = spreadsheetDocument.AddWorkbookPart();
        workbookPart.Workbook = new Workbook();

        // Add a WorksheetPart to the WorkbookPart.
        WorksheetPart worksheetPart = workbookPart.AddNewPart<WorksheetPart>();
        worksheetPart.Worksheet = new Worksheet(new SheetData());

        // Add Sheets to the Workbook.
        Sheets sheets = workbookPart.Workbook.AppendChild(new Sheets());

        // Append a new worksheet and associate it with the workbook.
        Sheet sheet = new Sheet() { Id = workbookPart.GetIdOfPart(worksheetPart), SheetId = 1, Name = "Export" };


        // Return the SheetData element
        sheets.Append(sheet);

        var sheetData = worksheetPart.Worksheet.GetFirstChild<SheetData>();

        int columnNumber = ColumnNameToIndex(new string([.. startCell.Where(char.IsAsciiLetter)])); // Convert "A" to index (0-based)
        int rowIndex = int.Parse(new string([.. startCell.Where(char.IsDigit)])); // Extract row number


        foreach (var values in serializedValue)
        {
            var columnIndex = columnNumber;
            foreach (var value in values)
            {
                Cell cell = GetOrCreateCell(sheetData, columnIndex, rowIndex);
                cell.CellValue = new CellValue(value);
                cell.DataType = new EnumValue<CellValues>(CellValues.String);
                columnIndex++; // Move to next column

            }
            rowIndex++;

        }
        spreadsheetDocument.Save();
    }

}
