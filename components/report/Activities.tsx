import { StyleSheet, Switch, Text, View } from 'react-native';

export type ActivitiesData = {
  limpiezaFiltros: boolean;
  limpiezaEvaporador: boolean;
  limpiezaCondensador: boolean;
  limpiezaDrenaje: boolean;
  ajusteTornilleria: boolean;
  revisionGas: boolean;
  medicionElectrica: boolean;
  revisionControlRemoto: boolean;
  verificacionGeneral: boolean;
};

type Props = {
  data: ActivitiesData;
  onChange: (data: ActivitiesData) => void;
};


function ActivityItem({
  label,
  value,
  onToggle,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={styles.item}>
      <Text style={styles.label}>{label}</Text>
      <Switch value={value} onValueChange={onToggle} />
    </View>
  );
}

export default function Activities({ data, onChange }: Props) {
  const toggle = (key: keyof ActivitiesData) => {
    onChange({
      ...data,
      [key]: !data[key],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Actividades realizadas</Text>

      <ActivityItem
        label="Limpieza de filtros de aire"
        value={data.limpiezaFiltros}
        onToggle={() => toggle('limpiezaFiltros')}
      />
      <ActivityItem
        label="Limpieza de serpentín evaporador"
        value={data.limpiezaEvaporador}
        onToggle={() => toggle('limpiezaEvaporador')}
      />
      <ActivityItem
        label="Limpieza de serpentín condensador"
        value={data.limpiezaCondensador}
        onToggle={() => toggle('limpiezaCondensador')}
      />
      <ActivityItem
        label="Limpieza de charola de drenaje y revisión de flujo"
        value={data.limpiezaDrenaje}
        onToggle={() => toggle('limpiezaDrenaje')}
      />
      <ActivityItem
        label="Ajuste de tornillería y piezas sueltas"
        value={data.ajusteTornilleria}
        onToggle={() => toggle('ajusteTornilleria')}
      />
      <ActivityItem
        label="Revisión de carga de gas refrigerante"
        value={data.revisionGas}
        onToggle={() => toggle('revisionGas')}
      />
      <ActivityItem
        label="Medición de amperaje y voltaje"
        value={data.medicionElectrica}
        onToggle={() => toggle('medicionElectrica')}
      />
      <ActivityItem
        label="Revisión de controles remotos"
        value={data.revisionControlRemoto}
        onToggle={() => toggle('revisionControlRemoto')}
      />
      <ActivityItem
        label="Verificación de funcionamiento general"
        value={data.verificacionGeneral}
        onToggle={() => toggle('verificacionGeneral')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: { color: '#ddd', flex: 1, paddingRight: 8 },
});
