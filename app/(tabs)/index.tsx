import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Button, ScrollView } from "react-native";

import EquipmentData from "../../components/report/EquipmentData";
import EvidencePhotos from "../../components/report/EvidencePhotos";
import GeneralData from "../../components/report/GeneralData";
import Measurements from "../../components/report/Measurements";
import Observations, {
  EMPTY_OBSERVATIONS,
} from "../../components/report/Observations";
import Signatures from "../../components/report/Signatures";

import Condensadora from "../../components/report/Condensadora";
import Diagnostico from "../../components/report/Diagnostico";
import Evaporadora from "../../components/report/Evaporadora";
import Refacciones from "../../components/report/Refacciones";

import { generateAndSharePDF } from "../../utils/pdfGenerator";
import {
  getReports,
  Report,
  saveReport,
  updateReport,
} from "../../utils/reportStorage";

/* ================================
   ESTADOS VACÍOS
================================ */

const EMPTY_EVAPORADORA = {
  limpiezaFiltros: false,
  limpiezaSerpentin: false,
  revisionTurbina: false,
  limpiezaDrenaje: false,
  revisionTarjeta: false,
  revisionSensores: false,
  revisionCableado: false,
  pruebaEncendido: false,
  medicionTemperatura: false,
  observaciones: "",
};

const EMPTY_CONDENSADORA = {
  limpiezaSerpentin: false,
  revisionVentilador: false,
  revisionCompresor: false,
  revisionContactor: false,
  revisionCapacitor: false,
  revisionPresiones: false,
  revisionFugas: false,
  ajusteConexiones: false,
  revisionElectrica: false,
  observaciones: "",
};

const EMPTY_REFACCIONES = {
  gas: false,
  capacitor: false,
  contactor: false,
  tarjeta: false,
  motorVentilador: false,
  compresor: false,
  otro: "",
};

const EMPTY_DIAGNOSTICO = {
  operando: false,
  mantenimientoMayor: false,
  requiereRefacciones: false,
  cambioEquipo: false,
  fueraServicio: false,
  comentario: "",
};

const EMPTY_MEASUREMENTS = {
  presionGas: "",
  corriente: "",
  voltaje: "",
};

const EMPTY_EVIDENCE = {
  filtros: { antes: null, durante: null, despues: null },
  serpentines: { antes: null, durante: null, despues: null },
  turbina: { antes: null, durante: null, despues: null },
  ventilador: { antes: null, durante: null, despues: null },
};

const EMPTY_REPORT: Omit<Report, "id" | "createdAt"> = {
  serviceType: "Preventivo",

  generalData: {
    cliente: "",
    direccion: "",
    ciudad: "",
    contacto: "",
    telefono: "",
    fecha: "",
    horaInicio: "",
    horaFin: "",
    tecnico: "",
    ayudante: "",
  },

  equipmentData: {
    ubicacion: "",
    marca: "",
    modelo: "",
    capacidadBTU: "",
    numeroSerie: "",
  },

  evaporadora: EMPTY_EVAPORADORA,
  condensadora: EMPTY_CONDENSADORA,
  refacciones: EMPTY_REFACCIONES,
  diagnostico: EMPTY_DIAGNOSTICO,

  measurements: EMPTY_MEASUREMENTS,
  evidencePhotos: EMPTY_EVIDENCE,

  observations: EMPTY_OBSERVATIONS,

  signatures: {
    tecnico: "",
    encargado: "",
    fechaFirma: "",
  },
};

export default function NewReportScreen() {
  const params = useLocalSearchParams();

  /* ✔ manejo seguro del parámetro report */
  let editingReport: Report | null = null;

  if (typeof params.report === "string") {
    try {
      editingReport = JSON.parse(params.report);
    } catch {
      editingReport = null;
    }
  }

  const isEditing = !!editingReport;

  const [report, setReport] = useState<
    Report | Omit<Report, "id" | "createdAt">
  >(EMPTY_REPORT);

  useEffect(() => {
    if (editingReport) {
      setReport({
        ...editingReport,

        evaporadora: editingReport.evaporadora ?? EMPTY_EVAPORADORA,
        condensadora: editingReport.condensadora ?? EMPTY_CONDENSADORA,
        refacciones: editingReport.refacciones ?? EMPTY_REFACCIONES,
        diagnostico: editingReport.diagnostico ?? EMPTY_DIAGNOSTICO,

        evidencePhotos: editingReport.evidencePhotos ?? EMPTY_EVIDENCE,
        measurements: editingReport.measurements ?? EMPTY_MEASUREMENTS,
        observations: editingReport.observations ?? EMPTY_OBSERVATIONS,

        signatures: editingReport.signatures ?? {
          tecnico: "",
          encargado: "",
          fechaFirma: "",
        },
      });
    } else {
      setReport(EMPTY_REPORT);
    }
  }, [editingReport]);

  /* ✔ Solo datos generales obligatorios */

  const isReportValid = () => {
    const { generalData } = report as Report;

    return (
      generalData.cliente.trim() !== "" &&
      generalData.fecha.trim() !== "" &&
      generalData.tecnico.trim() !== ""
    );
  };

  const handleSave = async () => {
    if (isEditing) {
      await updateReport(report as Report);

      Alert.alert("Reporte actualizado", "¿Deseas compartir el PDF?", [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Compartir PDF",
          onPress: () => generateAndSharePDF(report as Report),
        },
      ]);
    } else {
      await saveReport(report as Omit<Report, "id" | "createdAt">);

      const reports = await getReports();
      const savedReport = reports.at(-1);

      Alert.alert("Reporte guardado", "¿Deseas compartir el PDF?", [
        { text: "Después", style: "cancel" },
        {
          text: "Compartir PDF",
          onPress: () => savedReport && generateAndSharePDF(savedReport),
        },
      ]);
    }

    setReport(EMPTY_REPORT);
    router.replace("/history");
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <GeneralData
        data={(report as Report).generalData}
        onChange={(generalData) =>
          setReport({ ...(report as any), generalData })
        }
      />

      <EquipmentData
        data={(report as Report).equipmentData}
        onChange={(equipmentData) =>
          setReport({ ...(report as any), equipmentData })
        }
      />

      <Evaporadora
        data={(report as Report).evaporadora}
        onChange={(evaporadora) =>
          setReport({ ...(report as any), evaporadora })
        }
      />

      <Condensadora
        data={(report as Report).condensadora}
        onChange={(condensadora) =>
          setReport({ ...(report as any), condensadora })
        }
      />

      <Measurements
        data={(report as Report).measurements}
        onChange={(measurements) =>
          setReport({ ...(report as any), measurements })
        }
      />

      <EvidencePhotos
        data={(report as Report).evidencePhotos}
        onChange={(evidencePhotos) =>
          setReport({ ...(report as any), evidencePhotos })
        }
      />

      <Refacciones
        data={(report as Report).refacciones}
        onChange={(refacciones) =>
          setReport({ ...(report as any), refacciones })
        }
      />

      <Diagnostico
        data={(report as Report).diagnostico}
        onChange={(diagnostico) =>
          setReport({ ...(report as any), diagnostico })
        }
      />

      <Observations
        data={(report as Report).observations}
        onChange={(observations) =>
          setReport({ ...(report as any), observations })
        }
      />

      <Signatures
        data={(report as Report).signatures}
        onChange={(signatures) => setReport({ ...(report as any), signatures })}
      />

      <Button
        title={isEditing ? "Actualizar reporte" : "Guardar reporte"}
        disabled={!isReportValid()}
        onPress={handleSave}
      />
    </ScrollView>
  );
}
