export interface Provincia {
    id: string;
    nombre: string;
}

export interface Localidad {
    id: string;
    nombre: string;
    provinciaId: string;
}

export interface Calle {
    id: string;
    nombre: string;
    localidadId: string;
}
