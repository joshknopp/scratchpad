import { Component } from '@angular/core';
import { ExcelService } from './excel.service';

@Component({
  selector: 'app-root',
  template: `
    <input type="file" (change)="handleFileInput($event.target.files)">
  `,
})
export class AppComponent {
  constructor(private excelService: ExcelService) { }

  public async handleFileInput(files: FileList): Promise<void> {
    const file: File = files.item(0);
    try {
      const jsonData: any[] = await this.excelService.convertExcelToJson(file);
      console.log(jsonData);
      // Do something with the JSON data
    } catch (error) {
      console.error('Error converting Excel to JSON:', error);
    }
  }
}
