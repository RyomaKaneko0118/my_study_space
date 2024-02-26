function myFunction() {
  const SHEET_NAME = 'GAS練習用'
  const targetSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)

  if (targetSheet) { 
    Logger.log('Spreadsheet found: ' + targetSheet.getName())
  } else { 
    Logger.log('Spreadsheet Notfound: ' + SHEET_NAME)
    return null
  }

  const areaRange = targetSheet.getRange('A1:A4')
  const areas = areaRange.getValues()

  areas.push(areas.shift())
  areaRange.setValues(areas)

  const daily_person = areas[0][0]

  const createdTextOutput = ContentService.createTextOutput()
  createdTextOutput.setMimeType(ContentService.MimeType.JSON)
  createdTextOutput.setContent(JSON.stringify(daily_person))

  return createdTextOutput
}