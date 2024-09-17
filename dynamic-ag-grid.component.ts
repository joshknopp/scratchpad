import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ColDef, ColGroupDef } from 'ag-grid-community';

@Component({
  selector: 'app-my-grid',
  templateUrl: './my-grid.component.html',
  styleUrls: ['./my-grid.component.css']
})
export class MyGridComponent {
  // Hardcoded columnDefs with 'foo' field present
  private baseColumnDefs: (ColDef | ColGroupDef)[] = [
    { field: 'make' },
    {
      headerName: 'Details',
      children: [
        { field: 'model' },
        { field: 'foo' },  // We may need to remove this field
        { field: 'price' }
      ]
    }
  ];

  // Observable<Boolean> to determine whether to remove the 'foo' field
  showFoo$: Observable<boolean> = of(false);  // Replace 'false' with your real condition

  // Getter function to manipulate the columnDefs based on the Observable's value
  get columnDefs$(): Observable<(ColDef | ColGroupDef)[]> {
    return this.showFoo$.pipe(
      map(showFoo => {
        if (showFoo) {
          // If showFoo is true, return the baseColumnDefs unmodified
          return this.baseColumnDefs;
        } else {
          // If showFoo is false, filter out the column with field 'foo'
          return this.removeFieldFromColumnDefs('foo', this.baseColumnDefs);
        }
      })
    );
  }

  // Helper function to remove the column with the specified field
  private removeFieldFromColumnDefs(fieldToRemove: string, columnDefs: (ColDef | ColGroupDef)[]): (ColDef | ColGroupDef)[] {
    return columnDefs.map(colDef => {
      if ((colDef as ColGroupDef).children) {
        // If the colDef has children (it's a ColGroupDef), recursively remove the field
        const group = colDef as ColGroupDef;
        return {
          ...group,
          children: this.removeFieldFromColumnDefs(fieldToRemove, group.children!)
        };
      } else if ((colDef as ColDef).field === fieldToRemove) {
        // If the colDef has the matching field, remove it (return null to filter it out)
        return null;
      }
      // Otherwise, return the colDef unmodified
      return colDef;
    }).filter(colDef => colDef !== null);  // Filter out the null entries (removed columns)
  }
}
