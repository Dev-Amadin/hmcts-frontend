import { inject, Injectable } from '@angular/core';
import { enviroment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private url = enviroment.serverUrl + '/tasks';

  http = inject(HttpClient);

  getTasks() {
    return this.http.get<Task[]>(`${this.url}`);
  }

  saveTask(task: Task) {
    return this.http.post<Task>(this.url, task);
  }

  updateTask(task: Task) {
    return this.http.put<Task>(this.url, task);
  }

  deleteTaskById(taskId:number){
    return this.http.delete(`${this.url}/${taskId}`, { responseType: 'text' })
  }
}

export interface Task {
  id: number | null;
  title: string;
  description: string;
  status: string;
  dueDateTime: Date;
}
