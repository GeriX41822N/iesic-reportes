// utils/reportStorage.ts

export interface Report {
  id: string;
  createdAt: number;
  generalData: {
    cliente: string;
    fecha: string;
    tecnico: string;
  };
  equipmentData: {
    ubicacion: string;
    marca: string;
    modelo: string;
    capacidadBTU: string;
    numeroSerie: string;
  };
  activities: {
    [key: string]: boolean; // Para cualquier actividad
  };
  measurements: {
    presionGas: string;
    corriente: string;
    voltaje: string;
  };
  observations: {
    comentarioLibre: string;
  };
  evidencePhotos: {
    filtros: boolean;
    serpentines: boolean;
    turbina: boolean;
    ventilador: boolean;
  };
}
