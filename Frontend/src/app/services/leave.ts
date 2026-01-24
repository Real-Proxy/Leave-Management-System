import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {

  private apiUrl = 'http://localhost:5186/api/leaves';

  constructor(private http: HttpClient) { }

  applyLeave(data: any) {
    return this.http.post(`${this.apiUrl}/apply`, data);
  }

  getUserLeaves() {
    return this.http.get(`${this.apiUrl}/my-leaves`);
  }

  getPendingLeaves() {
    return this.http.get(`${this.apiUrl}/pending`);
  }

  approveLeave(id: number) {
    return this.http.put(`${this.apiUrl}/${id}/approve`, {});
  }

  rejectLeave(id: number) {
    return this.http.put(`${this.apiUrl}/${id}/reject`, {});
  }

  getLeaveTypes() {
    return this.http.get(`${this.apiUrl}/types`);
  }

  getAllLeaves() {
    return this.http.get(`${this.apiUrl}/all`);
  }
}
