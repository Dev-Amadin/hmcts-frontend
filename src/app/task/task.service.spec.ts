import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { Task, TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost:8080/api/hmcts/tasks';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService],
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**TEST GET ALL TASKS */
  it('should fetch all tasks', () => {
    const mockTasks: Task[] = [
      { id: 1, title: 'Task 1' } as Task,
      { id: 2, title: 'Task 2' } as Task,
    ];

    service.getTasks().subscribe((tasks) => {
      expect(tasks.length).toBe(2);
      expect(tasks).toEqual(mockTasks);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');

    req.flush(mockTasks);
  });
  

  /**TEST SAVE TASK (POST) */
  it('should save a task', () => {
    const mockTask = { id: 1, title: 'New Task' } as Task;

    service.saveTask(mockTask).subscribe((task) => {
      expect(task).toEqual(mockTask);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockTask);

    req.flush(mockTask);
  });

  
  /** TEST UPDATE TASK (PUT)*/
  it('should update a task', () => {
    const mockTask = { id: 1, title: 'Updated Task' } as Task;

    service.updateTask(mockTask).subscribe((task) => {
      expect(task).toEqual(mockTask);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockTask);

    req.flush(mockTask);
  });
  
  /** TEST DELETE TASK*/
  it('should delete a task by ID', () => {
    const taskId = 1;

    service.deleteTaskById(taskId).subscribe((response) => {
      expect(response).toBe('Task deleted');
    });

    const req = httpMock.expectOne(`${baseUrl}/${taskId}`);
    expect(req.request.method).toBe('DELETE');

    req.flush('Task deleted'); // backend text response
  });
});
