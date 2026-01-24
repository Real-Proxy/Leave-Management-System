import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {

  private apiUrl = 'https://localhost:7217/api/leaves';

  constructor(private http: HttpClient) {}

  applyLeave(data: any) {
    return this.http.post(`${this.apiUrl}/apply`, data);
  }

  getUserLeaves(userId: number) {
    return this.http.get(`${this.apiUrl}/user/${userId}`);
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
}
