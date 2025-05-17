// biome-ignore lint/style/useImportType: <explanation>
import { Component, OnInit } from '@angular/core';
// biome-ignore lint/style/useImportType: <explanation>
import { UserService } from '../../services/user.service';
// biome-ignore lint/style/useImportType: <explanation>
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-user-list',
  standalone: true, // ¡Nuevo en Angular 17+!
  imports: [CommonModule, RouterLink, HttpClientModule], // Importa módulos necesarios
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  users: any[] = [];

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (err) => {
        Swal.fire('Error', 'Error al cargar usuarios', 'error');
      }
    });
  }

  deleteUser(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(id).subscribe({
          next: () => {
            this.loadUsers();
            Swal.fire('Eliminado', 'El usuario ha sido eliminado', 'success');
          },
          error: (err) => {
            Swal.fire('Error', err.error.message || 'Error al eliminar', 'error');
          }
        });
      }
    });
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'Administrativo': return 'bg-primary';
      case 'Docente': return 'bg-success';
      case 'Estudiante': return 'bg-info';
      case 'Desarrollo': return 'bg-warning text-dark';
      default: return 'bg-secondary';
    }
  }
}
