import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  constructor() { }

  public async convertExcelToJson(file: File): Promise<any[]> {
    const data: Uint8Array = await this.readFileAsync(file);
    const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'array' });
    const worksheetName: string = workbook.SheetNames[0];
    const worksheet: XLSX.WorkSheet = workbook.Sheets[worksheetName];
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    return jsonData;
  }

  private readFileAsync(file: File): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const data: Uint8Array = new Uint8Array(e.target.result);
        resolve(data);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  }
}
