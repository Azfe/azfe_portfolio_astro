/** Identificador MongoDB serializado como string */
export type ObjectId = string;

/** Fecha ISO 8601 serializada como string (e.g. "2024-01-15T10:30:00") */
export type ISODateString = string;

/** Campos base presentes en todas las entidades que devuelve la API */
export interface BaseEntity {
  id: ObjectId;
  created_at: ISODateString | null;
  updated_at: ISODateString | null;
}

/** Forma del formulario de contacto */
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}
