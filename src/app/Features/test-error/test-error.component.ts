import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButton } from "@angular/material/button";

@Component({
  selector: 'app-test-error',
  imports: [MatButton],
  templateUrl: './test-error.component.html',
  styleUrl: './test-error.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestErrorComponent {
  baseUrl = 'https://localhost:7170/api/';
  private http = inject(HttpClient);
  validationErrors = signal<string[]>([]);

  get404Error() {
    this.http.get(this.baseUrl + 'buggy/notfound').subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    });
  }

  get400Error() {
    this.http.get(this.baseUrl + 'buggy/badrequsest').subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    });
  }

  get401Error() {
    this.http.get(this.baseUrl + 'buggy/unauthorized').subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    });
  }

  get500Error() {
    this.http.get(this.baseUrl + 'buggy/internalerror').subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    });
  }

  get400ValidationError() {
    this.http.get(this.baseUrl + 'buggy/validationerror').subscribe({
      next: response => console.log(response),
      error: error => this.validationErrors.set(error)
    });
  }
}
