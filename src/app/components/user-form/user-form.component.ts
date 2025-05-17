// biome-ignore lint/style/useImportType: <explanation>
import { Component, OnInit } from '@angular/core';
// biome-ignore lint/style/useImportType: <explanation>
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// biome-ignore lint/style/useImportType: <explanation>
import { UserService } from '../../services/user.service';
// biome-ignore lint/style/useImportType: <explanation>
import { Router, ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-user-form',
  standalone: true, // ¡Nuevo en Angular 17+!
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    RouterModule
  ], // Importa módulos necesarios
  templateUrl: './user-form.component.html',
  //styleUrls: ['./user-form.component.css']
})

export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode = false;
  userId: number | null = null;
  roles = ['Estudiante', 'Docente', 'Administrativo', 'Desarrollo'];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['Estudiante', Validators.required],
      id_docente: [null],
      num_control: [null]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      if (params['id']) {
        this.isEditMode = true;
        // biome-ignore lint/complexity/useLiteralKeys: <explanation>
        this.userId = +params['id'];
        this.loadUserData(this.userId);
      }
    });

    this.userForm.get('role')?.valueChanges.subscribe(role => {
      this.updateValidators(role);
    });
  }

  updateValidators(role: string): void {
    const idDocenteControl = this.userForm.get('id_docente');
    const numControlControl = this.userForm.get('num_control');

    if (role === 'Docente') {
      idDocenteControl?.setValidators([Validators.required]);
      numControlControl?.clearValidators();
      numControlControl?.setValue(null);
    } else if (role === 'Estudiante') {
      numControlControl?.setValidators([Validators.required]);
      idDocenteControl?.clearValidators();
      idDocenteControl?.setValue(null);
    } else {
      idDocenteControl?.clearValidators();
      numControlControl?.clearValidators();
      idDocenteControl?.setValue(null);
      numControlControl?.setValue(null);
    }

    idDocenteControl?.updateValueAndValidity();
    numControlControl?.updateValueAndValidity();
  }

  loadUserData(id: number): void {
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.userForm.patchValue({
          nombre: user.nombre,
          email: user.email,
          role: user.role,
          id_docente: user.id_docente,
          num_control: user.num_control
        });
        this.userForm.get('password')?.clearValidators();
        this.userForm.get('password')?.updateValueAndValidity();
      },
      error: () => {
        Swal.fire('Error', 'No se pudo cargar el usuario', 'error');
        this.router.navigate(['/users']);
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData = this.userForm.value;

      if (this.isEditMode && this.userId) {
        this.userService.updateUser(this.userId, userData).subscribe({
          next: () => {
            Swal.fire('Éxito', 'Usuario actualizado correctamente', 'success');
            this.router.navigate(['/users']);
          },
          error: (err) => {
            Swal.fire('Error', err.error.message || 'Error al actualizar', 'error');
          }
        });
      } else {
        this.userService.createUser(userData).subscribe({
          next: () => {
            Swal.fire('Éxito', 'Usuario creado correctamente', 'success');
            this.router.navigate(['/users']);
          },
          error: (err) => {
            Swal.fire('Error', err.error.message || 'Error al crear usuario', 'error');
          }
        });
      }

    }
  }
  navigateToUsers(){
    this.router.navigate(['/users']);
  }
}
