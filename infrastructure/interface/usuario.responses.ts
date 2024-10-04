export interface UserResponse {
    id: number;
    username: string;
    empleadoId: number;
    estado: boolean;
    roleRequest: {
      roleListName: string[]; // Array de roles como strings
    };
  }