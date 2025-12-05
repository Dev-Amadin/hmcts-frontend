import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Task, TaskService } from './task.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'task',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent implements OnInit {
  view = 'table';
  isSubmitting = false;
  isError = false;
  isSent = false;
  callBackMessage = '';
  tasks: Task[] = [];
  isDeleting = false;
  taskToDelete = '';
  taskIdToDelete: number | null = null;

  fb = inject(FormBuilder);
  taskService = inject(TaskService);

  taskForm = this.fb.nonNullable.group({
    id: [null as number | null],
    title: ['', Validators.required],
    description: [''],
    status: ['', Validators.required],
    dueDateTime: ['', Validators.required],
  });

  ngOnInit(): void {
    this.getTasks();
  }

  get title() {
    return this.taskForm.get('title');
  }

  get description() {
    return this.taskForm.get('description');
  }

  get status() {
    return this.taskForm.get('status');
  }

  get dueDateTime() {
    return this.taskForm.get('dueDateTime');
  }

  getTasks() {
    this.taskService.getTasks().subscribe((data) => {
      this.tasks = data;
    });
  }

  addTask() {
    this.view = 'form';
  }

  cancel() {
    this.view = 'table';
    this.taskForm.reset();
  }

  edit(task: Task) {
    this.taskForm.patchValue({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      dueDateTime: task.dueDateTime
        ? new Date(task.dueDateTime).toISOString().split('T')[0]
        : '',
    });
    this.view = 'form';
  }

  delete(task: Task) {
    this.taskToDelete = task.title;
    this.taskIdToDelete = task.id;
    this.isDeleting = true;
  }

  submit() {
    this.isSubmitting = true;
    this.isError = false;
    this.isSent = false;
    this.callBackMessage = '';
    if (this.taskForm.invalid) {
      this.isSubmitting = false;
      this.callBackMessage = 'Some details are missing!';
      this.isError = true;
      return;
    }
    
    let task: Task = {
      id: this.taskForm.getRawValue().id,
      description: this.taskForm.getRawValue().description,
      title: this.taskForm.getRawValue().title,
      status: this.taskForm.getRawValue().status,
      dueDateTime: new Date(this.taskForm.getRawValue().dueDateTime),
    };
    
    if (task.id) {
      this.updateTask(task);
    } else {
      this.saveTask(task);
    }
  }

  saveTask(task: Task) {
    this.taskService.saveTask(task).subscribe({
      next: (res) => {
        this.callBackMessage = 'Task was created!';
        this.view = '';
        this.isSent = true;
        this.isError = false;
        this.isSubmitting = false;
        this.taskForm.reset();
      },
      error: (err) => {
        console.error('Error ', err);
        this.callBackMessage = err.error;
        this.isError = true;
        this.isSubmitting = false;
      },
      complete: () => (this.isSubmitting = false),
    });
  }

  updateTask(task: Task) {
    this.taskService.updateTask(task).subscribe({
      next: (res) => {
        this.callBackMessage = 'Task was updated!';
        this.view = '';
        this.isSent = true;
        this.isError = false;
        this.isSubmitting = false;
        this.taskForm.reset();
      },
      error: (err) => {
        console.error('Error ', err);
        this.callBackMessage = err.error;
        this.isError = true;
        this.isSubmitting = false;
      },
      complete: () => (this.isSubmitting = false),
    });
  }

  back() {
    this.getTasks();
    this.isSent = false;
    this.view = 'table';
    this.callBackMessage = '';
  }

  deleteBack() {
    this.isDeleting = false;
  }

  deleteTask() {
    if (this.taskIdToDelete) {
      this.taskService.deleteTaskById(this.taskIdToDelete).subscribe({
        next: (res) => {
          this.callBackMessage = `Task ${this.taskToDelete} was deleted!`;
          this.view = '';
          this.isDeleting = false;
          this.isSent = true;
          this.isError = false;
        },
        error: (err) => {
          console.log('Error ', err);
          this.callBackMessage = err.error;
          this.view = '';
          this.isDeleting = false;
          this.isSent = true;
          this.isError = true;
        },
      });
    }
  }
}
